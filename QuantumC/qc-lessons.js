let QuantumModule = null;
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
function loadStreak() {
    const raw = localStorage.getItem('qc_streak');
    lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
    updateStreakUI();
}

function saveStreak() {
    localStorage.setItem('qc_streak', String(lessonsInRow));
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
function runQC(code) {
    if (!QuantumModule) {
        outEl.textContent += '\nWASM module still loading...\n';
        return;
    }
    outEl.textContent = 'Running...\n';
    lastRunOutput = '';
    outEl.className = '';
    try {
        const result = QuantumModule.ccall(
            'run_quantum_code',
            'string',
            ['string'],
            [code]
        );
        lastRunOutput = result || '';
        outEl.textContent += lastRunOutput;
        if (result.includes('QC-') || result.includes('Runtime Error:')) {
            outEl.className = 'error';
        } else {
            outEl.className = 'success';
        }
        lastRunOutput = result.split("Program exited with code:")[0];
    } catch (err) {
        lastRunOutput = 'Runtime Error: ' + err.message;
        outEl.textContent += lastRunOutput;
        outEl.className = 'error';
    }
}
function getCompletedLessons() {
  const stored = localStorage.getItem('qc_completed_lessons');
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
  localStorage.setItem('qc_completed_lessons', JSON.stringify(completed));
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
function submitCheck() {
    if (!currentLesson || (!currentLesson.expectedOutput && !mustContain) && mode == "editor") {
        outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
        return;
    }
    let actual = '';
    const cleanedLines = lastRunOutput
    .split('\n')
    .map(line => line.replace(/\x1b\[[0-9;]*m/g, '').trim())
    .filter(line => line);
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
      passed = localStorage.getItem('cli_success') === 'true';
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
        localStorage.setItem('qc_current_lesson', lessonFileFromUrl);

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
window.addEventListener('storage', (e) => {
    if (e.key === 'cli_success' && mode === 'cli' && e.newValue) {
        console.log('CLI event:', e.newValue);
        
        const parts = e.newValue.split('_');
        const lang = parts[0];
        const lessonId = parts[1];
        const isSuccess = parts[2];
        if (currentLesson) {
            localStorage.setItem('cli_success', isSuccess);
            submitCheck();
            localStorage.removeItem('cli_success');
        }
    }
});
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_qc', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_qc', JSON.stringify(data));
});
async function runWithSuite(suiteFile, label) {
    if (!editor) return;
    let studentSource = editor.getValue();
    const data = {
        lesson: currentLesson.id,
        code: studentSource
    };

    localStorage.setItem('saved_code_qc', JSON.stringify(data));
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

    runQC(fullSource);
}

function btn(bn) {
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
    const path = 'lessons-qc/' + lessonFile;
    const res = await fetch(path);
    if (!res.ok) throw new Error('Failed to load lesson ' + path);
    const lesson = await res.json();
    currentLesson = lesson;

    titleEl.textContent = lesson.title || '';
    descEl.innerHTML = marked.parse(lesson.description || '');
    if (editor) {
        editor.setValue(lesson.starterCode || '');
        const saved = localStorage.getItem('saved_code_qc');

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
    mode              = lesson.mode            || "editor";
    rawHarness      = lesson.rawHarness || false;
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
    const showButtons = !!(lesson.b1t || lesson.b2t || lesson.b3t || lesson.b4t);
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
    let lastLesson = localStorage.getItem('qc_current_lesson');
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
            const suiteToUse = runHarnessFile || null;
            await runWithSuite(suiteToUse, 'Running');
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
        monaco.languages.register({ id: 'qc' });

        monaco.languages.setMonarchTokensProvider('qc', {
            tokenizer: {
                root: [
                [/\/\/.*$/, 'comment'],
                [/\/\*/, 'comment', '@comment'],
                [/^\s*#\s*include/, { token: 'keyword.control.preprocessor', next: '@include' }],
                [/^\s*#\s*(error|warning|define|undef|ifdef|ifndef|endif|pragma)\b/, 'keyword.control.preprocessor'],
                [/\b(qif|qelse|qelif|qswitch|if|else|while|for|return|break|continue|switch|case|default|namespace|fn)\b/, 'keyword'],
                [/\b(const|static|public|private|protected|long|short|final)\b/, 'storage.modifier'],
                [/\b(true|false|null|nullptr|none|both)\b/, 'constant.language'],
                [/\b(int|float|double|qbool|void|bool|string|char|dict|map|list|enum|struct|class|type|auto)\b/, 'storage.type'],
                [/\b[A-Z][a-zA-Z0-9_]*\b/, 'entity.name.type'],
                [/\b[a-zA-Z_][a-zA-Z0-9_]*(?=::)/, 'entity.name.namespace'],
                [/\b[a-zA-Z_][a-zA-Z0-9_]*\s*(?=\()/, 'entity.name.function'],
                [/(?<=\.|->)[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.other.member'],
                [/"/, 'string', '@string'],
                [/'([^'\\]|\\.)'/, 'string.quoted.single'],
                [/\b(0x[0-9a-fA-F]+|0b[01]+|[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?f?)\b/, 'number'],
                [/\+\+|--|\+|\-|\*\*|\*|\/|%|==|!=|<=|>=|<|>|&&&|&&|\|\|\||\|\||!!|!|=|\+=|\-=|\*=|\/=|&|\||\^|<<|>>/, 'operator'],
                ],

                comment: [
                [/[^\/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[\/*]/, 'comment']
                ],

                string: [
                [/[^\\"]+/, 'string'],
                [/\\./, 'string.escape'],
                [/"/, 'string', '@pop'],
                ],

                include: [
                [/[ \t]+/, ''],
                [/,/, 'punctuation.separator'],
                [/<|>/, 'string.include'],
                [/[a-zA-Z0-9_.\/\\]+/, 'string.include'],
                [/[a-zA-Z_][a-zA-Z0-9_]*/, 'entity.name.namespace'],
                [/$/, '', '@pop'],
                ],
            },
        });
        monaco.editor.defineTheme('qcTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: 'C586C0' },
                { token: 'storage.type', foreground: '569CD6' },
                { token: 'entity.name.function', foreground: 'DCDCAA' },
                { token: 'operator', foreground: 'D4D4D4' },
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'constant.language', foreground: '569CD6', fontStyle: 'bold' },
                { token: 'keyword.control.preprocessor', foreground: 'C586C0' },
                { token: 'entity.name.type', foreground: '4EC9B0' },
                { token: 'entity.name.namespace', foreground: '4EC9B0' },
                { token: 'variable.other.member', foreground: '9CDCFE' },
                { token: 'identifier', foreground: '9CDCFE' }
            ],
            colors: {
                'editor.background': '#1E1E1E',
                'editor.foreground': '#D4D4D4'
            }
        });
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: `int main() {
    println("Hello, World!");
    return 0;
}`,
            language: 'qc',  
            theme: 'qcTheme',
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
        });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
            const runBtn = document.getElementById('run');
            if (runBtn) runBtn.click();
        });
        
        console.log('QuantumC Monaco Editor initialized');
        setupLogic();

    });

    QuantumC().then(function(module) {
        QuantumModule = module;
        document.getElementById('output').innerText = 'Ready! Press Ctrl+Enter or click "Run Code".';
        console.log('Quantum C WASM loaded successfully');
        document.getElementById('output').className = 'success';
    }).catch(function(err) {
        document.getElementById('output').innerText = 'Error loading WASM: ' + err;
        document.getElementById('output').className = 'error'
        console.error('Failed to load Quantum C:', err);
        
    });
});