// rust.js

// ===== Rubri runner wrapper (instead of WorkerAPI) =====

class RubriRunner {
  constructor() {
    this.worker = new Worker('rubri-worker.js', { type: 'module' });
    this.nextId = 0;
    this.pending = new Map();

    this.worker.addEventListener('message', (e) => {
      console.log('Worker message:', e.data); // <-- add this
      const data = e.data;
      if (data.loaded) {
        console.log('Rubri worker loaded');
        return;
      }
      const { id, result } = data;
      const cb = this.pending.get(id);
      if (cb) {
        this.pending.delete(id);
        cb(result);
      } else {
        console.warn('No pending callback for id', id);
      }
    });
  }

  run(code, printLast = true) {
    return new Promise((resolve) => {
      const id = this.nextId++;
      this.pending.set(id, resolve);
      console.log('Posting to worker:', { id, printLast }); // debug
      this.worker.postMessage({ id, code, printLast });
    });
  }
}

// ===== Lesson + editor + UI logic =====

let checkResultBtn;
let loadSolutionBtn;
let rubriRunner;
let useSolution = false;
let editor;
let currentLesson = null;
let lastRunOutput = '';
let nextLessonId = null;
let submitHarnessFile = null;
let runHarnessFile = null;
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
  const raw = localStorage.getItem('rust_streak');
  lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
  updateStreakUI();
}

function saveStreak() {
  localStorage.setItem('rust_streak', String(lessonsInRow));
}

function updateStreakUI() {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}

async function loadLesson(lessonFile) {
  const path = 'lessons/' + lessonFile;
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load lesson ' + path);
  const lesson = await res.json();
  currentLesson = lesson;
  
  titleEl.textContent = lesson.title || '';
  descEl.innerHTML = (window.marked ? marked.parse(lesson.description) : lesson.description) || '';
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

  nextBtn.style.display = 'none';
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

async function runWithSuite(suiteFile, label) {
  const studentSource = editor.getValue();
  outEl.textContent = (label || 'Running') + '...\n';
  lastRunOutput = '';

  let fullSource = studentSource;

  if (suiteFile) {
    const suite = await fetch(suiteFile).then(r => r.text());
    // adjust order if you design Rust harnesses differently
    fullSource = suite + '\n\n' + studentSource;
  }

  try {
    const result = await rubriRunner.run(fullSource, true);
    console.log('Rubri result:', result);
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    lastRunOutput = stdout + (stderr || '');
    outEl.textContent += lastRunOutput;
  } catch (err) {
    outEl.textContent += '\nError: ' + err.message + '\n';
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

  rubriRunner = new RubriRunner();

  loadStreak();

  runBtn.addEventListener('click', () => {
    const suite = runHarnessFile || null;
    runWithSuite(suite, 'Running');
  });

  function submitCheck() {
    if (!currentLesson || !currentLesson.expectedOutput) {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }

    const cleanedLines = lastRunOutput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    const studentOut = cleanedLines.join('\n') + (cleanedLines.length ? '\n' : '');

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

      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('rust_current_lesson', lessonFileFromUrl);

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

  const params = new URLSearchParams(location.search);
  const lessonFileFromUrl = params.get('lesson');
  const lastLesson = localStorage.getItem('rust_current_lesson');

  const lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';

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
      language: 'rust',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    setupLogic();
  });
});

function btn(bn) {
  if (bn === correct) {
    lessonsInRow += 1;
    saveStreak();
    updateStreakUI();
    alert('Correct');
    if (useSolution) {
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
    }
    useSolution = false;
    outEl.textContent += '\n[PASS].\n';
    if (nextLessonId) nextBtn.style.display = 'inline-block';
  } else {
    lessonsInRow = 0;
    saveStreak();
    updateStreakUI();
    alert('Incorrect');
  }
}