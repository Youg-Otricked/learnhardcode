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
document.addEventListener("DOMContentLoaded", () => {
  
})