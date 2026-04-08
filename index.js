document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        if (e.target.id == "reset") {
            Object.keys(localStorage)
                .filter(key => key.startsWith("saved_code_"))
                .forEach(key => localStorage.removeItem(key));
            e.target.textContent = "Saved Code Reset!";
            setTimeout(() => {
                e.target.textContent = "Reset Saved Code";
            }, 700);
        }
    });
});