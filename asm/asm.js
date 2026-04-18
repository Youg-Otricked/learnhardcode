import { Blink } from './blink/blink.js';
import { assemblers } from './blink/assemblers.js';
const worker = new Worker("../api/endpoint.js");
let blink = null;
let programOutput = '';

let editor = null;
let currentLesson = null;
let lastRunOutput = '';
let nextLessonId = null;
let prevLessonId = null;
let lessonsInRow = 0;
let mustContain = null;
let setupCode = "";
let b1Btn, b2Btn, b3Btn, b4Btn;
let stepBtn;
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
let suite;
function loadStreak() {
    const raw = localStorage.getItem('asm_streak');
    lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
    updateStreakUI();
}

function saveStreak() {
    localStorage.setItem('asm_streak', String(lessonsInRow));
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
let debugStepping = false;
async function initBlink() {
    const mode = assemblers.NASM_trunk;

    blink = new Blink(
        mode,
        () => null,
        (charCode) => {
            programOutput += String.fromCharCode(charCode);
            outEl.textContent = programOutput;
        },
        (charCode) => {
            outEl.textContent += String.fromCharCode(charCode);
        },
        (sig, code) => {},
        (state, oldState) => {
            if (state === 'PROGRAM_RUNNING' && oldState === 'PROGRAM_LOADED') {
                programOutput = '';
                if (debugStepping) {
                    updateDebugView();
                } else {
                    blink.continue();
                }
            }
            if (state === 'PROGRAM_STOPPED') {
                lastRunOutput = programOutput.trim();
                debugStepping = false;
                updateDebugView();
            }
        }
    );
}
function updateDebugView() {
    updateDisassembly();
    updateStackView();
    document.getElementById('registers').textContent =
        `rax: ${blink.m.stringReadU64('rax')}\n` +
        `rbx: ${blink.m.stringReadU64('rbx')}\n` +
        `rcx: ${blink.m.stringReadU64('rcx')}\n` +
        `rdx: ${blink.m.stringReadU64('rdx')}\n` +
        `rsp: ${blink.m.stringReadU64('rsp')}\n` +
        `rbp: ${blink.m.stringReadU64('rbp')}\n` +
        `rsi: ${blink.m.stringReadU64('rsi')}\n` +
        `rdi: ${blink.m.stringReadU64('rdi')}\n` +
        `rip: ${blink.m.stringReadU64('rip')}\n` +
        `r8:  ${blink.m.stringReadU64('r8')}\n` +
        `r9:  ${blink.m.stringReadU64('r9')}\n` +
        `r10: ${blink.m.stringReadU64('r10')}\n` +
        `r11: ${blink.m.stringReadU64('r11')}\n` +
        `r12: ${blink.m.stringReadU64('r12')}\n` +
        `r13: ${blink.m.stringReadU64('r13')}\n` +
        `r14: ${blink.m.stringReadU64('r14')}\n` +
        `r15: ${blink.m.stringReadU64('r15')}`;
}
function updateStackView() {
    const rsp = blink.m.readU64('rsp');
    const rbp = blink.m.readU64('rbp');
    const stackPtr = blink.m.getPtr('stackmem');
    const bytesPerRow = 8;
    const numRows = 64;
    let output = '';
    
    for (let i = 0; i < numRows; i++) {
        const addr = rsp + BigInt(i * bytesPerRow);
        const addrStr = addr.toString(16).padStart(16, '0');
        
        let hexBytes = '';
        let ascii = '';
        for (let j = 0; j < bytesPerRow; j++) {
            const byte = blink.m.memView.getUint8(stackPtr + (i * bytesPerRow) + j);
            hexBytes += byte.toString(16).padStart(2, '0');
            ascii += (byte >= 0x20 && byte <= 0x7e) ? String.fromCharCode(byte) : '.';
        }
        let marker = "   ";

        if (addr === rsp) marker = "rsp";
        if (addr === rbp) marker = "rbp";
        output += `${marker.padEnd(3)} ${addrStr}  ${hexBytes}  ${ascii}\n`;
    }
    
    document.getElementById('stack').textContent = output;
}
async function step() {
    try {
        if (!debugStepping) {
            debugStepping = true;
            programOutput = '';
            const code = editor.getValue();
            blink.loadASM(code);
            return;
        }

        blink.stepi();
        updateDebugView();
    } catch(e) {
        console.error("Step failed:", e);
        debugStepping = false;
    }
}
function updateDisassembly() {
    const rip = blink.m.readU64('rip');

    const maxLines = blink.m.getPtr('dis__max_lines');
    const maxLineLen = blink.m.getPtr('dis__max_line_len');
    const bufferPtr = blink.m.getPtr('dis__buffer');

    let disasm = '';

    for (let i = 0; i < maxLines; i++) {
        const linePtr = bufferPtr + (i * maxLineLen);

        let line = '';
        for (let j = 0; j < maxLineLen; j++) {
            const byte = blink.m.memView.getUint8(linePtr + j);
            if (byte === 0) break;
            line += String.fromCharCode(byte);
        }

        if (!line) continue;

        let prefix = '&nbsp;&nbsp;';
        let highlight = '';

        const addrMatch = line.match(/([0-9a-fA-F]{6,8})/);
        if (!addrMatch) {
            disasm += `<tr><td>&nbsp;&nbsp; ${line}</td></tr>`;
            continue;
        }
        if (addrMatch) {
            console.log('RIP:', rip.toString(16));
            console.log('ADDR:', addrMatch[1]);
            const addr = BigInt("0x" + addrMatch[1].replace(/^0+/, '') || '0');
            
            if (addr === rip) {
                prefix = '➜';
                highlight = ' class="current"';
            }
        }

        disasm += `<tr${highlight}><td>${prefix} ${line}</td></tr>`;
    }

    document.getElementById('disassembly').innerHTML =
        '<table>' + disasm + '</table>';
}
function runASM(code) {
    programOutput = '';
    lastRunOutput = '';
    outEl.textContent = 'Assembling...\n';
    blink.loadASM(code);
}
function getCompletedLessons() {
  const stored = localStorage.getItem('asm_completed_lessons');
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
  localStorage.setItem('asm_completed_lessons', JSON.stringify(completed));
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
    if (!currentLesson || (!currentLesson.expectedOutput && !mustContain)) {
        outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
        return;
    }
    let expected = '';
    const cleanedLines = lastRunOutput
    .split('\n')
    .map(line => line.replace(/\x1b\[[0-9;]*m/g, '').trim())
    .filter(line => line);
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
        localStorage.setItem('asm_current_lesson', lessonFileFromUrl);

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
async function runWithSuite(suiteFile, label) {
    if (!editor) return;
    let studentSource = editor.getValue();
    const data = {
      lesson: currentLesson.id,
      code: studentSource
    };

    localStorage.setItem('saved_code_asm', JSON.stringify(data));
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
    console.log('FULL SOURCE:', studentSource);
    fullSource = studentSource;
    runASM(fullSource);
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
window.btn = btn;
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
        const saved = localStorage.getItem('saved_code_asm');

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
    setupCode      = lesson.setupCode || "";
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
    let lastLesson = localStorage.getItem('asm_current_lesson');
    let lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';
    
    await loadLesson(lessonFile).catch(err => {
        outEl.textContent = 'Failed to load lesson: ' + err.message;
    });
    runBtn  = document.getElementById('run');
    checkBtn= document.getElementById('check-stdout');
    nextBtn = document.getElementById('next-lesson');
    prevBtn = document.getElementById('prev-lesson');
    checkResultBtn = document.getElementById('check-result');
    stepBtn = document.getElementById('step');
    if (stepBtn) {
        stepBtn.addEventListener('click', async () => {
            step();
        });
    }
    loadStreak();
    if (runBtn) {
        runBtn.addEventListener('click', async () => {
            debugStepping = false;
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
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_asm', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_asm', JSON.stringify(data));
});
require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });
document.addEventListener('DOMContentLoaded', () => {
    require(['vs/editor/editor.main'], async function() {
        await initBlink();
        monaco.languages.register({
            id: "nasm",
            extensions: [".asm"],
            aliases: ["NASM", "asm", "x86asm"]
        });
        monaco.languages.setMonarchTokensProvider("nasm", {

            defaultToken: "",
            ignoreCase: true,

            keywords: [
                "mov","add","sub","mul","imul","div","idiv",
                "inc","dec","push","pop",
                "call","ret","syscall",
                "jmp","je","jne","jg","jl","jge","jle","ja","jb","jo","jno",
                "cmp","test",
                "xor","or","and","not",
                "shl","shr","sal","sar",
                "lea","nop","int",
                "hlt","clc","stc","cli","sti",
                "adc","sbb","rol","ror","rcl","rcr",
                "movzx","movsx","xchg","bswap",
                "bt","btc","btr","bts"
            ],

            directives: [
                "section","segment",
                "global","extern",
                "default","equ",
                "times","org","align",
                "bits","use16","use32","use64"
            ],

            types: [
                "db","dw","dd","dq",
                "resb","resw","resd","resq",
                "byte","word","dword","qword",
                "tword","oword","yword","zword"
            ],

            registers: [
                "rax","rbx","rcx","rdx","rsi","rdi","rsp","rbp",
                "r8","r9","r10","r11","r12","r13","r14","r15",
                "eax","ebx","ecx","edx","esi","edi","esp","ebp",
                "ax","bx","cx","dx","si","di","sp","bp",
                "al","bl","cl","dl","ah","bh","ch","dh",
                "rip","eip","ip",
                "cs","ds","es","fs","gs","ss",
                "st0","st1","st2","st3","st4","st5","st6","st7",
                "xmm0","xmm1","xmm2","xmm3","xmm4","xmm5","xmm6","xmm7",
                "xmm8","xmm9","xmm10","xmm11","xmm12","xmm13","xmm14","xmm15",
                "ymm0","ymm1","ymm2","ymm3","ymm4","ymm5","ymm6","ymm7",
                "ymm8","ymm9","ymm10","ymm11","ymm12","ymm13","ymm14","ymm15",
                "zmm0","zmm1","zmm2","zmm3","zmm4","zmm5","zmm6","zmm7"
            ],

            symbols: /[=><!~?:&|+\-*\/\^%]+/,

            tokenizer: {

                root: [

                    [/;.*$/, "comment"],
                    [/^[a-zA-Z_.$][\w.$]*:/, "type.identifier"],
                    [/%(define|macro|endmacro|ifdef|ifndef|endif|include|assign)\b/, "keyword.preproc"],

                    [/\b\w+\b/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@directives': 'keyword',
                            '@types': 'type',
                            '@registers': 'variable.predefined',
                            '@default': 'identifier'
                        }
                    }],
                    [/0x[0-9a-fA-F_]+/, "number.hex"],
                    [/0b[01_]+/, "number.binary"],
                    [/[0-9a-fA-F]+h\b/, "number.hex"],
                    [/[0-9_]+/, "number"],
                    [/".*?"/, "string"],
                    [/'.*?'/, "string"],
                    [/\[/, "delimiter.bracket"],
                    [/\]/, "delimiter.bracket"],
                    [/@symbols/, "operator"],
                    [/[a-zA-Z_.$][\w.$]*/, "identifier"]
                ]
            }
        });
        monaco.languages.registerCompletionItemProvider("nasm", {

            provideCompletionItems: () => {

                const instructions = [
                "mov","add","sub","mul","imul","div","idiv",
                "push","pop","call","ret",
                "jmp","je","jne","jg","jl",
                "cmp","test","xor","and","or",
                "shl","shr","lea","nop","syscall"
                ];

                const registers = [
                "rax","rbx","rcx","rdx",
                "rsi","rdi","rsp","rbp",
                "r8","r9","r10","r11",
                "r12","r13","r14","r15"
                ];

                return {
                suggestions: [

                    ...instructions.map(i => ({
                    label: i,
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: i
                    })),

                    ...registers.map(r => ({
                    label: r,
                    kind: monaco.languages.CompletionItemKind.Variable,
                    insertText: r
                    }))
                ]
                };
            }
        });
        editor = monaco.editor.create(document.getElementById('editor'), {
            language: 'nasm',
            theme: 'vs-dark'
        });
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
            const runBtn = document.getElementById('run');
            if (runBtn) runBtn.click();
        });
        
        console.log('ASM Monaco Editor initialized');
        setupLogic();

    });
});