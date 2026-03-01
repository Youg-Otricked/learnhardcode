import WorkerAPI from './WorkerAPI';
let checkResultBtn: HTMLButtonElement;
let loadSolutionBtn: HTMLButtonElement;
let api: WorkerAPI;
let useSolution: boolean = false;
let editor: monaco.editor.IStandaloneCodeEditor;
let currentLesson: Lesson | null = null;
let lastRunOutput: string = '';
let nextLessonId: string | null = null;
let submitHarnessFile: string | null;
let runHarnessFile: string | null;
let buttons: HTMLCollectionOf<Element>;
let titleEl: HTMLElement;
let descEl: HTMLElement;
let outEl: HTMLElement;
let runBtn: HTMLElement;
let checkBtn: HTMLElement;
let nextBtn: HTMLElement;
let prevBtn: HTMLElement | null;
let showButtons: boolean;
let mustContain: string | null;
let correct: number | null = null;
let prevLessonId: string | null = null;
let hintBody: HTMLElement | null = null;

let lessonsInRow: number = 0;
let streakEl: HTMLElement | null = null;
let lessonhint: string;

let solutionFile: string | null = null;

interface Lesson {
  title?: string;
  description?: string;
  starterCode?: string;
  showButtons?: boolean;
  hint?: string;
  nextLesson?: string;
  runHarness?: string;
  submitHarness?: string;
  solution?: string;
  mustContain?: string;
  correct?: number;
  previous?: string;
  expectedOutput?: string;
  b1t?: string;
  b2t?: string;
  b3t?: string;
  b4t?: string;
}

function loadStreak(): void {
  const raw = localStorage.getItem('cpp_streak');
  lessonsInRow = raw ? (parseInt(raw, 10) || 0) : 0;
  updateStreakUI();
}

function saveStreak(): void {
  localStorage.setItem('cpp_streak', String(lessonsInRow));
}

function updateStreakUI(): void {
  if (!streakEl) return;
  streakEl.textContent = `Lessons in a row: ${lessonsInRow}`;
}

async function loadLesson(lessonFile: string): Promise<void> {
  const path = 'lessons/' + lessonFile;
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load lesson ' + path);
  const lesson: Lesson = await res.json();
  currentLesson = lesson;

  titleEl.textContent = lesson.title || '';
  descEl.innerHTML = marked.parse(lesson.description) || '';
  if (editor) editor.setValue(lesson.starterCode || '');

  showButtons = lesson.showButtons || false;
  outEl.textContent = '';
  lastRunOutput = '';
  lessonhint = lesson.hint || '';
  nextLessonId = lesson.nextLesson || null;
  runHarnessFile = lesson.runHarness || null;
  submitHarnessFile = lesson.submitHarness || null;
  solutionFile = lesson.solution || null;
  mustContain = lesson.mustContain || null;
  correct = lesson.correct || null;
  prevLessonId = lesson.previous || null;

  document.getElementById('b1')!.textContent = lesson.b1t || '';
  document.getElementById('b2')!.textContent = lesson.b2t || '';
  document.getElementById('b3')!.textContent = lesson.b3t || '';
  document.getElementById('b4')!.textContent = lesson.b4t || '';

  nextBtn.style.display = 'none';
  const btns = document.querySelectorAll('.ans') as NodeListOf<HTMLElement>;
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

function setupLogic(): void {
  titleEl = document.getElementById('lesson-title')!;
  descEl = document.getElementById('lesson-description')!;
  outEl = document.getElementById('out')!;
  runBtn = document.getElementById('run')!;
  checkBtn = document.getElementById('check-stdout')!;
  nextBtn = document.getElementById('next-lesson')!;
  prevBtn = document.getElementById('prev-lesson');
  checkResultBtn = document.getElementById('check-result')! as HTMLButtonElement;
  loadSolutionBtn = document.getElementById('load-solution')! as HTMLButtonElement;
  streakEl = document.getElementById('streak');
  hintBody = document.querySelector('.hint-body');

  api = new WorkerAPI();

  api.onWrite = (text: string) => {
    lastRunOutput += text;
    outEl.textContent += text;
  };

  loadStreak();

  async function runWithSuite(suiteFile: string | null, label?: string): Promise<void> {
    const studentSource = editor.getValue();
    outEl.textContent = (label || 'Building & running') + '...\n';
    lastRunOutput = '';

    let fullSource = studentSource;

    if (suiteFile) {
      const suite = await fetch(suiteFile).then(r => r.text());
      fullSource = suite + '\n\n' + studentSource;
    }

    try {
      api.compileLinkRun(fullSource);
    } catch (err) {
      outEl.textContent += '\nError: ' + (err instanceof Error ? err.message : String(err)) + '\n';
    }
  }

  runBtn.addEventListener('click', () => {
    const suite = runHarnessFile || null;
    runWithSuite(suite, 'Building & running');
  });

  function submitCheck(): void {
    if (!currentLesson || (!currentLesson.expectedOutput && !currentLesson.mustContain)) {
      outEl.textContent += '\nNo expectedOutput defined for this lesson.\n';
      return;
    }

    const cleanedLines = lastRunOutput
      .split('\n')
      .map(line => line.replace(/\x1b\[[0-9;]*m/g, '').trim())
      .filter(line => line);

    const studentLines = cleanedLines.filter(line => !line.startsWith('>'));
    const studentOut = studentLines.join('\n') + (studentLines.length ? '\n' : '');

    const expected = (currentLesson!.expectedOutput || '').trim();
    const actual = studentOut.trim();

    let passed = false;

    if (mustContain) {
      passed = actual.includes(mustContain);
    } else {
      passed = actual === expected;
    }

    if (passed) {
      outEl.textContent += '\n[PASS] Output matches expected.\n';
      lessonsInRow += 1;
      if (useSolution) {
        lessonsInRow = 0;
        outEl.textContent += '\n(Note: Streak reset due to loading solution.)\n';
      }
      saveStreak();
      updateStreakUI();
      const params = new URLSearchParams(location.search);
      const lessonFileFromUrl = params.get('lesson') || 'lesson1.json';
      localStorage.setItem('cpp_current_lesson', lessonFileFromUrl);

      if (nextLessonId) nextBtn.style.display = 'inline-block';
    } else {
      lessonsInRow = 0;
      saveStreak();
      updateStreakUI();
      outEl.textContent += '\n[FAIL] Output does not match. (streak reset)\n';
      if (mustContain) {
        outEl.textContent += '\nExpected to contain:\n' + mustContain;
      } else {
        outEl.textContent += '\nExpected:\n' + expected;
      }
      outEl.textContent += '\n\nGot:\n' + actual + '\n';
    }
  }

  document.addEventListener('click', (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('.hint-toggle');
    if (!btn) return;

    const hint = (btn as HTMLElement).closest('.hint') as HTMLElement;
    hint.classList.toggle('open');

    const open = hint.classList.contains('open');
    (btn as HTMLElement).textContent = open ? 'Hide hint ▴' : 'Show hint ▾';
  });

  checkResultBtn.addEventListener('click', () => {
    submitCheck();

    useSolution = false;
    runBtn.style.display = 'inline-block';
    checkBtn.style.display = 'inline-block';
    if (prevBtn && prevLessonId) prevBtn.style.display = 'inline-block';
    checkResultBtn.style.display = 'none';
  });

  checkBtn.addEventListener('click', async () => {
    const harnessToUse = submitHarnessFile || runHarnessFile || null;
    await runWithSuite(harnessToUse, 'Submitting');

    runBtn.style.display = 'none';
    checkBtn.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';

    checkResultBtn.style.display = 'inline-block';
  });

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
      outEl.textContent += '\nFailed to load solution: ' + (e instanceof Error ? e.message : String(e)) + '\n';
    }
  });

  nextBtn.addEventListener('click', () => {
    if (!nextLessonId) return;
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', nextLessonId);
    window.location.href = url.toString();
  });

  prevBtn?.addEventListener('click', () => {
    if (!prevLessonId) return;
    const url = new URL(window.location.href);
    url.searchParams.set('lesson', prevLessonId);
    window.location.href = url.toString();
  });

  const params = new URLSearchParams(location.search);
  const lessonFileFromUrl = params.get('lesson');
  const lastLesson = localStorage.getItem('cpp_current_lesson');

  const lessonFile = lessonFileFromUrl || lastLesson || 'lesson1.json';

  loadLesson(lessonFile).catch(err => {
    outEl.textContent = 'Failed to load lesson: ' + (err instanceof Error ? err.message : String(err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  (window as any).require.config({
    paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' }
  });

  (window as any).require(['vs/editor/editor.main'], () => {
    const editorContainer = document.getElementById('editor');
    if (!editorContainer) return;

    editor = (window as any).monaco.editor.create(editorContainer, {
      value: '',
      language: 'cpp',
      theme: 'vs-dark',
      automaticLayout: true,
    });

    setupLogic();
  });
});

function btn(bn: number): void {
  if (bn === correct) {
    lessonsInRow += 1;
    saveStreak();
    updateStreakUI();
    alert('Correct');
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
    alert('Incorrect');
  }
}

export { setupLogic, loadLesson };