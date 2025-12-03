(function () {
    const kFps = document.getElementById('kFps');

    let before, now, fps, lastUpdate = 0;
    before = Date.now();
    fps = 0;
    requestAnimationFrame(
        function loop() {
            now = Date.now();
            fps = Math.round(1000 / (now - before));
            before = now;

            if (now - lastUpdate >= 300) {
                kFps.textContent = fps + " FPS";
                lastUpdate = now;
            }
            requestAnimationFrame(loop);
        }
    );
})();