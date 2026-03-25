let params = new URLSearchParams(location.search);
let file = `${params.get('course') ? params.get('course') + "_" : ""}chapters.json`;
const chapters = await (await fetch(file)).json();
const completedLessons = JSON.parse(localStorage.getItem("rust_completed_lessons") || '[]');
console.log(chapters);
const completedSet = new Set(Object.keys(completedLessons));
const chaptersElem = document.getElementById("chapters");
//<details id="chapters" style="position: absolute; top: 0; right: 0; text-align: center;"><summary style="padding: 0 30px;">Chapters</summary><button style="background: none; padding: 0; border: none; cursor: pointer; margin: 0 auto; font-size: 19;">◉ Variables</button></details>
for (const chapter of chapters["chapters"].sort((a, b) => a.number - b.number)) {
    const btn = document.createElement("button");
    btn.style.cssText = "background: none; padding: 0; border: none; cursor: pointer; margin: 0 auto; font-size: 19px;";
    const br = document.createElement("br");
    const allCompleted = chapter.lessons.every((l) => completedSet.has(l));
    btn.textContent = `${allCompleted ? '◉' : '◯'} ${chapter.name}`;
    btn.onclick = () => {
        window.location.href = `?lesson=${chapter.firstLesson}`;
    };
    chaptersElem.appendChild(btn);
    chaptersElem.appendChild(br);
}
export {};
//# sourceMappingURL=uitest.js.map