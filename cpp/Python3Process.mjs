import EmProcess from "../cpp/EmProcess.mjs";
import PythonModule from "../cpp/cpython/python.mjs";

export default class Python3Process extends EmProcess {
    constructor(opts) {
        const wasmBinary = opts.FS.readFile("/wasm/python.wasm");
        super(PythonModule, { ...opts, wasmBinary });
    }
};
