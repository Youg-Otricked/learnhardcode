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
async function saveCourse(courseData) {
  const db = await openDB();
  const tx = db.transaction('courses', 'readwrite');
  tx.objectStore('courses').put(courseData);
}

async function getAllCourses() {
  const db = await openDB();
  const tx = db.transaction('courses', 'readonly');
  return new Promise((resolve) => {
    const request = tx.objectStore('courses').getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

async function deleteCourse(name) {
  const db = await openDB();
  const tx = db.transaction('courses', 'readwrite');
  tx.objectStore('courses').delete(name);
}
async function importCourse(json) {
  const course = JSON.parse(json);
  await saveCourse(course);
  renderCourseList();
}
async function renderCourseList() {
  const courses = await getAllCourses();
  const container = document.getElementById('course-list');
  container.innerHTML = '';

  if (courses.length === 0) {
    container.innerHTML = '<p>No custom courses imported yet.</p>';
    return;
  }

  for (const course of courses) {
    const div = document.createElement('div');
    div.className = 'course-card';
    div.innerHTML = `
      <h3>${course.course_name}</h3>
      <p>${course.description || 'No description'}</p>
      <p>Language: ${course.course_lang}</p>
      <p>Lessons: ${course.lessons ? course.lessons.length : 0}</p>
      <button onclick="playCourse('${course.course_name}')">Play</button>
      <button onclick="removeCourse('${course.course_name}')">Delete</button>
    `;
    container.appendChild(div);
  }
}

async function playCourse(name) {
  const db = await openDB();
  const tx = db.transaction('courses', 'readonly');
  const request = tx.objectStore('courses').get(name);
  request.onsuccess = () => {
    const course = request.result;
    localStorage.setItem('custom_course', JSON.stringify(course));
    const firstLesson = course.lessons[0];
    window.location.href = `./player.html?course=${name}&lesson=0`;
  };
}

async function removeCourse(name) {
  if (!confirm(`Delete ${name}?`)) return;
  await deleteCourse(name);
  renderCourseList();
}
document.addEventListener("DOMContentLoaded", () => {
  renderCourseList();
  document.getElementById("loadCourse/lesson").addEventListener('click', () => {
    const courseJson = document.getElementById("courseString").value;
    importCourse(courseJson);
  })
  const dropZone = document.getElementById('drop-zone');
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      alert('Please drop a .json file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      importCourse(reader.result);
    };
    reader.readAsText(file);
  });
});