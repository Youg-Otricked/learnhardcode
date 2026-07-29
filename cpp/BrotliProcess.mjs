import EmProcess from "../cpp/EmProcess.mjs";
import BrotliModule from "../cpp/brotli/brotli.mjs";

export default class BrotliProcess extends EmProcess {
    constructor(opts) {
        super(BrotliModule, { ...opts });
    }
};
