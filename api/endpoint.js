let running = true;
console.log("worker alive");
async function poll() {
    while (running) {
        try {
            const res = await fetch("http://127.0.0.1:14042");
            const text = await res.text();

            self.postMessage({ success: text });
        } catch (e) {
        }

        await new Promise(r => setTimeout(r, 2000));
    }
}

self.onmessage = (e) => {
    if (e.data === "stop") {
        running = false;
    }
};

poll();