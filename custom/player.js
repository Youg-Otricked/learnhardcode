let currentCourse = null;
let lessonIndex = 0;
let editor = null;
let currentLesson = null;
let lastRunOutput = '';
let prevLessonId = null;
let lessonsInRow = 0;
let mustContain = null;
let b1Btn, b2Btn, b3Btn, b4Btn;
let correct = null;
let useSolution = false;
let lessonXP = null;
let titleEl, descEl, outEl, checkBtn, nextBtn, prevBtn, streakEl, hintBody;
let editorEl = null;
let inputEl = null;
let mode = "";
function loadStreak() {
    const raw = localStorage.getItem('custom_streak');
    lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
    updateStreakUI();
}
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('learnhardcode', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('courses')) {
        db.createObjectStore('courses', { keyPath: 'course_name' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}
function saveStreak() {
    localStorage.setItem('custom_streak', String(lessonsInRow));
}
async function loadCourseFromDB(courseName) {
    const db = await openDB();
    const tx = db.transaction('courses', 'readonly');
    return new Promise((resolve) => {
        const request = tx.objectStore('courses').get(courseName);
        request.onsuccess = () => resolve(request.result);
    });
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
function getCompletedLessons() {
  const stored = localStorage.getItem('custom_completed_lessons');
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
  localStorage.setItem('custom_completed_lessons', JSON.stringify(completed));
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
    if (!currentLesson || (!currentLesson.expectedOutput && !mustContain) && mode == "editor") {
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
      passed = localStorage.getItem('cli_success') === 'true';
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
        localStorage.setItem('custom_current_lesson', lessonFileFromUrl);

        if (lessonIndex + 1 < currentCourse.lessons.length) nextBtn.style.display = 'inline-block';
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
    if (lessonIndex + 1 < currentCourse.lessons.length) nextBtn.style.display = 'inline-block';
  } else {
    lessonsInRow = 0;
    saveStreak();
    updateStreakUI();
    alert("Incorrect");
  }
}
async function loadLesson(index) {
    const lesson = currentCourse.lessons[index];
    if (!lesson) throw new Error('Lesson not found at index ' + index);
    currentLesson = lesson;
    lessonIndex = index;

    titleEl.textContent = lesson.title || '';
    descEl.innerHTML = marked.parse(lesson.description || '');

    outEl.textContent = '';
    lastRunOutput = '';
    mustContain     = lesson.mustContain   || null;
    correct         = lesson.correct       || null;
    runHarnessFile  = lesson.runHarness    || null;
    mode            = lesson.mode          || "text";
    document.getElementById("difficulty").textContent = lesson.difficulty ? "Difficulty: " + lesson.difficulty : "Difficulty: unknown";
    lessonXP        = parseInt(lesson.xp, 10) || 0;
    editorEl = document.getElementsByClassName("code-box")[0];

    if (mode === "text") {
        editorEl.innerHTML = '<textarea class="editor"></textarea><button id="check-stdout">Submit</button><button id="next-lesson" style="display:none">Next Lesson</button><button id="prev-lesson">Previous Lesson</button>';
        checkBtn = document.getElementById('check-stdout');
        nextBtn  = document.getElementById('next-lesson');
        prevBtn  = document.getElementById('prev-lesson');
        inputEl  = document.getElementsByClassName("editor")[0];
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
    </div>
    <pre id="out"></pre>`;
        nextBtn = document.getElementById('next-lesson');
        prevBtn = document.getElementById('prev-lesson');
        outEl   = document.getElementById('out');
    } else {
        // MCQ mode - just buttons
        editorEl.innerHTML = '<button id="next-lesson" style="display:none">Next Lesson</button><button id="prev-lesson">Previous Lesson</button>';
        nextBtn = document.getElementById('next-lesson');
        prevBtn = document.getElementById('prev-lesson');
    }

    const btns = document.querySelectorAll('.ans');
    b1Btn = btns[0]; b2Btn = btns[1];
    b3Btn = btns[2]; b4Btn = btns[3];
    if (b1Btn) b1Btn.textContent = lesson.b1t || '';
    if (b2Btn) b2Btn.textContent = lesson.b2t || '';
    if (b3Btn) b3Btn.textContent = lesson.b3t || '';
    if (b4Btn) b4Btn.textContent = lesson.b4t || '';

    prevBtn.style.display = (index > 0) ? 'inline-block' : 'none';
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
    descEl = document.getElementById('lesson-description');
    outEl = document.getElementById('output');
    streakEl = document.getElementById('streak');
    hintBody = document.querySelector('.hint-body');
    checkBtn = document.getElementById('check-stdout');
    nextBtn = document.getElementById('next-lesson');
    prevBtn = document.getElementById('prev-lesson');

    const params = new URLSearchParams(location.search);
    const courseName = params.get('course');
    lessonIndex = parseInt(params.get('lesson') || '0');

    currentCourse = await loadCourseFromDB(courseName);
    if (!currentCourse) {
        outEl.textContent = 'Course not found: ' + courseName;
        return;
    }

    await loadLesson(lessonIndex);
    loadStreak();

    if (checkBtn) {
        checkBtn.addEventListener('click', () => submitCheck());
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (lessonIndex + 1 < currentCourse.lessons.length) {
                const url = new URL(window.location.href);
                url.searchParams.set('lesson', lessonIndex + 1);
                window.location.href = url.toString();
            }
        });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (lessonIndex > 0) {
                const url = new URL(window.location.href);
                url.searchParams.set('lesson', lessonIndex - 1);
                window.location.href = url.toString();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupLogic();
});