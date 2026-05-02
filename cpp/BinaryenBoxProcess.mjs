import BoxProcess from "./BoxProcess.mjs";
import BinaryenBoxModule from "./emception/binaryen/binaryen-box.mjs";

export default class BinaryenBoxProcess extends BoxProcess {
    constructor(opts) {
        const wasmBinary = opts.FS.readFile("/wasm/binaryen-box.wasm");
        super(BinaryenBoxModule, { ...opts, wasmBinary });
    }
};
