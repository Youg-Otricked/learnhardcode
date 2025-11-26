

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

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./service_worker.js')
    .then(reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(error => {
      console.log('Registration failed with ' + error);
    });
}

// ========== Lesson + editor + UI logic ==========

let api;
let runHarnessFile = null;
let submitHarnessFile = null;
let editor;
let currentLesson = null;
let lastRunOutput = '';
let nextLessonId = null;
let buttons = document.getElementsByClassName('ans');
let titleEl, descEl, outEl, runBtn, checkBtn, nextBtn, prevBtn, showButtons;
let correct = null;
let prevLessonId = null;

// Helper to run with a chosen harness (or none)
async function runWithHarness(harnessFile, label) {
  const studentSource = editor.getValue();
  outEl.textContent = (label || 'Building & running') + '...\n';
  lastRunOutput = '';

  let fullSource = studentSource;

  if (harnessFile) {
    try {
      const harness = await fetch(harnessFile).then(r => r.text());
      fullSource = studentSource + '\n\n' + harness;
    } catch (e) {
      outEl.textContent += '\nError loading harness: ' + e.message + '\n';
      throw e;
    }
  }

  try {
    api.compileLinkRun(fullSource);
  } catch (err) {
    outEl.textContent += '\nError: ' + err.message + '\n';
    throw err;
  }
}

async function loadLesson(lessonFile) {
  const res = await fetch(lessonFile);
  if (!res.ok) throw new Error('Failed to load lesson ' + lessonFile);
  const lesson = await res.json();
  currentLesson = lesson;

  titleEl.textContent = lesson.title || '';
  descEl.textContent = lesson.description || '';
  if (editor) editor.setValue(lesson.starterCode || '');

  runHarnessFile    = lesson.runHarness    || null;
  submitHarnessFile = lesson.submitHarness || null;

  showButtons = lesson.showButtons;
  outEl.textContent = '';
  lastRunOutput = '';
  nextLessonId = lesson.nextLesson || null;

  document.getElementById('b1').textContent = lesson.b1t;
  document.getElementById('b2').textContent = lesson.b2t;
  document.getElementById('b3').textContent = lesson.b3t;
  document.getElementById('b4').textContent = lesson.b4t;

  correct = lesson.correct || null;
  prevLessonId = lesson.previous || null;

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

function setupLogic() {
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  runBtn  = document.getElementById('run');
  checkBtn = document.getElementById('check-stdout');
  nextBtn  = document.getElementById('next-lesson');
  prevBtn  = document.getElementById('prev-lesson');
  api = new WorkerAPI();

  api.onWrite = (text) => {
    lastRunOutput += text;
    outEl.textContent += text;
  };

  // RUN: quick run with runHarness (or no harness)
  runBtn.addEventListener('click', async () => {
    try {
      await runWithHarness(runHarnessFile, 'Running');
    } catch (_) {
      // errors already printed
    }
  });

  // CHECK: run with submitHarness (or runHarness), then compare stdout
  checkBtn.addEventListener('click', async () => {
    if (!currentLesson || !currentLesson.expectedOutput) {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }

    const harnessToUse = submitHarnessFile || runHarnessFile;

    try {
      await runWithHarness(harnessToUse, 'Submitting');
    } catch (_) {
      return; // compile/runtime error already shown
    }
    const cleanedLines = lastRunOutput
      .split('\n')
      .map(line =>
        line.replace(/\x1b\[[0-9;]*m/g, '').trim()
      )
      .filter(line => line); // drop empty lines

    // 2) Drop compiler "fluff" lines (starting with '>')
    const studentLines = cleanedLines.filter(line => !line.startsWith('>'));

    // 3) Join what's left
    const studentOut = studentLines.join('\n') + (studentLines.length ? '\n' : '');

    const expected = currentLesson.expectedOutput.trim();
    const actual   = studentOut.trim();

    if (actual === expected) {
      outEl.textContent += '\n[PASS] Output matches expected.\n';
      if (nextLessonId) nextBtn.style.display = 'inline-block';
    } else {
      outEl.textContent += '\n[FAIL] Output does not match.\n';
      outEl.textContent += '\nExpected:\n' + expected;
      outEl.textContent += '\n\nGot:\n' + actual + '\n';
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!nextLessonId) return;
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', nextLessonId);
    window.location.href = url.toString();
  });

  prevBtn.addEventListener('click', () => {
    if (!prevLessonId) return;
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', prevLessonId);
    window.location.href = url.toString();
  });

  const params = new URLSearchParams(location.search);
  const lessonFile = params.get('lesson') || 'lesson1.json';
  loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + err.message;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Monaco loader config
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
    alert('Correct');
    outEl.textContent += '\n[PASS].\n';
    if (nextLessonId) nextBtn.style.display = 'inline-block';
  } else {
    alert('Incorrect');
  }
}