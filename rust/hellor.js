class RubriRunner {
  constructor() {
    this.worker = new Worker('rubri-worker.js', { type: 'module' });
    this.nextId = 0;
    this.pending = new Map();

    this.worker.addEventListener('message', (e) => {
      console.log('Worker message:', e.data);
      const data = e.data;
      if (data.loaded) {
        console.log('Rubri worker loaded');
        return;
      }
      
      if (data.downloaded) {
        console.log('Downloaded:', data.downloaded);
        return;
      }
      const { id, result } = data;
      if (id === undefined) {
        console.warn('Message without id:', data);
        return;
      }
      
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
const worker = new Worker("../api/endpoint.js");
let rawHarness = false;
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
let setupCode = "";
let buttons = document.getElementsByClassName('ans');
let titleEl, descEl, outEl, runBtn, checkBtn, nextBtn, prevBtn, showButtons, mustContain;
let correct = null;
let prevLessonId = null;
let hintBody = document.getElementById("hint-body");
let lessonsInRow = 0;
let streakEl = null;
let lessonhint;
let lessonXP = null;
let inputEl = null;
let editorEl = null;
// solution
let solutionFile = null;
let mode = "editor";
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
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_rust', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_rust', JSON.stringify(data));
});
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
async function loadLesson(lessonFile) {
  const path = 'lessons/' + lessonFile;
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load lesson ' + path);
  const lesson = await res.json();
  currentLesson = lesson;
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  hintBody = document.getElementById("hint-body");
  streakEl = document.getElementById('streak');
  titleEl.textContent = lesson.title || '';
  descEl.innerHTML = (window.marked ? marked.parse(lesson.description) : lesson.description) || '';
  if (editor) {
    editor.setValue(lesson.starterCode || '');
    const saved = localStorage.getItem('saved_code_rust');

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

  nextLessonId      = lesson.nextLesson      || null;
  runHarnessFile    = lesson.runHarness      || null;
  submitHarnessFile = lesson.submitHarness   || null;
  solutionFile      = lesson.solution        || null;
  mustContain       = lesson.mustContain     || null;
  correct           = lesson.correct         || null;
  prevLessonId      = lesson.previous        || null;
  lessonhint        = lesson.hint || "";
  mode              = lesson.mode            || "editor";
  rawHarness        = lesson.rawHarness  || false;
  setupCode = lesson.setupCode || "";
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
  hintBody.innerHTML = marked.parse(lessonhint);
}
function getCompletedLessons() {
  const stored = localStorage.getItem('rust_completed_lessons');
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
  localStorage.setItem('rust_completed_lessons', JSON.stringify(completed));
}
async function runWithSuite(suiteFile, label) {
  let studentSource = editor.getValue();
  const data = {
    lesson: currentLesson.id,
    code: studentSource
  };

  localStorage.setItem('saved_code_rust', JSON.stringify(data));
  outEl.textContent = (label || 'Running') + '...\n';
  lastRunOutput = '';

  let fullSource = studentSource;
  if (setupCode) {
    studentSource = setupCode + "\n" + studentSource;
  }
  if (suiteFile) {
      if (rawHarness) {
          studentSource += "\n" + suiteFile;
      } else {
          const suite = await fetch(suiteFile).then(r => r.text());
          studentSource += '\n\n' + suite;
      }
  }
  fullSource = studentSource;
  if (fullSource.includes('fn main')) {
    fullSource += '\n\nmain();\n';
  }

  try {
    const result = await rubriRunner.run(fullSource, true);
    console.log('Rubri result:', result);
    lastRunOutput = String(result);
    outEl.textContent += lastRunOutput;
  } catch (err) {
    outEl.textContent += '\nError: ' + err.message + '\n';
  }
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
async function setupLogic() {
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  hintBody = document.getElementById("hint-body");
  streakEl = document.getElementById('streak');
  const params = new URLSearchParams(location.search);
  const lessonFileFromUrl = params.get('lesson');
  const lastLesson = localStorage.getItem('rust_current_lesson');

  const lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';

  await loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + err.message;
  });
  updateLevelUI();
  runBtn  = document.getElementById('run');
  checkBtn = document.getElementById('check-stdout');
  nextBtn  = document.getElementById('next-lesson');
  prevBtn  = document.getElementById('prev-lesson');
  checkResultBtn = document.getElementById('check-result');
  loadSolutionBtn = document.getElementById('load-solution');

  rubriRunner = new RubriRunner();

  loadStreak();
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const suiteToUse = runHarnessFile || null;
      runWithSuite(suiteToUse, 'Running');
    });
  }
  function submitCheck() {
    if (!currentLesson || (!currentLesson.expectedOutput && !currentLesson.mustContain) && mode == "editor") {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }
    let actual = '';
    let expected = '';
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
        if (passed) { worker.postMessage("stop");}
    } else {
      const cleanedLines = lastRunOutput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

      const studentOut = cleanedLines.join('\n') + (cleanedLines.length ? '\n' : '');

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
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    if (passed) {
      outEl.textContent += '\n[PASS] Output matches expected.\n';
      if (mode === "text") {
        alert("Pass");
      }
      if (!alreadyCompleted) {
        lessonsInRow += 1;
        let currentXP = parseInt(localStorage.getItem('user_xp')) || 0;
        let levelCap = parseInt(localStorage.getItem('level_xp_cap')) || 100;
        let currentLevel = parseInt(localStorage.getItem('user_level')) || 0;
        
        currentXP += lessonXP;
        localStorage.setItem('user_xp', currentXP);
        
        if (currentXP >= levelCap) {
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
      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('rust_current_lesson', lessonFileFromUrl);

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
        outEl.textContent += '\n[FAIL] Output does not match. (streak reset)\n';
        if (mustContain) {
          outEl.textContent += '\nExpected to contain:\n' + mustContain;
        } else {
          outEl.textContent += '\nExpected:\n' + expected;
        }
        outEl.textContent += '\n\nGot:\n' + actual + '\n';
      }
    }
  }
  worker.onmessage = (e) => {
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
  if (checkBtn) {
    checkBtn.addEventListener('click', async () => {
      if (mode === "text") {
        submitCheck();
      } else {
        const harnessToUse = submitHarnessFile || runHarnessFile || null;
        await runWithSuite(harnessToUse, 'Submitting');
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
