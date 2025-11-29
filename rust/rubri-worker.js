// rubri-worker.js
import { initInterpreter } from "./rubri-runtime.js";

(async () => {
  const interpreter = await initInterpreter();

  addEventListener("message", async (event) => {
    const { id, code, printLast } = event.data;
    const result = await interpreter.run(code, printLast);
    postMessage({ id, result });  // include id so RubriRunner can match
  });

  postMessage({ loaded: true });
})();