
console.log("hellocs.js running");
console.log('wasmRunner.js loaded');
import * as Comlink from "https://unpkg.com/comlink/dist/esm/comlink.mjs";
const worker = new Worker("./wwwroot/assets/worker.js", { type: "module" });
const CLIWorker = new Worker("../api/endpoint.js");
const dotnet = Comlink.wrap(worker);
let dotnetLoaded = false;
const dotnetPromise = dotnet.startAsync().then(async () => {
    dotnetLoaded = true;
    console.log("DotNet Runtime Ready");
    
    console.log("Initializing compiler...");
    await dotnet.initAsync(frameworkPath);
});
require.config({
  paths: { 'vs': 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
});
let exportsPromise = null;
async function runCSharpCode(source) {
  if (!dotnetLoaded) {
    await dotnetPromise;
  }
  try {
    await dotnet.resetCodeAsync(source.replace(/\r\n/g, '\n') + "\n");
    console.log("Compiling...");
    const result = await dotnet.processAsync();
    if (result.diagnostics && result.diagnostics.length > 0) {
        return result.diagnostics.map(d => `[ERROR] ${d.message}`).join('\n');
    }

    return result.outputs.join("");
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
let hintBody;
let lessonXP = null;
let rawHarness = false;
// streak
const frameworkPath = window.location.origin + "/cs/wwwroot/_framework/";
let lessonsInRow = 0;
let streakEl = null;
let inputEl = null;
// solution
let actual = "";
let setupCode = "";
let solutionFile = null;
// modes
let mode = "editor";
let lessonhint;
function loadStreak() {
  const raw = localStorage.getItem('cs_streak');
  lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
  updateStreakUI();
}

let editorEl;
function saveStreak() {
  localStorage.setItem('cs_streak', String(lessonsInRow));
}

function updateStreakUI() {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}
function updateLevelUI() {
  if (localStorage.getItem('user_xp') === null) {
    localStorage.setItem('user_xp', 0);
  }
  if (localStorage.getItem('level_xp_cap') === null) {
    localStorage.setItem('level_xp_cap', 100);
  }
  if (localStorage.getItem('user_level') === null) {
    localStorage.setItem('user_level', 0);
  }
  document.getElementById("xp").textContent = `${localStorage.getItem('user_xp')} / ${localStorage.getItem('level_xp_cap')}. Level ${localStorage.getItem('user_level')}.`;
  document.getElementById("levelProg").value = localStorage.getItem('user_xp');
  document.getElementById("levelProg").max = localStorage.getItem('level_xp_cap');
}
window.copytext = function(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = `lhc ${runHarnessFile} ${elementId == 'submit-command' ? '-s' : ''}`
        
        element.textContent = 'Copied!';
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 750);
    });
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
  if (editor) {
    editor.setValue(lesson.starterCode || '');
    const saved = localStorage.getItem('saved_code_cs');

    if (saved) {
      try {
          const data = JSON.parse(saved);

          if (data?.lesson === lesson.id && typeof data.code === 'string') {
          editor.setValue(data.code);
          }
      } catch (e) {
      }
    }
  }

  showButtons = lesson.showButtons;
  outEl.textContent = '';
  lastRunOutput = '';
  console.log('Loaded lesson:', lesson.id, 'showButtons=', showButtons);
  

  nextLessonId      = lesson.nextLesson      || null;
  runHarnessFile    = lesson.runHarness      || null;
  submitHarnessFile = lesson.submitHarness   || null;
  solutionFile      = lesson.solution        || null;
  mustContain       = lesson.mustContain     || null;
  correct           = lesson.correct         || null;
  prevLessonId      = lesson.previous        || null;
  lessonhint        = lesson.hint            || "";
  mode              = lesson.mode            || "editor";
  rawHarness        = lesson.rawHarness       || false;
  setupCode         = lesson.setupCode       || "";
  document.getElementById("difficulty").textContent = lesson.difficulty ? "Diffficulty: " + lesson.difficulty : "Difficulty: unknown";
  lessonXP          = parseInt(lesson.xp, 10)|| 0;
  editorEl = document.getElementsByClassName("code-box")[0];
  inputEl = document.getElementsByClassName("editor")[0];
  if (mode === "text") {
    editorEl.innerHTML = '<textarea class="editor"></textarea><button id="check-stdout">Submit</button><button id="next-lesson" style="display:none">Next Lesson</button><button id="prev-lesson">Previous Lesson</button>'
    checkBtn = document.getElementById('check-stdout');
    nextBtn  = document.getElementById('next-lesson');
    prevBtn  = document.getElementById('prev-lesson');
    inputEl = document.getElementsByClassName("editor")[0];
  } else if (mode === 'cli') {
    editorEl.innerHTML = `
<div style="border: 2px solid #333; padding: 1rem; border-radius: 8px; background: #1e1e1e; margin-bottom: 1rem;">
    <h2 style='margin-top: 0;'>Run</h2>
    <div style="display: flex; align-items: center; gap: 1rem; background: #2d2d2d; padding: 0.75rem; border-radius: 4px;">
        <code id="run-command" style="flex: 1; color: #00ff00; font-family: 'Courier New', monospace; user-select: all;">lhc run ${runHarnessFile}</code>
        <button onclick='copytext("run-command")' style="border: none; cursor: pointer; font-weight: bold;">Copy</button>
    </div>
</div>
<div style="border: 2px solid #333; padding: 1rem; border-radius: 8px; background: #1e1e1e; margin-bottom: 1rem;">
    <h2 style='margin-top: 0;'>Submit</h2>
    <div style="display: flex; align-items: center; gap: 1rem; background: #2d2d2d; padding: 0.75rem; border-radius: 4px;">
        <code id="submit-command" style="flex: 1; color: #00ff00; font-family: 'Courier New', monospace; user-select: all;">lhc run ${runHarnessFile} -s</code>
        <button onclick='copytext("submit-command")' style="cursor: pointer; font-weight: bold;">Copy</button>
    </div>
</div>
<div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
    <button id="prev-lesson">Previous Lesson</button>
    <button id="next-lesson" style="display:none">Next Lesson</button>
    <button id="load-solution">View Solution Files</button>
</div>
<pre id="out"></pre>
`
    nextBtn  = document.getElementById('next-lesson');
    prevBtn  = document.getElementById('prev-lesson');
    outEl   = document.getElementById('out');
  }
  nextBtn  = document.getElementById('next-lesson');
  document.getElementById("b1").textContent = lesson.b1t;
  document.getElementById("b2").textContent = lesson.b2t;
  document.getElementById("b3").textContent = lesson.b3t;
  document.getElementById("b4").textContent = lesson.b4t;
  updateLevelUI();
  console.log('Button texts set to:', lesson.b1t, lesson.b2t, lesson.b3t, lesson.b4t);
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
  if (hintBody) {
    hintBody.innerHTML = marked.parse(lessonhint);
  }
}
function getCompletedLessons() {
  const stored = localStorage.getItem('cs_completed_lessons');
  return stored ? JSON.parse(stored) : {};
}
function isLessonCompleted(lessonId) {
  const completed = getCompletedLessons();
  return completed[lessonId]?.completed || false;
}
function markLessonCompleted(lessonId, xpEarned) {
  const completed = getCompletedLessons();
  completed[lessonId] = {
    lessonId,
    completed: true,
    xpEarned,
    attempts: (completed[lessonId]?.attempts || 0) + 1,
    completedAt: Date.now(),
    mode: mode
  };
  localStorage.setItem('cs_completed_lessons', JSON.stringify(completed));
}
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_cs', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_cs', JSON.stringify(data));
});
async function setupLogic() {
  console.log('setupLogic start');
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  streakEl = document.getElementById('streak');
  hintBody = document.getElementById("hint-body");
  showDebugCheckbox = document.getElementById('show-debug');
  console.log('About to decide lessonFile');
  let params = new URLSearchParams(location.search);
  let lessonFileFromUrl = params.get('lesson');
  let lastLesson = localStorage.getItem('cs_current_lesson');

  let lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';
  console.log('About to call loadLesson with:', lessonFile);
  await loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + err.message;
  });
  runBtn  = document.getElementById('run');
  checkBtn = document.getElementById('check-stdout');
  nextBtn  = document.getElementById('next-lesson');
  prevBtn  = document.getElementById('prev-lesson');
  checkResultBtn = document.getElementById('check-result');
  loadSolutionBtn = document.getElementById('load-solution');

  
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
    let studentSource = editor.getValue();
    const data = {
      lesson: currentLesson.id,
      code: studentSource
    };

    localStorage.setItem('saved_code_cs', JSON.stringify(data));
    rawOutput = (label || 'Building & running') + '...\n';
    renderOutput();
    lastRunOutput = '';
    
    let harnessSource = "";
    if (suiteFile) {
      if (rawHarness) {
        harnessSource = suiteFile;
      } else {
        const suite = await fetch(suiteFile).then(r => r.text());
        harnessSource = suite;
      }
    }

    if (setupCode) {
      studentSource = setupCode + "\n" + studentSource;
    }

    try {
      const fullSource = studentSource + '\n' + harnessSource;
      const result = await runCSharpCode(fullSource);
      lastRunOutput = result; 
      appendOutput(result);
      submitCheck(); 
    } catch (err) {
      appendOutput('\nError: ' + err.message + '\n');
    }
  } 
  function submitCheck() {
    if (!currentLesson || (!currentLesson.expectedOutput && !currentLesson.mustContain) && mode == "editor") {
      appendOutput('\nNo expectedOutput defined for this lesson.\n');
      return;
    }
    let expected = '';
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    let passed = false;
    if (mode === "text") {
      actual = inputEl.value;
      if (mustContain) {
        if (Array.isArray(mustContain)) {
            for (let str of mustContain) {
                passed = actual.includes(str);
                if (!passed) break
            }
        } else {
            passed = actual.includes(mustContain);
        }
      } else {
        expected = currentLesson.expectedOutput.trim();
        passed = (actual === expected);
      }
    } else if (mode === 'cli') { 
      const cli = localStorage.getItem('cli_success');
      const [status, hash] = cli.split(':');
      passed = status === 'PASS' && hash === runHarnessFile;
      if (passed) { CLIWorker.postMessage("stop");}
    } else {
      const cleanedLines = lastRunOutput
        .split('\n')
        .map(line =>
          line.replace(/\x1b\[[0-9;]*m/g, '').trim()
        )
        .filter(line => line)
        .filter(line => !line.startsWith('dbg:'))
        .filter(line => !line.startsWith('Exits with code'));

      const studentLines = cleanedLines.filter(line => !line.startsWith('>'));
      const studentOut = studentLines.join('\n') + (studentLines.length ? '\n' : '');

      expected = currentLesson.expectedOutput.trim();
      actual   = studentOut.trim();
      if (mustContain) {
        if (Array.isArray(mustContain)) {
            for (let str of mustContain) {
                passed = actual.includes(str);
                if (!passed) break
            }
        } else {
            passed = actual.includes(mustContain);
        }
      } else {
        passed = (actual === expected);
      }
    }
    
    if (passed) {
      appendOutput('\n[PASS] Output matches expected.\n');
      if (!alreadyCompleted) {
        lessonsInRow += 1;
        let currentXP = parseInt(localStorage.getItem('user_xp')) || 0;
        let levelCap = parseInt(localStorage.getItem('level_xp_cap')) || 100;
        let currentLevel = parseInt(localStorage.getItem('user_level')) || 0;
        
        currentXP += lessonXP;
        localStorage.setItem('user_xp', currentXP);
        
        while (currentXP >= levelCap) {
          currentXP -= levelCap;
          levelCap += 50;
          currentLevel += 1;
          localStorage.setItem('user_xp', currentXP);
          localStorage.setItem('level_xp_cap', levelCap);
          localStorage.setItem('user_level', currentLevel);
        }
        markLessonCompleted(currentLesson.id, lessonXP);
        if (useSolution) {
          lessonsInRow = 0;
          appendOutput('\n(Note: Streak reset due to loading solution.)\n');
        }
      } else {
        appendOutput('\n(Already completed - no XP gained.)\n');
      }
      if (mode === "text") {
        alert('Pass');
      } 
      saveStreak();
      updateStreakUI();
      updateLevelUI();
      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('cs_current_lesson', lessonFileFromUrl);

      if (nextLessonId) nextBtn.style.display = 'inline-block';
    } else {
      if (!alreadyCompleted) {
        lessonsInRow = 0;
        saveStreak();
        updateStreakUI();
      }
      if (mode === "text") {
        alert('Fail');
      } else {
        appendOutput('\n[FAIL] Output does not match. (streak reset)\n');
        if (mustContain) {
          appendOutput('\nExpected to contain:\n' + mustContain);
        } else {
          appendOutput('\nExpected:\n' + expected);
        }
        appendOutput('\n\nGot:\n' + actual + '\n');
      }
    }
  }
  CLIWorker.onmessage = (e) => {
    console.log("WORKER MSG:", e.data);
    localStorage.setItem("cli_success", e.data.success);
    if (mode === 'cli') {
      if (currentLesson) {
        submitCheck();
        localStorage.removeItem("cli_success");
      }
    }
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".hint-toggle");
    if (!btn) return;

    const hint = btn.closest(".hint");
    hint.classList.toggle("open");

    const open = hint.classList.contains("open");
    btn.textContent = open ? "Hide hint ▴" : "Show hint ▾";
  });
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', () => {
      submitCheck();

      // Restore normal controls
      useSolution = false;
      runBtn.style.display = 'inline-block';
      checkBtn.style.display = 'inline-block';
      if (prevBtn && prevLessonId) prevBtn.style.display = 'inline-block';
      checkResultBtn.style.display = 'none';
    });
  }
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const suiteToUse = runHarnessFile || null;
      runWithSuiteCSharp(suiteToUse, 'Building & running');
    });
  }
  if (checkBtn) { 
    checkBtn.addEventListener('click', async () => {
      if (mode === "text") {
        submitCheck();
      } else {
        const harnessToUse = submitHarnessFile || runHarnessFile || null;
        await runWithSuiteCSharp(harnessToUse, 'Submitting');

        runBtn.style.display = 'none';
        checkBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        checkResultBtn.style.display = 'inline-block';
      }
    });
  }
  if (loadSolutionBtn) {
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
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!nextLessonId) return;
      let url = new URL(window.location.href);
      url.searchParams.set('lesson', nextLessonId);
      window.location.href = url.toString();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!prevLessonId) return;
      let url = new URL(window.location.href);
      url.searchParams.set('lesson', prevLessonId);
      window.location.href = url.toString();
    });
  }
  if (prevBtn) {
    prevBtn.style.display = prevLessonId ? 'inline-block' : 'none';
  }
  if (nextBtn) {
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    nextBtn.style.display = alreadyCompleted ? 'inline-block' : 'none';
  }
}
require(['vs/editor/editor.main'], async () => {
  console.log('Monaco Loaded');

  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'csharp',
    theme: 'vs-dark',
    automaticLayout: true,
  });
  setupLogic();
});


window.btn = function(bn) {
  if (bn === correct) {
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    outEl.textContent += '\n[PASS] Output matches expected.\n';
    if (!alreadyCompleted) {
      lessonsInRow += 1;
      
      let currentXP = parseInt(localStorage.getItem('user_xp')) || 0;
      let levelCap = parseInt(localStorage.getItem('level_xp_cap')) || 100;
      let currentLevel = parseInt(localStorage.getItem('user_level')) || 0;
      
      currentXP += lessonXP;
      localStorage.setItem('user_xp', currentXP);
      
      while (currentXP >= levelCap) {
        currentXP -= levelCap;
        levelCap += 50;
        currentLevel += 1;
        localStorage.setItem('user_xp', currentXP);
        localStorage.setItem('level_xp_cap', levelCap);
        localStorage.setItem('user_level', currentLevel);
      }
      markLessonCompleted(currentLesson.id, lessonXP);
      
      if (useSolution) {
        lessonsInRow = 0;
        outEl.textContent += '\n(Note: Streak reset due to loading solution.)\n';
      }
    } else {
      outEl.textContent += '\n(Already completed - no XP gained.)\n';
    }
    saveStreak();
    updateStreakUI();
    updateLevelUI();
    alert("Correct");
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
