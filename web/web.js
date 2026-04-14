let htmleditor = null;
let csseditor = null;
let tseditor = null;
let previeweditor = null;
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
  reqIds,
  reqClasses,
  reqElems,
  hintBody;
let editorEl = null;
let inputEl = null;
let mode = "";
let checkResultBtn = null;
let rawHarness = false;
let setupCode = "";
let suite;
function loadStreak() {
  const raw = localStorage.getItem("web_streak");
  lessonsInRow = raw ? parseInt(raw, 10) || 0 : 0;
  updateStreakUI();
}
function showEditor(editorType) {
    document.getElementById("tseditor").style.display = "none";
    document.getElementById("csseditor").style.display = "none";
    document.getElementById("htmleditor").style.display = "none";
    document.getElementById("previeweditor").style.display = "none";
    const activeContainer = document.getElementById(`${editorType}editor`);
    activeContainer.style.display = "block";
    switch (editorType) {
        case "ts":
            tseditor.layout();
            break;
        case "css":
            csseditor.layout();
            break;
        case "html":
            htmleditor.layout();
            break;
        case "preview":
            langButtons.querySelectorAll(".langBtn").forEach(b => b.classList.remove("active"));
            break;
    }
}
function saveStreak() {
  localStorage.setItem("web_streak", String(lessonsInRow));
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
let tree = null;
function htmlToJson(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const rootNode = doc.documentElement; 
    return translateNode(rootNode);
}
function getStyles(node) {
    const styles = window.getComputedStyle(node);
    const plainStyles = {};
    for (let i = 0; i < styles.length; i++) {
        const key = styles[i];
        plainStyles[key] = styles.getPropertyValue(key);
    }
    return plainStyles;
}
function translateNode(node) {
    if (node.nodeType === 3) { 
        const text = node.textContent.trim();
        return text ? { type: "text", value: text } : null;
    }
    if (node.nodeType === 1) {
        const tagName = node.tagName.toLowerCase();
        const rawAttrs = {};
        for (let attr of node.attributes) { rawAttrs[attr.name] = attr.value; }
        
        const b = node.getBoundingClientRect();
        const rect = { top: b.top, left: b.left, width: b.width, height: b.height };
        const hasTagChildren = node.childNodes?.length > 1 || (node.childNodes && node.childNodes.length > 0 && node.childNodes[0].nodeType !== 3);
        return {
            type: tagName === 'html' ? "container" : "element",
            label: tagName,
            attributes: {
                id: node.id ? node.id : null,
                classes: Array.from(node.classList),
                raw: rawAttrs
            },
            children: hasTagChildren ? Array.from(node.childNodes)
                .map(child => translateNode(child))
                .filter(c => c !== null) : [],
            value: hasTagChildren ? "" : node.innerText.trim(),
            computedStyle: getStyles(node),
            rect: rect
        };
    }
    return null;
}
let currinst = '';
function runWeb() {
    outEl.textContent = '';
    const reporterScript = `
    (function() {
        const sendMessage = (type, args) => {
        window.parent.postMessage({
            type: 'console',
            method: type,
            args: args.map(arg => {
            try {
                return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
            } catch(e) { return "[Unserializable Object]"; }
            })
        }, '*');
        };

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => { originalLog(...args); sendMessage('log', args); };
        console.error = (...args) => { originalError(...args); sendMessage('error', args); };
        console.warn = (...args) => { originalWarn(...args); sendMessage('warn', args); };

        window.onerror = (msg, url, line, col, error) => {
        sendMessage('error', [\`Runtime Error: \${msg} (Line: \${line})\`]);
        return false;
        };
    })();
    `;
    const parser = new DOMParser();
    const userHTML = htmleditor.getValue();
    const doc = parser.parseFromString(userHTML, "text/html");
    const spy = doc.createElement("script");
    spy.textContent = reporterScript;
    doc.head.prepend(spy); 
    
    const styleLink = doc.querySelector('link[href="style.css"]');
    if (styleLink) {
        const styleTag = doc.createElement("style");
        styleTag.textContent = csseditor.getValue();
        styleLink.replaceWith(styleTag);
    }
    const scriptTag = doc.querySelector('script[src="index.js"]');
    if (scriptTag) {
        const newScript = doc.createElement("script");
        newScript.textContent = ts.transpileModule(tseditor.getValue(), {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                strict: true,
                module: ts.ModuleKind.ESNext,
                noImplicitAny: true,
                removeComments: true,
            },
        }).outputText;
        scriptTag.replaceWith(newScript);
    }
    if (previeweditor.src.startsWith('blob:')) {
        URL.revokeObjectURL(previeweditor.src);
    }

    const blob = new Blob([doc.documentElement.outerHTML], { type: "text/html" });
    previeweditor.src = URL.createObjectURL(blob);
    tree = htmlToJson(userHTML);
    console.log(JSON.stringify(tree, null, 2));
    showEditor("preview");
}
async function simulateEvent(eventData) {
  const iframeDoc = previeweditor.contentDocument;
  const target = iframeDoc.getElementById(eventData.id) || iframeDoc.querySelector(eventData.class);
  
  if (!target) {
    console.error("Target not found for event:", eventData.event);
    return;
  }

  let event;
  const type = eventData.event.toLowerCase();
  if (['click', 'mousedown', 'mouseup', 'mouseover'].includes(type)) {
    event = new MouseEvent(type, {
      bubbles: eventData.bubbles || true,
      cancelable: eventData.cancelable || true,
      view: window
    });
  }
  else if (['keydown', 'keyup', 'keypress'].includes(type)) {
    event = new KeyboardEvent(type, {
      key: eventData.key || 'Enter',
      code: eventData.keyCode || 'Enter',
      bubbles: true
    });
  }
  else {
    event = new Event(type, {
      bubbles: eventData.bubbles || true,
      cancelable: eventData.cancelable || true
    });
  }

  target.dispatchEvent(event);
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const liveHTML = iframeDoc.documentElement.outerHTML;
        tree = htmlToJson(liveHTML); 
        resolve(null);
      });
    });
  });
}
window.addEventListener('message', (event) => {
    const outEl = document.getElementById("output");
    if (event.data.type === 'console') {
        const { method, args } = event.data;
        const message = args.join(' ');
        lastRunOutput += `[${method.toUpperCase()}] ${message}\n`;
        const line = document.createElement('div');
        line.textContent = `[${method.toUpperCase()}] ${message}`;
        if (method === 'error') line.style.color = 'var(--error)';
        outEl.appendChild(line);
    }
});
function getCompletedLessons() {
  const stored = localStorage.getItem("web_completed_lessons");
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
  localStorage.setItem("web_completed_lessons", JSON.stringify(completed));
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
function getIds(currElem = null, ret = []) {
  const root = currElem || tree;
  if (root.attributes?.id) {
    ret.push(root.attributes.id);
  }
  if (root.children) {
    for (const child of root.children) {
      getIds(child, ret);
    }
  }

  return ret;
}
function getClasses(currElem = null, ret = []) {
  const root = currElem || tree;
  if (root.attributes?.classes) {
    ret.push(...root.attributes.classes);
  }
  if (root.children) {
    for (const child of root.children) {
      getClasses(child, ret);
    }
  }

  return ret;
}
function isMatch(node, req) {
  if (req.type && node.type !== req.type) return false;
  if (req.label && node.label !== req.label) return false;
  if (req.attributes) {
    if (req.attributes.id && node.attributes.id !== req.attributes.id) return false;
    if (req.attributes.classes) {
      const studentClasses = new Set(node.attributes.classes || []);
      for (const cls of req.attributes.classes) {
        if (!studentClasses.has(cls)) return false;
      }
    }
    if (req.attributes.raw) {
      for (const key in req.attributes.raw) {
        if (node.attributes.raw[key] !== req.attributes.raw[key]) return false;
      }
    }
  }
  if (req.children !== undefined) {
    const elementCount = node.children.filter(c => c.type === 'element').length;
    if (elementCount !== req.children) return false;
  }
  if (req.value && node.value.trim() !== req.value.trim()) return false;
  if (req.computedStyle) {
    for (const prop in req.computedStyle) {
      if (node.computedStyle[prop] !== req.computedStyle[prop]) return false;
    }
  }
  if (req.rect) {
    for (const side in req.rect) {
      if (node.rect[side] !== req.rect[side]) return false;
    }
  }

  return true;
}
/*
{
  "type": "element", 
  "label?": "h1",
  "attributes?": {
    "id?": "main-title",
    "classes?": ["header"],
    "raw?": { "data-test": "val" }
  },
  "children?": 1, 
  "value?": "Hello",
  "computedStyle?": {
    "color": "rgb(255, 0, 0)"
  },
  "rect?": {
    "width?": 200
  },
  "depth?": 2
}
{
  "type": "element", 
  "label": "h1",
  "attributes": {
    "id": "main-title",
    "classes": ["header", "blue"],
    "raw": { "id": "main-title", "class": "header blue", "data-test": "val" }
  },
  "children": [
    { "type": "text", "value": "Hello" }
  ],
  "value": "Hello",
  "computedStyle": {
    "color": "rgb(255, 0, 0)",
    "display": "block",
    "margin-top": "10px"
  },
  "rect": {
    "top": 20,
    "left": 50,
    "width": 200,
    "height": 40
  }
}
  */
function checkElemMatches(req, node, depth = 0) {
  if (!node) return false;

  if (req.depth !== undefined && depth > req.depth) {
    return false;
  }
  const depthMatches = (req.depth === undefined || depth === req.depth);
  if (depthMatches && isMatch(node, req)) {
    return true;
  }
  
  if (node.children) {
    for (const child of node.children) {
      if (child && checkElemMatches(req, child, depth + 1)) return true;
    }
  }

  return false;
}
function checkTreeMatches() {
  const existingIds = new Set(getIds());
  const existingClasses = new Set(getClasses());
  if (reqIds) {
    for (const reqId of reqIds) {
      if (!existingIds.includes(reqId)) return false;
    }
  }
  if (reqClasses) {
    for (const reqClass of reqClasses) {
      if (!existingClasses.includes(reqClass)) return false;
    }
  }
  console.log(JSON.stringify(reqElems))
  if (reqElems) {
    for (const reqElem of reqElems) {
      if (!checkElemMatches(reqElem, tree)) return false;
    }
  }
  return true;
}
function submitCheck() {
  if (!currentLesson || (!currentLesson.expectedOutput && !mustContain && !currentLesson.reqIds && !currentLesson.reqClasses && !currentLesson.reqElems)) {
    outEl.textContent += "\nNo expectedOutput defined for this lesson.\n";
    return;
  }
  let expected = "";
  let actual = "";
  let passed = false;
  if (mode === "text") {
    if (!currentLesson || (!currentLesson.expectedOutput && !mustContain)) {
      outEl.textContent += "\nNo expectedOutput defined for this lesson.\n";
      return;
    }
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
    passed = true;
    const cleanedLines = lastRunOutput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    const studentOut =
      cleanedLines.join("\n") + (cleanedLines.length ? "\n" : "");

    expected = currentLesson.expectedOutput
      ? currentLesson.expectedOutput.trim()
      : "";
    actual = studentOut.trim();
    if (mustContain) {
      if (Array.isArray(mustContain)) {
        for (let str of mustContain) {
          passed = actual.includes(str);
          if (!passed) break;
        }
      } else {
        passed = actual.includes(mustContain);
      }
    } else if (expected) {
      passed = actual === expected;
    }
    passed = passed && checkTreeMatches();
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
    localStorage.setItem("web_current_lesson", lessonFileFromUrl);

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
        outEl.textContent += "\n\nGot:\n" + actual + "\n";
      }
      if (expected) {
        outEl.textContent += "\nExpected:\n" + expected;
        outEl.textContent += "\n\nGot:\n" + actual + "\n";
      }
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
document.addEventListener("beforeunload", () => {
  let studentTs = tseditor.getValue();
  let studentCss = csseditor.getValue();
  let studentHtml = htmleditor.getValue();
  const data = {
    lesson: currentLesson.id || "",
    ts: studentTs,
    css: studentCss,
    html: studentHtml
  };

  localStorage.setItem("saved_code_web", JSON.stringify(data));
});
window.addEventListener("pagehide", () => {
  let studentTs = tseditor.getValue();
  let studentCss = csseditor.getValue();
  let studentHtml = htmleditor.getValue();
  const data = {
    lesson: currentLesson.id || "",
    ts: studentTs,
    css: studentCss,
    html: studentHtml
  };

  localStorage.setItem("saved_code_web", JSON.stringify(data));
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("langBtn")) {
    langButtons.querySelectorAll(".langBtn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    showEditor(e.target.id);
  }
});
async function runWithSuite(suiteFile) {
  if (!tseditor || !csseditor || !htmleditor) return;
  let studentTs = tseditor.getValue();
  let studentCss = csseditor.getValue();
  let studentHtml = htmleditor.getValue();
  const data = {
    lesson: currentLesson.id || "",
    ts: studentTs,
    css: studentCss,
    html: studentHtml
  };

  localStorage.setItem("saved_code_web", JSON.stringify(data));
  lastRunOutput = "";
  runWeb();
  if (suiteFile) {
    for (const event of suiteFile) {
      await simulateEvent(event);
    }
  }
}

window.btn = function(bn) {
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
  if (htmleditor && csseditor && tseditor) {
    htmleditor.setValue(lesson.starterHtml|| "");
    csseditor.setValue(lesson.starterCss || "");
    tseditor.setValue(lesson.starterTs|| "");
    const saved = localStorage.getItem("saved_code_web");

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (data?.lesson === lesson.id || !lesson.id && typeof data.html === "string" && typeof data.css === "string" && typeof data.ts === "string") {
          htmleditor.setValue(data.html);
          csseditor.setValue(data.css);
          tseditor.setValue(data.ts);
        }
      } catch (e) {}
    }
  }

  outEl.textContent = "";
  lastRunOutput = "";
  reqIds = lesson.reqIds || null;
  reqClasses = lesson.reqClasses || null;
  reqElems = lesson.reqElems || null;
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

async function setupLogic() {
  titleEl = document.getElementById("lesson-title");
  descEl = document.getElementById("lesson-description");
  outEl = document.getElementById("output");
  streakEl = document.getElementById("streak");
  hintBody = document.querySelector(".hint-body");
  let params = new URLSearchParams(location.search);
  let lessonFileFromUrl = params.get("lesson");
  let lastLesson = localStorage.getItem("web_current_lesson");
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
      await runWithSuite(suite);
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
        await runWithSuite(harnessToUse);
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
document.addEventListener("DOMContentLoaded", () => {
  require(["vs/editor/editor.main"], function () {
    tseditor = monaco.editor.create(document.getElementById("tseditor"), {
      value: "// ts sample",
      language: "typescript",
      theme: "vs-dark",
    });
    tseditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      function () {
        const runBtn = document.getElementById("run");
        if (runBtn) runBtn.click();
      },
    );
    csseditor = monaco.editor.create(document.getElementById("csseditor"), {
      value: "/*css sample*/",
      language: "css",
      theme: "vs-dark",
    });
    csseditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      function () {
        const runBtn = document.getElementById("run");
        if (runBtn) runBtn.click();
      },
    );
    htmleditor = monaco.editor.create(document.getElementById("htmleditor"), {
      value: "<! html sample>",
      language: "html",
      theme: "vs-dark",
    });
    htmleditor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      function () {
        const runBtn = document.getElementById("run");
        if (runBtn) runBtn.click();
      },
    );
    previeweditor = document.getElementById("previeweditor");
    console.log("Editors initialized");
    showEditor("html");
    setupLogic();
  });
});
