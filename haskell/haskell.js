import {
  ConsoleStdout,
  File,
  OpenFile,
  PreopenDirectory,
  WASI,
} from "./wasi_shim.mjs";
import { DyLDBrowserHost, main } from "./dyld.mjs";
let stdout = "";
let main_func;
async function initHaskell() {
  const rootfs = new PreopenDirectory("/", []);

  const bsdtar_wasi = new WASI(
    ["bsdtar.wasm", "-x"],
    [],
    [
      new OpenFile(new File(new Uint8Array(), { readonly: true })),
      ConsoleStdout.lineBuffered((msg) => console.info(msg)),
      ConsoleStdout.lineBuffered((msg) => console.warn(msg)),
      rootfs,
    ],
    { debug: false },
  );

  const [{ instance }, rootfs_bytes] = await Promise.all([
    WebAssembly.instantiateStreaming(fetch("./bsdtar.wasm"), {
      wasi_snapshot_preview1: bsdtar_wasi.wasiImport,
    }),
    fetch("./rootfs.tar.zst").then((r) => r.bytes()),
  ]);

  bsdtar_wasi.fds[0] = new OpenFile(new File(rootfs_bytes, { readonly: true }));
  bsdtar_wasi.start(instance);
  const dyld = await main({
    rpc: new DyLDBrowserHost({
      rootfs,
      stdout: (msg) => {
        stdout += `${msg}\n`;
      },
      stderr: (msg) => {
        stdout += `${msg}\n`;
      },
    }),
    searchDirs: [
      "/tmp/clib",
      "/tmp/hslib/lib/wasm32-wasi-ghc-9.14.0.20251031-inplace",
    ],
    mainSoPath: "/tmp/libplayground001.so",
    args: ["libplayground001.so", "+RTS", "-c", "-RTS"],
    isIserv: false,
  });
  main_func = await dyld.exportFuncs.myMain("/tmp/hslib/lib");
}
initHaskell().then(() => {
  setup = true;
});
let setup = false;
let editor = null;
let currentLesson = null;
let lastRunOutput = "";
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
let titleEl,
  descEl,
  outEl,
  runBtn,
  checkBtn,
  nextBtn,
  prevBtn,
  streakEl,
  hintBody;
let editorEl = null;
let inputEl = null;
let mode = "";
let checkResultBtn = null;
let rawHarness = false;
let setupCode = "";
let suite;
function loadStreak() {
  const raw = localStorage.getItem("haskell_streak");
  lessonsInRow = raw ? parseInt(raw, 10) || 0 : 0;
  updateStreakUI();
}

function saveStreak() {
  localStorage.setItem("haskell_streak", String(lessonsInRow));
}

function updateStreakUI() {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}
function updateLevelUI() {
  if (localStorage.getItem("user_xp") === null) {
    localStorage.setItem("user_xp", 0);
  }
  if (localStorage.getItem("level_xp_cap") === null) {
    localStorage.setItem("level_xp_cap", 100);
  }
  if (localStorage.getItem("user_level") === null) {
    localStorage.setItem("user_level", 0);
  }
  document.getElementById("xp").textContent =
    `${localStorage.getItem("user_xp")} / ${localStorage.getItem("level_xp_cap")}. Level ${localStorage.getItem("user_level")}.`;
  document.getElementById("levelProg").value = localStorage.getItem("user_xp");
  document.getElementById("levelProg").max =
    localStorage.getItem("level_xp_cap");
}
async function runHaskell(code) {
  if (!setup) {
    outEl.textContent = "Haskell still loading.";
    return;
  }
  lastRunOutput = stdout;
  outEl.className = "";
  try {
    await main_func("", code);
    if (!stdout.includes("*** Exception") && !stdout.includes("[GHC-")) {
      outEl.textContent = stdout;
    } else {
      outEl.textContent = stdout;
      outEl.className = "error";
    }
  } catch (err) {
    outEl.textContent = stdout;
    outEl.className = "error";
  }
  stdout = "";
}
function getCompletedLessons() {
  const stored = localStorage.getItem("haskell_completed_lessons");
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
    mode: mode,
  };
  localStorage.setItem("haskell_completed_lessons", JSON.stringify(completed));
}
window.copytext = function (elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;

  navigator.clipboard.writeText(text).then(() => {
    const originalText = `lhc ${runHarnessFile} ${elementId == "submit-command" ? "-s" : ""}`;

    element.textContent = "Copied!";

    setTimeout(() => {
      element.textContent = originalText;
    }, 750);
  });
};
function submitCheck() {
  if (!currentLesson || (!currentLesson.expectedOutput && !mustContain)) {
    outEl.textContent += "\nNo expectedOutput defined for this lesson.\n";
    return;
  }
  let expected = "";
  let actual = "";
  let passed = false;
  if (mode === "text") {
    actual = inputEl.value;
    if (mustContain) {
      if (Array.isArray(mustContain)) {
        for (let str of mustContain) {
          passed = actual.includes(str);
          if (!passed) break;
        }
      } else {
        passed = actual.includes(mustContain);
      }
    } else {
      expected = currentLesson.expectedOutput.trim();
      passed = actual === expected;
    }
  } else if (mode === "cli") {
    passed = localStorage.getItem("cli_success") === "true";
  } else {
    const lines = (lastRunOutput || "").split("\n");

    const filteredLines = lines.filter((line) => {
      const isGhcNoise =
        line.startsWith("[") && line.includes("of") && line.includes("]");
      const isTmpPath = line.includes("/tmp/");
      return !isGhcNoise && !isTmpPath && line.trim() !== "";
    });
    const studentOut = filteredLines.join("\n").trim();

    expected = currentLesson.expectedOutput
      ? currentLesson.expectedOutput.trim()
      : "";
    actual = studentOut;

    if (mustContain) {
      if (Array.isArray(mustContain)) {
        passed = mustContain.every((str) => actual.includes(str));
      } else {
        passed = actual.includes(mustContain);
      }
    } else {
      passed = actual === expected;
    }
  }
  const alreadyCompleted = isLessonCompleted(currentLesson.id);
  if (passed) {
    outEl.textContent += "\n[PASS] Output matches expected.\n";
    if (mode === "text") {
      alert("Pass");
    }
    if (!alreadyCompleted) {
      lessonsInRow += 1;
      let currentXP = parseInt(localStorage.getItem("user_xp")) || 0;
      let levelCap = parseInt(localStorage.getItem("level_xp_cap")) || 100;
      let currentLevel = parseInt(localStorage.getItem("user_level")) || 0;

      currentXP += lessonXP;
      localStorage.setItem("user_xp", currentXP);

      if (currentXP >= levelCap) {
        currentXP -= levelCap;
        levelCap += 50;
        currentLevel += 1;
        localStorage.setItem("user_xp", currentXP);
        localStorage.setItem("level_xp_cap", levelCap);
        localStorage.setItem("user_level", currentLevel);
      }
      markLessonCompleted(currentLesson.id, lessonXP);
      if (useSolution) {
        lessonsInRow = 0;
        outEl.textContent +=
          "\n(Note: Streak reset due to loading solution.)\n";
      }
    } else {
      outEl.textContent += "\n(Already completed - no XP gained.)\n";
    }
    saveStreak();
    updateStreakUI();
    updateLevelUI();
    const params = new URLSearchParams(location.search);
    const lessonFileFromUrl = params.get("lesson") || "lesson1.json";
    localStorage.setItem("haskell_current_lesson", lessonFileFromUrl);

    if (nextLessonId) nextBtn.style.display = "inline-block";
  } else {
    if (!alreadyCompleted) {
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
    }
    if (mode === "text") {
      alert("Fail");
    } else {
      outEl.textContent += "\n[FAIL] Output does not match. (streak reset)\n";
      if (mustContain) {
        outEl.textContent += "\nExpected to contain:\n" + mustContain;
      } else {
        outEl.textContent += "\nExpected:\n" + expected;
      }
      outEl.textContent += "\n\nGot:\n" + actual + "\n";
    }
  }
}
window.addEventListener("storage", (e) => {
  if (e.key === "cli_success" && mode === "cli" && e.newValue) {
    console.log("CLI event:", e.newValue);

    const parts = e.newValue.split("_");
    const lang = parts[0];
    const lessonId = parts[1];
    const isSuccess = parts[2];
    if (currentLesson) {
      localStorage.setItem("cli_success", isSuccess);
      submitCheck();
      localStorage.removeItem("cli_success");
    }
  }
});
async function runWithSuite(suiteFile, label) {
  if (!editor) return;
  let studentSource = editor.getValue();
  const data = {
    lesson: currentLesson.id,
    code: studentSource
  };

  localStorage.setItem('saved_code_haskell', JSON.stringify(data));
  outEl.textContent = (label || "Running") + "...\n";
  lastRunOutput = "";
  let fullSource = studentSource;
  if (setupCode) {
    studentSource = setupCode + "\n" + studentSource;
  }
  if (suiteFile) {
    if (rawHarness) {
      studentSource += "\n" + suiteFile;
    } else {
      suite = await fetch(suiteFile).then((r) => r.text());
      studentSource += "\n\n" + suite;
    }
  }
  fullSource = studentSource;
  runHaskell(fullSource);
}

function btn(bn) {
  if (bn === correct) {
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    outEl.textContent += "\n[PASS] Output matches expected.\n";
    if (!alreadyCompleted) {
      lessonsInRow += 1;

      let currentXP = parseInt(localStorage.getItem("user_xp")) || 0;
      let levelCap = parseInt(localStorage.getItem("level_xp_cap")) || 100;
      let currentLevel = parseInt(localStorage.getItem("user_level")) || 0;

      currentXP += lessonXP;
      localStorage.setItem("user_xp", currentXP);

      while (currentXP >= levelCap) {
        currentXP -= levelCap;
        levelCap += 50;
        currentLevel += 1;
        localStorage.setItem("user_xp", currentXP);
        localStorage.setItem("level_xp_cap", levelCap);
        localStorage.setItem("user_level", currentLevel);
      }
      markLessonCompleted(currentLesson.id, lessonXP);

      if (useSolution) {
        lessonsInRow = 0;
        outEl.textContent +=
          "\n(Note: Streak reset due to loading solution.)\n";
      }
    } else {
      outEl.textContent += "\n(Already completed - no XP gained.)\n";
    }
    saveStreak();
    updateStreakUI();
    updateLevelUI();
    alert("Correct");
    useSolution = false;
    outEl.textContent += "\n[PASS].\n";
    if (nextLessonId) nextBtn.style.display = "inline-block";
  } else {
    lessonsInRow = 0;
    saveStreak();
    updateStreakUI();
    alert("Incorrect");
  }
}
async function loadLesson(lessonFile) {
  const path = "lessons/" + lessonFile;
  const res = await fetch(path);
  if (!res.ok) throw new Error("Failed to load lesson " + path);
  const lesson = await res.json();
  currentLesson = lesson;

  titleEl.textContent = lesson.title || "";
  descEl.innerHTML = marked.parse(lesson.description || "");
  if (editor) {
    editor.setValue(lesson.starterCode || '');
    const saved = localStorage.getItem('saved_code_haskell');

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

  outEl.textContent = "";
  lastRunOutput = "";
  nextLessonId = lesson.nextLesson || null;
  prevLessonId = lesson.previous || null;
  mustContain = lesson.mustContain || null;
  correct = lesson.correct || null;
  runHarnessFile = lesson.runHarness || null;
  submitHarnessFile = lesson.submitHarness || null;
  mode = lesson.mode || "editor";
  rawHarness = lesson.rawHarness || false;
  document.getElementById("difficulty").textContent = lesson.difficulty
    ? "Diffficulty: " + lesson.difficulty
    : "Difficulty: unknown";
  lessonXP = parseInt(lesson.xp, 10) || 0;
  editorEl = document.getElementsByClassName("code-box")[0];
  inputEl = document.getElementsByClassName("editor")[0];
  setupCode = lesson.setupCode || "";
  if (mode === "text") {
    editorEl.innerHTML =
      '<textarea class="editor"></textarea><button id="check-stdout">Submit</button><button id="next-lesson" style="display:none">Next Lesson</button><button id="prev-lesson">Previous Lesson</button>';
    checkBtn = document.getElementById("check-stdout");
    nextBtn = document.getElementById("next-lesson");
    prevBtn = document.getElementById("prev-lesson");
    inputEl = document.getElementsByClassName("editor")[0];
  } else if (mode === "cli") {
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
    `;
    nextBtn = document.getElementById("next-lesson");
    prevBtn = document.getElementById("prev-lesson");
    outEl = document.getElementById("out");
  }
  nextBtn = document.getElementById("next-lesson");
  const btns = document.querySelectorAll(".ans");
  b1Btn = btns[0];
  b2Btn = btns[1];
  b3Btn = btns[2];
  b4Btn = btns[3];
  if (b1Btn) b1Btn.textContent = lesson.b1t || "";
  if (b2Btn) b2Btn.textContent = lesson.b2t || "";
  if (b3Btn) b3Btn.textContent = lesson.b3t || "";
  if (b4Btn) b4Btn.textContent = lesson.b4t || "";

  if (prevBtn) prevBtn.style.display = prevLessonId ? "inline-block" : "none";
  nextBtn.style.display = "none";

  const lessonHint = lesson.hint || "";
  hintBody.innerHTML = marked.parse(lessonHint);
  const showButtons = lesson.b1t || lesson.b2t || lesson.b3t || lesson.b4t;
  btns.forEach((button) => {
    button.style.display = showButtons ? "block" : "none";
  });
  updateLevelUI();
}
document.addEventListener('beforeunload', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_haskell', JSON.stringify(data));
});
window.addEventListener('pagehide', () => {
  const data = {
    lesson: currentLesson.id,
    code: editor.getValue()
  };

  localStorage.setItem('saved_code_haskell', JSON.stringify(data));
});
async function setupLogic() {
  titleEl = document.getElementById("lesson-title");
  descEl = document.getElementById("lesson-description");
  outEl = document.getElementById("output");
  streakEl = document.getElementById("streak");
  hintBody = document.querySelector(".hint-body");
  let params = new URLSearchParams(location.search);
  let lessonFileFromUrl = params.get("lesson");
  let lastLesson = localStorage.getItem("haskell_current_lesson");
  let lessonFile = lessonFileFromUrl || lastLesson || "lesson1.json";

  await loadLesson(lessonFile).catch((err) => {
    outEl.textContent = "Failed to load lesson: " + err.message;
  });
  runBtn = document.getElementById("run");
  checkBtn = document.getElementById("check-stdout");
  nextBtn = document.getElementById("next-lesson");
  prevBtn = document.getElementById("prev-lesson");
  checkResultBtn = document.getElementById("check-result");
  loadStreak();
  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      suite = runHarnessFile || null;
      await runWithSuite(suite, "Running");
    });
  }
  if (checkResultBtn) {
    checkResultBtn.addEventListener("click", () => {
      submitCheck();
      useSolution = false;
      runBtn.style.display = "inline-block";
      checkBtn.style.display = "inline-block";
      if (prevBtn && prevLessonId) prevBtn.style.display = "inline-block";
      checkResultBtn.style.display = "none";
    });
  }
  if (checkBtn) {
    checkBtn.addEventListener("click", async () => {
      if (mode === "text") {
        submitCheck();
      } else {
        const harnessToUse = submitHarnessFile || runHarnessFile || null;
        await runWithSuite(harnessToUse, "Submitting");
        runBtn.style.display = "none";
        checkBtn.style.display = "none";
        if (prevBtn) prevBtn.style.display = "none";
        nextBtn.style.display = "none";
        checkResultBtn.style.display = "inline-block";
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!nextLessonId) return;
      const url = new URL(window.location.href);
      url.searchParams.set("lesson", nextLessonId);
      window.location.href = url.toString();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (!prevLessonId) return;
      const url = new URL(window.location.href);
      url.searchParams.set("lesson", prevLessonId);
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
    prevBtn.style.display = prevLessonId ? "inline-block" : "none";
  }
  if (nextBtn) {
    const alreadyCompleted = isLessonCompleted(currentLesson.id);
    nextBtn.style.display = alreadyCompleted ? "inline-block" : "none";
  }
}

require.config({
  paths: { vs: "https://unpkg.com/monaco-editor@0.45.0/min/vs" },
});
require(["vs/editor/editor.main"], async function () {
  monaco.languages.register({ id: "haskell" });
  monaco.languages.setMonarchTokensProvider("haskell", {
    defaultToken: "",
    tokenPostfix: ".hs",

    keywords: [
      "case", "of", "if", "then", "else", "let", "in", "where",
      "do", "module", "import", "data", "type", "newtype",
      "deriving", "class", "instance", "forall"
    ],

    operators: [
      "=", "->", "<-", "::", "\\", "|", "=>", "@", "~"
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier"
          }
        }],
        [/[A-Z]\w*/, "type.identifier"],

        [/\d+(\.\d+)?/, "number"],

        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],

        [/--.*$/, "comment"],
 
        [/@symbols/, {
          cases: {
            "@operators": "operator",
            "@default": ""
          }
        }]
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, "string", "@pop"]
      ]
    }
  });
  monaco.editor.defineTheme("haskell-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "C586C0", fontStyle: "bold" },
      { token: "type.identifier", foreground: "4EC9B0" },
      { token: "string", foreground: "CE9178" },
      { token: "comment", foreground: "6A9955", fontStyle: "italic" },
      { token: "number", foreground: "B5CEA8" },
      { token: "operator", foreground: "D4D4D4" }
    ],
    colors: {
        'editor.foreground': '#D4D4D4',
        'editor.background': '#1E1E1E'
    }
  });
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: [].join("\\n"),
    language: "haskell",
    theme: "haskell-dark",
  });
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
    const runBtn = document.getElementById("run");
    if (runBtn) runBtn.click();
  });
  setup = false;
  console.log("Haskell Monaco Editor initialized");
  setupLogic();
});
