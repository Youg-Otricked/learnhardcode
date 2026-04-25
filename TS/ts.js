const CLIworker = new Worker("../api/endpoint.js");
let worker = null;
let editor = null;
let currentLesson = null;
let lastRunOutput = '';
let nextLessonId = null;
let prevLessonId = null;
let lessonsInRow = 0;
let mustContain = null;
let b1Btn, b2Btn, b3Btn, b4Btn;
let correct = null;
let runHarnessFile = null;
let submitHarnessFile = null;
let useSolution = false;
let lessonXP = null;
let titleEl, descEl, outEl, runBtn, checkBtn, nextBtn, prevBtn, streakEl, hintBody;
let editorEl = null;
let inputEl = null;
let mode = "";
let checkResultBtn = null;
let rawHarness = false;
let setupCode = "";
let suite;
let runId = 0;
let currentReject = null;
function loadStreak() {
    const raw = localStorage.getItem('ts_streak');
    lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
    updateStreakUI();
}

function saveStreak() {
    localStorage.setItem('ts_streak', String(lessonsInRow));
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
function runTS(code) {
    lastRunOutput = '';
    outEl.className = '';

    const id = ++runId;

    const jsCode = ts.transpileModule(code, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            strict: true,
            module: ts.ModuleKind.ESNext,
            removeComments: true,
        }
    }).outputText;

    const output = [];

    if (worker) {
        worker.terminate();
        worker = null;
    }

    worker = new Worker("tsworker.js");

    worker.onmessage = (e) => {
        const { type, data, run } = e.data;
        if (run !== id) return;
        if (type === "log") {
            output.push(data);
            lastRunOutput = output.join('\n');
            outEl.textContent = lastRunOutput;
        }
        if (type === "error") {
            lastRunOutput = 'Runtime Error: ' + data;
            outEl.textContent = lastRunOutput;
            outEl.className = 'error';
        }
    };
    console.log("posting to worker:", worker);
    worker.postMessage({ code: jsCode, run: id });
}
function stopExecution() {
    if (worker) {
        worker.terminate();
        worker = null;
    }
}
function getCompletedLessons() {
  const stored = localStorage.getItem('ts_completed_lessons');
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
  localStorage.setItem('ts_completed_lessons', JSON.stringify(completed));
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
function submitCheck() {
    stopExecution();
    if (!currentLesson || (!currentLesson.expectedOutput && !mustContain)) {
        outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
        return;
    }
    let expected = '';
    let actual = '';
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
        if (passed) { CLIworker.postMessage("stop");}
    } else {
      const cleanedLines = lastRunOutput
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

      const studentOut = cleanedLines.join('\n') + (cleanedLines.length ? '\n' : '');

      expected = currentLesson.expectedOutput ? currentLesson.expectedOutput.trim() : "";
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
        localStorage.setItem('ts_current_lesson', lessonFileFromUrl);

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
CLIworker.onmessage = (e) => {
    console.log("WORKER MSG:", e.data);
    localStorage.setItem("cli_success", e.data.success);
    if (mode === 'cli') {
        if (currentLesson) {
          submitCheck();
          localStorage.removeItem("cli_success");
        }
    }
};
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_ts', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_ts', JSON.stringify(data));
});
async function runWithSuite(suiteFile, label) {
    if (!editor) return;
    let studentSource = editor.getValue();
    const data = {
        lesson: currentLesson.id,
        code: studentSource
    };

    localStorage.setItem('saved_code_ts', JSON.stringify(data));
    outEl.textContent = (label || 'Running') + '...\n';
    lastRunOutput = '';
    let fullSource = studentSource;
    if (setupCode) {
        studentSource = setupCode + "\n" + studentSource;
    }
    if (suiteFile) {
        if (rawHarness) {
            studentSource += '\n' + suiteFile;
        } else {
            suite = await fetch(suiteFile).then(r => r.text());
            studentSource += '\n\n' + suite;
        }
    }
    fullSource = studentSource;
    runTS(fullSource);
}

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
async function loadLesson(lessonFile) {
    const path = 'lessons/' + lessonFile;
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load lesson ' + path);
    const lesson = await res.json();
    currentLesson = lesson;

    titleEl.textContent = lesson.title || '';
    descEl.innerHTML = marked.parse(lesson.description || '');
    if (editor) {
        editor.setValue(lesson.starterCode || '');
        const saved = localStorage.getItem('saved_code_ts');

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

    outEl.textContent = '';
    lastRunOutput = '';
    nextLessonId    = lesson.nextLesson    || null;
    prevLessonId    = lesson.previous      || null;
    mustContain     = lesson.mustContain   || null;
    correct         = lesson.correct       || null;
    runHarnessFile    = lesson.runHarness    || null;
    submitHarnessFile = lesson.submitHarness || null;
    mode              = lesson.mode        || "editor";
    rawHarness        = lesson.rawHarness  || false;
    document.getElementById("difficulty").textContent = lesson.difficulty ? "Diffficulty: " + lesson.difficulty : "Difficulty: unknown";
    lessonXP          = parseInt(lesson.xp, 10)|| 0;
    editorEl = document.getElementsByClassName("code-box")[0];
    inputEl = document.getElementsByClassName("editor")[0];
    setupCode = lesson.setupCode || "";
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
    const btns = document.querySelectorAll('.ans');
    b1Btn = btns[0];
    b2Btn = btns[1];
    b3Btn = btns[2];
    b4Btn = btns[3];
    if (b1Btn) b1Btn.textContent = lesson.b1t || '';
    if (b2Btn) b2Btn.textContent = lesson.b2t || '';
    if (b3Btn) b3Btn.textContent = lesson.b3t || '';
    if (b4Btn) b4Btn.textContent = lesson.b4t || '';

    if (prevBtn) prevBtn.style.display = prevLessonId ? 'inline-block' : 'none';
    nextBtn.style.display = 'none';

    const lessonHint = lesson.hint || '';
    hintBody.innerHTML = marked.parse(lessonHint);
    const showButtons = (lesson.b1t || lesson.b2t || lesson.b3t || lesson.b4t);
    btns.forEach(button => {
        button.style.display = showButtons ? 'block' : 'none';
    });
    updateLevelUI();
}

async function setupLogic() {
    titleEl = document.getElementById('lesson-title');
    descEl  = document.getElementById('lesson-description');
    outEl   = document.getElementById('output');
    streakEl= document.getElementById('streak');
    hintBody= document.querySelector('.hint-body');
    let params = new URLSearchParams(location.search);
    let lessonFileFromUrl = params.get('lesson');
    let lastLesson = localStorage.getItem('ts_current_lesson');
    let lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';
    
    await loadLesson(lessonFile).catch(err => {
        outEl.textContent = 'Failed to load lesson: ' + err.message;
    });
    runBtn  = document.getElementById('run');
    checkBtn= document.getElementById('check-stdout');
    nextBtn = document.getElementById('next-lesson');
    prevBtn = document.getElementById('prev-lesson');
    checkResultBtn = document.getElementById('check-result');
    loadStreak();
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            suite = runHarnessFile || null;
            await runWithSuite(suite, 'Running');
        });
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
            const url = new URL(window.location.href);
            url.searchParams.set('lesson', nextLessonId);
            window.location.href = url.toString();
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!prevLessonId) return;
            const url = new URL(window.location.href);
            url.searchParams.set('lesson', prevLessonId);
            window.location.href = url.toString();
        });
    }
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".hint-toggle");
        if (!btn) return;
        const hint = btn.closest(".hint");
        hint.classList.toggle("open");
        const open = hint.classList.contains("open");
        btn.textContent = open ? "Hide hint ▴" : "Show hint ▾";
    });
    if (prevBtn) {
        prevBtn.style.display = prevLessonId ? 'inline-block' : 'none';
    }
    if (nextBtn) {
        const alreadyCompleted = isLessonCompleted(currentLesson.id);
        nextBtn.style.display = alreadyCompleted ? 'inline-block' : 'none';
    }
}

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });
document.addEventListener('DOMContentLoaded', () => {
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: [].join('\\n'),
            language: 'typescript',
            theme: 'vs-dark',
            tabSize: 2
        });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
            const runBtn = document.getElementById('run');
            if (runBtn) runBtn.click();
        });
        
        console.log('TypeScript Monaco Editor initialized');
        setupLogic();

    });
});