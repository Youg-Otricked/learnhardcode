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
const worker = new Worker("../api/endpoint.js");
let checkResultBtn;
let loadSolutionBtn;
let api;
let useSolution = false;
let editor;             
let currentLesson = null;
let lastRunOutput = '';
let actual = "";
let nextLessonId = null;
let submitHarnessFile, runHarnessFile; 
let buttons = document.getElementsByClassName('ans');
let titleEl, descEl, outEl, runBtn, checkBtn, nextBtn, prevBtn, showButtons, mustContain;
let correct = null;
let setupCode = "";
let prevLessonId = null;
let hintBody = null;
let lessonXP = null;
// streak
let lessonsInRow = 0;
let streakEl = null;
let lessonhint;
// solution
let solutionFile = null;
let editorEl;
// modes
let mode = "editor";
let rawHarness = false;
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
        const originalText = `lhc run ${runHarnessFile} ${elementId == 'submit-command' ? '-s' : ''}`
        
        element.textContent = 'Copied!';
        
        setTimeout(() => {
            element.textContent = originalText;
        }, 750);
    });
}
async function loadLesson(lessonFile) {
  const path = 'lessons/' + lessonFile;
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load lesson ' + path);
  const lesson = await res.json();
  currentLesson = lesson;
  
  titleEl.textContent = lesson.title || '';
  descEl.innerHTML = marked.parse(lesson.description) || '';
  if (editor) {
    editor.setValue(lesson.starterCode || '');
    const saved = localStorage.getItem('saved_code_cpp');

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
  lessonhint        = lesson.hint || "";
  nextLessonId      = lesson.nextLesson      || null;
  runHarnessFile    = lesson.runHarness      || null;
  submitHarnessFile = lesson.submitHarness   || null;
  solutionFile      = lesson.solution        || null;
  mustContain       = lesson.mustContain     || null;
  correct           = lesson.correct         || null;
  prevLessonId      = lesson.previous        || null;
  mode              = lesson.mode            || "editor";
  setupCode         = lesson.setupCode       || "";
  rawHarness = lesson.rawHarness || false;
  document.getElementById("difficulty").textContent = lesson.difficulty ? "Diffficulty: " + lesson.difficulty : "Difficulty: unknown";
  lessonXP          = parseInt(lesson.xp, 10)|| 0;
  editorEl = document.getElementsByClassName("code-box")[0];
  inputEl = document.getElementsByClassName("editor")[0];
  nextBtn  = document.getElementById('next-lesson');
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
  updateLevelUI();
  document.getElementById("b1").textContent = lesson.b1t;
  document.getElementById("b2").textContent = lesson.b2t;
  document.getElementById("b3").textContent = lesson.b3t;
  document.getElementById("b4").textContent = lesson.b4t;
  nextBtn.style.display = 'none'; // hide until pass
  if (prevBtn) prevBtn.style.display = prevLessonId ? 'inline-block' : 'none';
  requestAnimationFrame(() => {
    const btns = document.querySelectorAll('.ans');
    btns.forEach(b => {
      if (b) {
        b.style.setProperty('display', showButtons ? 'inline-block' : 'none', 'important');
      }
    });
  });

  hintBody.innerHTML = marked.parse(lessonhint);
}
function forceShowAnswerButtons() {
  const btns = document.querySelectorAll('.ans');
  btns.forEach(b => {
      b.style.setProperty('display', showButtons ? 'inline-block' : 'none', 'important');
  });
}
function getCompletedLessons() {
  const stored = localStorage.getItem('cpp_completed_lessons');
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
  localStorage.setItem('cpp_completed_lessons', JSON.stringify(completed));
}
async function setupLogic() {
  titleEl = document.getElementById('lesson-title');
  descEl  = document.getElementById('lesson-description');
  outEl   = document.getElementById('out');
  hintBody = document.querySelector(".hint-body");
  streakEl = document.getElementById('streak');
  
  api = new WorkerAPI();
  api.onWrite = (text) => {
    lastRunOutput += text;
    const lines = lastRunOutput
      .split('\n')
      .map(line => line.replace(/\x1b\[[0-9;]*m/g, ''));
    const firstUserLineIndex = lines.findIndex(line => 
      !line.match(/^[>#]/)
    );
    const filteredLines = firstUserLineIndex >= 0 
      ? lines.slice(firstUserLineIndex)
      : [];
    
    outEl.textContent = filteredLines.join('\n');
  };

  loadStreak();
  let params = new URLSearchParams(location.search);
  let lessonFileFromUrl = params.get('lesson');
  let lastLesson = localStorage.getItem('cpp_current_lesson');

  let lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';
  await loadLesson(lessonFile).then(() => {
    requestAnimationFrame(() => {
      forceShowAnswerButtons();
    });
  })
  runBtn  = document.getElementById('run');
  checkBtn = document.getElementById('check-stdout');
  nextBtn  = document.getElementById('next-lesson');
  prevBtn  = document.getElementById('prev-lesson');
  checkResultBtn = document.getElementById('check-result');
  loadSolutionBtn = document.getElementById('load-solution');
  async function runWithSuite(suiteFile, label) {
    const studentSource = editor.getValue();
    const data = {
      lesson: currentLesson.id,
      code: studentSource
    };

    localStorage.setItem('saved_code_cpp', JSON.stringify(data));
    outEl.textContent = (label || 'Building & running') + '...\n';
    lastRunOutput = '';
    if (setupCode) {
      studentSource = setupCode + "\n" + studentSource;
    }
    let fullSource = studentSource;
    if (suiteFile) {
      if (rawHarness) {
        fullSource = studentSource + '\n\n' + suiteFile;
      } else {
        const suite = await fetch(suiteFile).then(r => r.text());
        fullSource = suite + '\n\n' + studentSource;
      }
    }
    try {
      api.compileLinkRun(fullSource); // fire-and-forget
    } catch (err) {
      outEl.textContent += '\nError: ' + err.message + '\n';
    }
  }
  if (checkResultBtn) {
    checkResultBtn.addEventListener('click', () => {
      submitCheck();
      useSolution = false;
      runBtn.style.display = 'inline-block';
      checkBtn.style.display = 'inline-block';
      if (prevBtn && prevLessonId) prevBtn.style.display = 'inline-block';
      checkResultBtn.style.display = 'none';
    });
  }
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const suite = runHarnessFile || null;
      runWithSuite(suite, 'Building & running');
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
  function submitCheck() {
    if (!currentLesson || (!currentLesson.expectedOutput && !currentLesson.mustContain) && mode == "editor") {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }
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
        .map(line => line.replace(/\x1b\[[0-9;]*m/g, '').trim())
        .filter(line => line);

      const studentLines = cleanedLines.filter(line => !line.startsWith('>'));
      const studentOut = studentLines.join('\n') + (studentLines.length ? '\n' : '');

      expected = currentLesson.expectedOutput.trim();
      actual = studentOut.trim();

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
      
      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('cpp_current_lesson', lessonFileFromUrl);

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
  forceShowAnswerButtons();
}
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_cpp', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_cpp', JSON.stringify(data));
});
document.addEventListener('DOMContentLoaded', () => {
  if (mode == 'editor') {
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
  }
});

window.btn = function(bn) {
  if (bn === correct) {
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
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
    } else {
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