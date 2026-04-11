let currentRun = null;
console.log("worker script loaded");
self.console = {
  log: (...args) => {
    const safe = (v) => {
      try {
        if (typeof v === "object") return JSON.stringify(v, null, 2);
        return String(v);
      } catch {
        return "[Unserializable]";
      }
    };

    self.postMessage({
      type: "log",
      data: args.map(safe).join(" "),
      run: currentRun
    });
  }
};

globalThis.console = self.console;
self.onmessage = async (e) => {
  const { code, run } = e.data;
  currentRun = run;
  activeAsync = 0;

  try {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    await import(url);

    URL.revokeObjectURL(url);
  } catch (err) {
    self.postMessage({ type: "error", data: err.message, run });
  }
};