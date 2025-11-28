const { use } = require("react");


class WorkerAPI {
  constructor() {
    this.nextResponseId = 0;
    this.responseCBs = new Map();
    this.worker = new Worker('worker.js');
    const channel = new MessageChannel();
    this.port = channel.port1;
    this.port.onmessage = this.onmessage.bind(this);

    const remotePort = channel.port2;
    this.worker.postMessage({ id: 'constructor', data: remotePort }, [remotePort]);

    this.onWrite = null;
  }

  setShowTiming(value) {
    this.port.postMessage({ id: 'setShowTiming', data: value });
  }

  terminate() {
    this.worker.terminate();
  }

  async runAsync(id, options) {
    const responseId = this.nextResponseId++;
    const responsePromise = new Promise((resolve, reject) => {
      this.responseCBs.set(responseId, { resolve, reject });
    });
    this.port.postMessage({ id, responseId, data: options });
    return await responsePromise;
  }

  async compileToAssembly(options) {
    return this.runAsync('compileToAssembly', options);
  }

  async compileTo6502(options) {
    return this.runAsync('compileTo6502', options);
  }

  compileLinkRun(contents) {
    this.port.postMessage({ id: 'compileLinkRun', data: contents });
  }

  postCanvas(offscreenCanvas) {
    this.port.postMessage({ id: 'postCanvas', data: offscreenCanvas }, [offscreenCanvas]);
  }

  onmessage(event) {
    switch (event.data.id) {
      case 'write':
        if (this.onWrite) this.onWrite(event.data.data);
        break;

      case 'runAsync': {
        const responseId = event.data.responseId;
        const promise = this.responseCBs.get(responseId);
        if (promise) {
          this.responseCBs.delete(responseId);
          promise.resolve(event.data.data);
        }
        break;
      }
    }
  }
}



// ========== Lesson + editor + UI logic ==========
let checkResultBtn;
let loadSolutionBtn;
let api;
let useSolution = false;
let editor;             
let currentLesson = null;
let lastRunOutput = '';
let nextLessonId = null;
let submitHarnessFile, runHarnessFile; 
let buttons = document.getElementsByClassName('ans');
let titleEl, descEl, outEl, runBtn, checkBtn, nextBtn, prevBtn, showButtons, mustContain;
let correct = null;
let prevLessonId = null;

// streak
let lessonsInRow = 0;
let streakEl = null;

// solution
let solutionFile = null;

function loadStreak() {
  const raw = localStorage.getItem('cpp_streak');
  lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
  updateStreakUI();
}

function saveStreak() {
  localStorage.setItem('cpp_streak', String(lessonsInRow));
}

function updateStreakUI() {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}

async function loadLesson(lessonFile) {
  const path = 'lessons/' + lessonFile;   // folder prefix
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load lesson ' + path);
  const lesson = await res.json();
  currentLesson = lesson;

  titleEl.textContent = lesson.title || '';
  descEl.innerHTML = marked.parse(lesson.description) || '';
  if (editor) editor.setValue(lesson.starterCode || '');

  showButtons = lesson.showButtons;
  outEl.textContent = '';
  lastRunOutput = '';

  nextLessonId      = lesson.nextLesson      || null;
  runHarnessFile    = lesson.runHarness      || null;
  submitHarnessFile = lesson.submitHarness   || null;
  solutionFile      = lesson.solution        || null;
  mustContain       = lesson.mustContain     || null;
  correct           = lesson.correct         || null;
  prevLessonId      = lesson.previous        || null;

  document.getElementById("b1").textContent = lesson.b1t;
  document.getElementById("b2").textContent = lesson.b2t;
  document.getElementById("b3").textContent = lesson.b3t;
  document.getElementById("b4").textContent = lesson.b4t;

  nextBtn.style.display = 'none'; // hide until pass
  const btns = document.querySelectorAll('.ans');
  if (prevBtn) prevBtn.style.display = prevLessonId ? 'inline-block' : 'none';

  if (showButtons) {
    btns.forEach(button => {
      button.style.display = 'block';
    });
  } else {
    btns.forEach(button => {
      button.style.display = 'none';
    });
  }
}

function setupLogic() {
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  runBtn  = document.getElementById('run');
  checkBtn = document.getElementById('check-stdout');
  nextBtn  = document.getElementById('next-lesson');
  prevBtn  = document.getElementById('prev-lesson');
  checkResultBtn = document.getElementById('check-result');
  loadSolutionBtn = document.getElementById('load-solution');
  streakEl = document.getElementById('streak');

  api = new WorkerAPI();

  api.onWrite = (text) => {
    lastRunOutput += text;
    outEl.textContent += text;
  };

  loadStreak();

  async function runWithSuite(suiteFile, label) {
    const studentSource = editor.getValue();
    outEl.textContent = (label || 'Building & running') + '...\n';
    lastRunOutput = '';

    let fullSource = studentSource;

    if (suiteFile) {
      const suite = await fetch(suiteFile).then(r => r.text());
      fullSource = suite + '\n\n' + studentSource;
    }

    try {
      api.compileLinkRun(fullSource); // fire-and-forget
    } catch (err) {
      outEl.textContent += '\nError: ' + err.message + '\n';
    }
  }

  runBtn.addEventListener('click', () => {
    const suite = runHarnessFile || null;
    runWithSuite(suite, 'Building & running');
  });

  function submitCheck() {
    if (!currentLesson || !currentLesson.expectedOutput) {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }

    const cleanedLines = lastRunOutput
      .split('\n')
      .map(line =>
        line.replace(/\x1b\[[0-9;]*m/g, '').trim()
      )
      .filter(line => line);

    const studentLines = cleanedLines.filter(line => !line.startsWith('>'));
    const studentOut = studentLines.join('\n') + (studentLines.length ? '\n' : '');

    const expected = currentLesson.expectedOutput.trim();
    const actual   = studentOut.trim();

    let passed = false;

    if (mustContain) {
      passed = actual.includes(mustContain);
    } else {
      passed = (actual === expected);
    }

    if (passed) {
      outEl.textContent += '\n[PASS] Output matches expected.\n';
      lessonsInRow += 1;
      if (useSolution) {
        lessonsInRow = 0;
        outEl.textContent += '\n(Note: Streak reset due to loading solution.)\n';
      }
      saveStreak();
      updateStreakUI();
      if (nextLessonId) nextBtn.style.display = 'inline-block';
    } else {
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
      outEl.textContent += '\n[FAIL] Output does not match. (streak reset)\n';
      if (mustContain) {
        outEl.textContent += '\nExpected to contain:\n' + mustContain;
      } else {
        outEl.textContent += '\nExpected:\n' + expected;
      }
      outEl.textContent += '\n\nGot:\n' + actual + '\n';
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
    }
  }

  checkResultBtn.addEventListener('click', () => {
    submitCheck();

    // Restore normal controls
    useSolution = false;
    runBtn.style.display = 'inline-block';
    checkBtn.style.display = 'inline-block';
    if (prevBtn && prevLessonId) prevBtn.style.display = 'inline-block';
    checkResultBtn.style.display = 'none';
  });

  checkBtn.addEventListener('click', async () => {
    const harnessToUse = submitHarnessFile || runHarnessFile || null;
    await runWithSuite(harnessToUse, 'Submitting');

    // Hide normal controls
    runBtn.style.display = 'none';
    checkBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';

    // Show "Check Result" button
    checkResultBtn.style.display = 'inline-block';
  });

  // Load solution button resets streak
  loadSolutionBtn.addEventListener('click', async () => {
    if (!solutionFile) {
      outEl.textContent += '\nNo solution available for this lesson.\n';
      return;
    }
    try {
      useSolution = true;
      const sol = await fetch(solutionFile).then(r => r.text());
      editor.setValue(sol);
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
      outEl.textContent += '\nLoaded solution and reset streak.\n';
    } catch (e) {
      outEl.textContent += '\nFailed to load solution: ' + e.message + '\n';
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!nextLessonId) return;
    let url = new URL(window.location.href);
    url.searchParams.set('lesson', nextLessonId);
    window.location.href = url.toString();
  });

  prevBtn.addEventListener('click', () => {
    if (!prevLessonId) return;
    let url = new URL(window.location.href);
    url.searchParams.set('lesson', prevLessonId);
    window.location.href = url.toString();
  });

  let params = new URLSearchParams(location.search);
  let lessonFile = params.get('lesson') || 'lesson1.json';
  loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + err.message;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  require.config({
    paths: { 'vs': 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
  });

  require(['vs/editor/editor.main'], () => {
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'cpp',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    setupLogic();
  });
});

function btn(bn) {
  if (bn === correct) {
    alert("Correct");
    outEl.textContent += '\n[PASS].\n';
    if (nextLessonId) nextBtn.style.display = 'inline-block';
  } else {
    alert("Incorrect");
  }
}