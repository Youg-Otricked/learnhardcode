
console.log("hellocs.js running");
console.log('wasmRunner.js loaded');

//import { dotnet } from "./_framework/dotnet.js"; // or "./wwwroot/_framework/dotnet.js" if needed

let exportsPromise = null;

async function initRuntime() {
  if (exportsPromise) return exportsPromise;

  try {
    const { getAssemblyExports, getConfig, setModuleImports } = await dotnet.create();

    setModuleImports("CSharpMethodsJSImplementationsModule", {
      getBaseUrl: () => window.location.href,
    });

    const config = getConfig();
    const exports = await getAssemblyExports(config.mainAssemblyName);
    exportsPromise = Promise.resolve(exports);
    return exports;
  } catch (e) {
    console.error("Failed to initialize .NET runtime:", e);
    throw e;
  }
}

export async function compileAndRun(src) {
  const exports = await initRuntime();
  const output = await exports.WASM.Compiler.CompileAndRun(src);
  return output; // string from C#
}

export async function precompile(src) {
  const exports = await initRuntime();
  await exports.WASM.Compiler.PreCompile(src);
}

export async function preload() {
  const exports = await initRuntime();
  await exports.WASM.Compiler.PreloadReferences();
}
async function runCSharpCode(source) {
  try {
    const output = await compileAndRun(source);
    return output;
  } catch (e) {
    return '[EXCEPTION]\n' + e;
  }
}




// ========== Lesson + editor + UI logic ==========
let checkResultBtn;
let loadSolutionBtn; 
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
let showDebugCheckbox;
let rawOutput='';
let hintBody = null;
// streak
let lessonsInRow = 0;
let streakEl = null;

// solution
let solutionFile = null;


function loadStreak() {
  const raw = localStorage.getItem('cs_streak');
  lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
  updateStreakUI();
}


function saveStreak() {
  localStorage.setItem('cs_streak', String(lessonsInRow));
}

function updateStreakUI() {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}

async function loadLesson(lessonFile) {
  console.log("About to fetch:", lessonFile);
  const path = 'lessons/' + lessonFile;   // folder prefix
  console.log("Fetching path:", path);
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
  lessonhint        = lesson.hint || null;
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
  hintBody.textContent = lessonhint;
}

function setupLogic() {
  console.log('setupLogic start');
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
  
  // inside setupLogic():
  showDebugCheckbox = document.getElementById('show-debug');

  
  loadStreak();
  function renderOutput() {
    if (!outEl) return;
    if (showDebugCheckbox && !showDebugCheckbox.checked) {
      // hide lines starting with "dbg:"
      const visible = rawOutput
        .split('\n')
        .filter(line => !line.trim().startsWith('dbg:'))
        .join('\n');
      outEl.textContent = visible;
    } else {
      outEl.textContent = rawOutput;
    }
  }

  function appendOutput(text) {
    rawOutput += text;
    renderOutput();
  }

  if (showDebugCheckbox) {
    showDebugCheckbox.addEventListener('change', renderOutput);
  }

  async function runWithSuiteCSharp(suiteFile, label) {
    const studentSource = editor.getValue();
    rawOutput = (label || 'Building & running') + '...\n';
    renderOutput();
    lastRunOutput = '';

    let harnessSource = "";
    if (suiteFile) {
      harnessSource = await fetch(suiteFile).then(r => r.text());
    }

    try {
      const result = await runCSharpCode(studentSource + '\n' + harnessSource);
      lastRunOutput = result;
      appendOutput(result);
    } catch (err) {
      appendOutput('\nError: ' + err.message + '\n');
    }
  }

  

  function submitCheck() {
    if (!currentLesson || !currentLesson.expectedOutput) {
      appendOutput('\nNo expectedOutput defined for this lesson.\n');
      return;
    }

    const cleanedLines = lastRunOutput
      .split('\n')
      .map(line =>
        line.replace(/\x1b\[[0-9;]*m/g, '').trim()
      )
      .filter(line => line)
      .filter(line => !line.startsWith('dbg:')); // ignore debug lines

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
      appendOutput('\n[PASS] Output matches expected.\n');
      lessonsInRow += 1;
      if (useSolution) {
        lessonsInRow = 0;
        appendOutput('\n(Note: Streak reset due to loading solution.)\n');
      }
      saveStreak();
      updateStreakUI();
      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('cs_current_lesson', lessonFileFromUrl);

      if (nextLessonId) nextBtn.style.display = 'inline-block';
    } else {
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
      appendOutput('\n[FAIL] Output does not match. (streak reset)\n');
      if (mustContain) {
        appendOutput('\nExpected to contain:\n' + mustContain);
      } else {
        appendOutput('\nExpected:\n' + expected);
      }
      appendOutput('\n\nGot:\n' + actual + '\n');
    }
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".hint-toggle");
    if (!btn) return;

    const hint = btn.closest(".hint");
    hint.classList.toggle("open");

    const open = hint.classList.contains("open");
    btn.textContent = open ? "Hide hint ▴" : "Show hint ▾";
  });
  checkResultBtn.addEventListener('click', () => {
    submitCheck();

    // Restore normal controls
    useSolution = false;
    runBtn.style.display = 'inline-block';
    checkBtn.style.display = 'inline-block';
    if (prevBtn && prevLessonId) prevBtn.style.display = 'inline-block';
    checkResultBtn.style.display = 'none';
  });

  runBtn.addEventListener('click', () => {
    const suite = runHarnessFile || null;
    runWithSuiteCSharp(suite, 'Building & running');
  });

  checkBtn.addEventListener('click', async () => {
    const harnessToUse = submitHarnessFile || runHarnessFile || null;
    await runWithSuiteCSharp(harnessToUse, 'Submitting');

    runBtn.style.display = 'none';
    checkBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    checkResultBtn.style.display = 'inline-block';
  });
  // Load solution button resets streak
  loadSolutionBtn.addEventListener('click', async () => {
    if (!solutionFile) {
      appendOutput('\nNo solution available for this lesson.\n');
      return;
    }
    try {
      useSolution = true;
      const sol = await fetch(solutionFile).then(r => r.text());
      editor.setValue(sol);
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
      appendOutput('\nLoaded solution and reset streak.\n');
    } catch (e) {
      appendOutput('\nFailed to load solution: ' + e.message + '\n');
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

  console.log('About to decide lessonFile');
  let params = new URLSearchParams(location.search);
  let lessonFileFromUrl = params.get('lesson');
  let lastLesson = localStorage.getItem('cs_current_lesson');

  let lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';
  console.log('About to call loadLesson with:', lessonFile);
  loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + err.message;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  require.config({
    

    paths: { 'vs': 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
  });
  
  require(['vs/editor/editor.main'], () => {
    console.log('Monaco loaded, creating editor');
    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'csharp',
      theme: 'vs-dark',
      automaticLayout: true,
    });
    console.log('Calling setupLogic');
    setupLogic();
  });
});

function btn(bn) {
  if (bn === correct) {
    lessonsInRow += 1;
    saveStreak();
    updateStreakUI();
    alert("Correct");
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
    alert("Incorrect");
    
  }
}
window.btn = btn;
