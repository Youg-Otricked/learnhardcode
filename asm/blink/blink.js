
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Blink_instances, _Blink_stdinHandler, _Blink_stdoutHandler, _Blink_stderrHandler, _Blink_signalHandler, _Blink_stateChangeHandler, _Blink_initEmscripten, _Blink_assembler_logcollector, _Blink_setState, _Blink_extern_c__signal_callback, _Blink_extern_c__exit_callback, _Blink_setEmulationArgs, _Blink_fetchBinaryFile, _Blink_default_signalHandler, _Blink_default_stdinHandler, _Blink_default_stdoutHandler, _Blink_default_stderrHandler, _Blink_default_stateChangeHandler;

import blinkenlib from "./blinkenlib.js";
/**
 * Machine Cross-language struct.
 * offsers access to some of the blink Machine struct elements,
 * such as registers and virtual memory.
 *
 * Javascript DataView  <-----> Struct of uint32_t pointers to
 *                              important elements of Machine m
 *
 *
 */
class M_CLStruct {
    constructor(memory, struct_pointer) {
        this.version = 1;
        this.sizeof_key = 4;
        this.keys = {
            version: { index: 0, pointer: false } /*number*/,
            codemem: { index: 1, pointer: true },
            stackmem: { index: 2, pointer: true },
            readaddr: { index: 3, pointer: true },
            readsize: { index: 4, pointer: false } /*number*/,
            writeaddr: { index: 5, pointer: true },
            writesize: { index: 6, pointer: false } /*number*/,
            flags: { index: 7, pointer: false },
            cs__base: { index: 8, pointer: true },
            rip: { index: 9, pointer: true },
            rsp: { index: 10, pointer: true },
            rbp: { index: 11, pointer: true },
            rsi: { index: 12, pointer: true },
            rdi: { index: 13, pointer: true },
            r8: { index: 14, pointer: true },
            r9: { index: 15, pointer: true },
            r10: { index: 16, pointer: true },
            r11: { index: 17, pointer: true },
            r12: { index: 18, pointer: true },
            r13: { index: 19, pointer: true },
            r14: { index: 20, pointer: true },
            r15: { index: 21, pointer: true },
            rax: { index: 22, pointer: true },
            rbx: { index: 23, pointer: true },
            rcx: { index: 24, pointer: true },
            rdx: { index: 25, pointer: true },
            //disassembly buffer
            dis__max_lines: { index: 26, pointer: false },
            dis__max_line_len: { index: 27, pointer: false },
            dis__current_line: { index: 28, pointer: false },
            dis__buffer: { index: 29, pointer: true },
        };
        this.memory = memory;
        this.struct_pointer = struct_pointer;
        this.growMemory();
        //check shared struct version
        const js_version = this.version;
        const wasm_version = this.getPtr("version");
        if (js_version !== wasm_version) {
            throw new Error("shared struct version mismatch");
        }
    }
    growMemory() {
        const struct_size = Object.keys(this.keys).length * this.sizeof_key;
        this.memView = new DataView(this.memory.buffer);
        this.structView = new DataView(this.memory.buffer, this.struct_pointer, struct_size);
    }
    stringReadBytes(key, num) {
        const ptr = this.getPtr(key);
        let retStr = "";
        for (let i = 0; i < num; i++) {
            retStr += this.memView
                .getUint8(ptr + i)
                .toString(16)
                .padStart(2, "0");
            retStr += " ";
        }
        return retStr;
    }
    stringReadU64(key) {
        const ptr = this.getPtr(key);
        let hexStr = "";
        for (let i = 7; i >= 0; i--) {
            const byte = this.memView.getUint8(ptr + i);
            if (hexStr || byte || i === 0)
                hexStr += byte.toString(16).padStart(2, "0");
        }
        return `0x${hexStr}`;
    }
    readU64(key) {
        const ptr = this.getPtr(key);
        const little_endian = true;
        return this.memView.getBigUint64(ptr, little_endian);
    }
    getPtr(key) {
        if (!this.structView.buffer.byteLength) {
            console.log("blink: memory grew");
            this.growMemory();
        }
        const index = this.keys[key].index * this.sizeof_key;
        const little_endian = true;
        return this.structView.getUint32(index, little_endian);
    }
    writeStringToHeap(offset, str, maxLength) {
        if (!this.structView.buffer.byteLength) {
            console.log("blink: memory grew");
            this.growMemory();
        }
        if (offset === 0) {
            console.log("blink: write to null ptr");
            return;
        }
        const writeLen = Math.min(str.length, maxLength - 1);
        for (let i = 0; i < writeLen; ++i) {
            const u = str.charCodeAt(i);
            if (u >= 0x20 && u <= 0x7e) {
                this.memView.setUint8(offset + i, u);
            }
            else {
                //replace non-ascii characters with a space
                this.memView.setUint8(offset + i, 0x20);
            }
        }
        // Null-terminate the pointer to the buffer.
        this.memView.setUint8(offset + writeLen, 0);
    }
}
const signals = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGQUIT: 3,
    SIGILL: 4,
    SIGTRAP: 5,
    SIGABRT: 6,
    SIGBUS: 7,
    SIGFPE: 8,
    SIGKILL: 9,
    SIGUSR1: 10,
    SIGSEGV: 11,
    SIGUSR2: 12,
    SIGPIPE: 13,
    SIGALRM: 14,
    SIGTERM: 15,
    SIGSTKFLT: 16,
    SIGCHLD: 17,
    SIGCONT: 18,
    SIGSTOP: 19,
    SIGTSTP: 20,
    SIGTTIN: 21,
    SIGTTOU: 22,
    SIGURG: 23,
    SIGXCPU: 24,
    SIGXFSZ: 25,
    SIGVTALRM: 26,
    SIGPROF: 27,
    SIGWINCH: 28,
    SIGIO: 29,
    SIGPWR: 30,
    SIGSYS: 31,
};
const sigtrap_codes = {
    BLINK_SIGTRAP: 0,
    BLINK_PREEMPT: 40,
    BLINK_STEP: 41,
    BLINK_FAKE_TTY: 42,
};
const signals_info = {
    1: {
        name: "SIGHUP",
        description: "Hang up controlling terminal or process.",
    },
    2: { name: "SIGINT", description: "Interrupt from keyboard, Control-C." },
    3: { name: "SIGQUIT", description: "Quit from keyboard, Control-\\." },
    4: { name: "SIGILL", description: "Illegal instruction." },
    5: { name: "SIGTRAP", description: "Breakpoint for debugging." },
    6: { name: "SIGABRT", description: "Abnormal termination." },
    7: { name: "SIGBUS", description: "Bus error." },
    8: { name: "SIGFPE", description: "Floating-point exception." },
    9: { name: "SIGKILL", description: "Forced-process termination." },
    10: { name: "SIGUSR1", description: "Available to processes." },
    11: { name: "SIGSEGV", description: "Invalid memory reference." },
    12: { name: "SIGUSR2", description: "Available to processes." },
    13: { name: "SIGPIPE", description: "Write to pipe with no readers." },
    14: { name: "SIGALRM", description: "Real-timer clock." },
    15: { name: "SIGTERM", description: "Process termination." },
    16: { name: "SIGSTKFLT", description: "Coprocessor stack error." },
    17: {
        name: "SIGCHLD",
        description: "Child process stopped or terminated or got a signal if traced.",
    },
    18: { name: "SIGCONT", description: "Resume execution, if stopped." },
    19: { name: "SIGSTOP", description: "Stop process execution, Ctrl-Z." },
    20: { name: "SIGTSTP", description: "Stop process issued from tty." },
    21: { name: "SIGTTIN", description: "Background process requires input." },
    22: { name: "SIGTTOU", description: "Background process requires output." },
    23: { name: "SIGURG", description: "Urgent condition on socket." },
    24: {
        name: "SIGXCPU",
        description: "CPU time limit exceeded, execution took too long.",
    },
    25: { name: "SIGXFSZ", description: "File size limit exceeded." },
    26: { name: "SIGVTALRM", description: "Virtual timer clock." },
    27: { name: "SIGPROF", description: "Profile timer clock." },
    28: { name: "SIGWINCH", description: "Window resizing." },
    29: { name: "SIGIO", description: "I/O now possible." },
    30: { name: "SIGPWR", description: "Power supply failure." },
    31: { name: "SIGSYS", description: "Bad system call." },
};
/**
 * A javascript wrapper for the blink x86-64 emulator.
 * The goal is to provide an interface to blink that is as
 * abstracted away as possible from emscripten, keeping open the
 * possibility to completely remove the emscripten dependency
 *
 */
class Blink {
    /**
     * Initialize the emscripten blink module.
     */
    constructor(mode, stdinHandler, stdoutHandler, stderrHandler, signalHandler, stateChangeHandler) {
        _Blink_instances.add(this);
        _Blink_stdinHandler.set(this, void 0);
        _Blink_stdoutHandler.set(this, void 0);
        _Blink_stderrHandler.set(this, void 0);
        _Blink_signalHandler.set(this, void 0);
        _Blink_stateChangeHandler.set(this, void 0);
        this.states = {
            NOT_READY: "NOT_READY",
            READY: "READY",
            ASSEMBLING: "ASSEMBLING",
            LINKING: "LINKING",
            PROGRAM_LOADED: "PROGRAM_LOADED",
            PROGRAM_RUNNING: "PROGRAM_RUNNING",
            PROGRAM_READLINE_PAUSE: "PROGRAM_READLINE_PAUSE",
            PROGRAM_STOPPED: "PROGRAM_STOPPED",
        };
        this.state = this.states.NOT_READY;
        //program emulation arguments
        this.max_argc_len = 200;
        this.max_argv_len = 200;
        this.max_progname_len = 200;
        this.argc_ptr = 0;
        this.argv_ptr = 0;
        this.progname_ptr = 0;
        this.default_argc = "/program";
        this.default_argv = "";
        //assembler stdout and stderr
        this.assembler_logs = "";
        //assembler diagnostic errors
        this.assembler_errors = [];
        //fake TTY readline
        this.stdin_bytes = [];
        this.setCallbacks(stdinHandler, stdoutHandler, stderrHandler, signalHandler, stateChangeHandler);
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_initEmscripten).call(this, mode);
    }
    setCallbacks(stdinHandler, stdoutHandler, stderrHandler, signalHandler, stateChangeHandler) {
        if (stdinHandler)
            __classPrivateFieldSet(this, _Blink_stdinHandler, stdinHandler, "f");
        if (stdoutHandler)
            __classPrivateFieldSet(this, _Blink_stdoutHandler, stdoutHandler, "f");
        if (stderrHandler)
            __classPrivateFieldSet(this, _Blink_stderrHandler, stderrHandler, "f");
        if (signalHandler)
            __classPrivateFieldSet(this, _Blink_signalHandler, signalHandler, "f");
        if (stateChangeHandler)
            __classPrivateFieldSet(this, _Blink_stateChangeHandler, stateChangeHandler, "f");
        if (!__classPrivateFieldGet(this, _Blink_stdinHandler, "f"))
            __classPrivateFieldSet(this, _Blink_stdinHandler, __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_default_stdinHandler), "f");
        if (!__classPrivateFieldGet(this, _Blink_stdoutHandler, "f"))
            __classPrivateFieldSet(this, _Blink_stdoutHandler, __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_default_stdoutHandler), "f");
        if (!__classPrivateFieldGet(this, _Blink_stderrHandler, "f"))
            __classPrivateFieldSet(this, _Blink_stderrHandler, __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_default_stderrHandler), "f");
        if (!__classPrivateFieldGet(this, _Blink_signalHandler, "f"))
            __classPrivateFieldSet(this, _Blink_signalHandler, __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_default_signalHandler), "f");
        if (!__classPrivateFieldGet(this, _Blink_stateChangeHandler, "f"))
            __classPrivateFieldSet(this, _Blink_stateChangeHandler, __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_default_stateChangeHandler), "f");
    }
    /**
     * Update the assembler mode of this blink instance.
     * The state will be set to NOT_READY, and
     * a new set of compilers will be downloaded.
     */
    async setMode(mode) {
        this.mode = mode;
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.NOT_READY);
        this.assembler_logs = "";
        this.assembler_errors = [];
        //download assembler
        const downloadedElf = await __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_fetchBinaryFile).call(this, mode.binaries.assembler.fileurl);
        const data = new Uint8Array(downloadedElf);
        const FS = this.Module.FS;
        const stream = FS.open("/assembler", "w+");
        FS.write(stream, data, 0, data.length, 0);
        FS.close(stream);
        FS.chmod("/assembler", 0o777);
        //download linker, if required by this mode
        if (mode.binaries.linker) {
            const downloadedElf = await __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_fetchBinaryFile).call(this, this.mode.binaries.linker.fileurl);
            const data = new Uint8Array(downloadedElf);
            const FS = this.Module.FS;
            const stream = FS.open("/linker", "w+");
            FS.write(stream, data, 0, data.length, 0);
            FS.close(stream);
            FS.chmod("/linker", 0o777);
        }
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.READY);
    }
    /**
     * save the program to the Virtual File System
     * set the emulation arguments
     * optionally start the program
     */
    loadElf(elfArrayBytes) {
        if (this.state === this.states.NOT_READY) {
            return false;
        }
        const data = new Uint8Array(elfArrayBytes);
        const FS = this.Module.FS;
        const stream = FS.open("/program", "w+");
        FS.write(stream, data, 0, data.length, 0);
        FS.close(stream);
        FS.chmod("/program", 0o777);
        this.starti();
    }
    /**
     * Launch a multi stage process where:
     * - the assembly asmString is written to a file in the virtual FS.
     * - an assembler is emulated in blink
     * - a linker is emulated in blink
     * The state of this operation is kept via this.state.
     * If successful, it will be possible to launch the compiled program
     * via this.starti(), or this.run()
     */
    loadASM(asmString) {
        if (this.state === this.states.NOT_READY) {
            return false;
        }
        this.assembler_logs = "";
        this.assembler_errors = [];
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.ASSEMBLING);
        const FS = this.Module.FS;
        FS.writeFile("/assembly.s", asmString);
        //this hack ensures that the function is called after a browser render pass
        requestAnimationFrame(() => {
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setEmulationArgs).call(this, "/assembler", this.mode.binaries.assembler.commands, "");
            this.Module._blinkenlib_run_fast();
        });
    }
    loadASM_assembler_exit_callback(code) {
        if (code !== 0) {
            console.log("blink: assembler failed");
            if (this.mode.diagnosticsParser) {
                console.log("blink: assembler diagnostics parsed");
                this.assembler_errors = this.mode.diagnosticsParser(this.assembler_logs);
                console.log(this.assembler_logs);
                console.log(this.assembler_errors);
            }
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.READY);
            return;
        }
        if (!this.mode.binaries.linker) {
            //the current assembler directly generates an ELF without a linker
            const FS = this.Module.FS;
            FS.chmod("/program", 0o777);
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_LOADED);
            this.starti();
        }
        else {
            //we need a separate linking step
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.LINKING);
            //this hack ensures that the function is called after a browser render pass
            requestAnimationFrame(() => {
                __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setEmulationArgs).call(this, "/linker", this.mode.binaries.linker.commands, "");
                this.Module._blinkenlib_run_fast();
            });
        }
    }
    loadASM_linker_exit_callback(code) {
        if (code !== 0) {
            console.log("linker failed");
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.READY);
            return;
        }
        const FS = this.Module.FS;
        FS.chmod("/program", 0o777);
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_LOADED);
        this.starti();
    }
    /**
     * start the program normally and execute it until
     * a breakpoint or end.
     */
    run() {
        try {
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_RUNNING);
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setEmulationArgs).call(this, "/program", this.default_argc, this.default_argv);
            this.Module._blinkenlib_run();
        }
        catch (e) {
            this.stopReason = { loadFail: true, exitCode: 0, details: "invalid ELF" };
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_STOPPED);
        }
    }
    /**
     * start the program and stop at the beginning of the
     * main function.
     */
    start() {
        try {
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setEmulationArgs).call(this, "/program", this.default_argc, this.default_argv);
            this.Module._blinkenlib_start();
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_RUNNING);
        }
        catch (e) {
            this.stopReason = { loadFail: true, exitCode: 0, details: "invalid ELF" };
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_STOPPED);
        }
    }
    /**
     * start the program and stop at the very first
     * instruction (before main)
     */
    starti() {
        try {
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setEmulationArgs).call(this, "/program", this.default_argc, this.default_argv);
            this.Module._blinkenlib_starti();
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_RUNNING);
        }
        catch (e) {
            this.stopReason = { loadFail: true, exitCode: 0, details: "invalid ELF" };
            __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_STOPPED);
        }
    }
    readLineEnter(line) {
        //Note: validation should be handled on the UI side,
        //e.g.: if user enters an emoji, a message shoul appear
        //explaining the implications of that - multiple bytes,
        //utf-8 encoding, need to manually handle that in the
        //assembly side, etc.
        //Note: the bytes are stored in reverse order.
        //the stdin handler will pop bytes from this array.
        this.stdin_bytes = Array.from(new TextEncoder().encode(line)).reverse();
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_RUNNING);
        this.Module._blinkenlib_faketty_resume();
    }
    stepi() {
        this.Module._blinkenlib_stepi();
    }
    continue() {
        this.Module._blinkenlib_continue();
    }
    setready() {
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.READY);
    }
}
export { Blink };
_Blink_stdinHandler = new WeakMap(), _Blink_stdoutHandler = new WeakMap(), _Blink_stderrHandler = new WeakMap(), _Blink_signalHandler = new WeakMap(), _Blink_stateChangeHandler = new WeakMap(), _Blink_instances = new WeakSet(), _Blink_initEmscripten = async function _Blink_initEmscripten(mode) {
    this.mode = mode;
    this.Module = this.Module = await blinkenlib({
        noInitialRun: true,
        preRun: (M) => {
            M.FS.init(() => {
                //stdin read
                // TODO: use this when in pipe mode.
                // right now, libblink supports only
                // a fake TTY mode for reading input
                // return this.#stdinHandler()
                // Fake tty mode: return the data that was inserted via 
                // blink.readLineEnter(string)
                if (this.stdin_bytes.length) {
                    return this.stdin_bytes.pop();
                }
                else {
                    return null; //EOF
                }
            }, (charcode) => {
                __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_assembler_logcollector).call(this, charcode);
                __classPrivateFieldGet(this, _Blink_stdoutHandler, "f").call(this, charcode);
            }, (charcode) => {
                __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_assembler_logcollector).call(this, charcode);
                __classPrivateFieldGet(this, _Blink_stderrHandler, "f").call(this, charcode);
            });
            M.FS.createPreloadedFile("/", "assembler", mode.binaries.assembler.fileurl, true, true);
            if (mode.binaries.linker) {
                M.FS.createPreloadedFile("/", "linker", mode.binaries.linker.fileurl, true, true);
            }
        },
    });
    //dynamically register the javascript callbacks for the wasm code
    const signal_callback = __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_extern_c__signal_callback).bind(this);
    const signal_callback_llvm_signature = "vii";
    const fp_1 = this.Module.addFunction(signal_callback, signal_callback_llvm_signature);
    const exit_callback = __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_extern_c__exit_callback).bind(this);
    const exit_callback_llvm_signature = "vi";
    const fp_2 = this.Module.addFunction(exit_callback, exit_callback_llvm_signature);
    this.Module.callMain([
        fp_1.toString() /* signal_callback */,
        fp_2.toString() /* exit_callback */,
    ]);
    //init memory
    this.memory = this.Module.wasmExports.memory;
    //initialize the cross language struct
    const cls_pointer = this.Module._blinkenlib_get_clstruct();
    this.m = new M_CLStruct(this.memory, cls_pointer);
    //initialize the program emulation arguments
    this.argc_ptr = this.Module._blinkenlib_get_argc_string();
    this.argv_ptr = this.Module._blinkenlib_get_argv_string();
    this.progname_ptr = this.Module._blinkenlib_get_progname_string();
    __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.READY);
}, _Blink_assembler_logcollector = function _Blink_assembler_logcollector(charcode) {
    if (this.state === this.states.ASSEMBLING) {
        this.assembler_logs += String.fromCharCode(charcode);
    }
}, _Blink_setState = function _Blink_setState(state) {
    if (this.state === state) {
        return;
    }
    console.log(`blink: ${state}`);
    __classPrivateFieldGet(this, _Blink_stateChangeHandler, "f").call(this, state, this.state);
    this.state = state;
}, _Blink_extern_c__signal_callback = function _Blink_extern_c__signal_callback(sig, code) {
    // signals != SIGTRAP ---> program exit
    if (sig !== signals.SIGTRAP) {
        const exitCode = 128 + sig;
        let details = `Program terminated with Exit(${exitCode}) Due to signal ${sig}`;
        if (Object.prototype.hasOwnProperty.call(signals_info, sig)) {
            const sigString = signals_info[sig].name;
            const sigDescr = signals_info[sig].description;
            details = `Program terminated with Exit(${exitCode}) due to signal ${sigString}: ${sigDescr}`;
        }
        this.stopReason = {
            loadFail: false,
            exitCode: exitCode,
            details: details,
        };
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_STOPPED);
        __classPrivateFieldGet(this, _Blink_signalHandler, "f").call(this, sig, code);
        return;
    }
    // fake SIGTRAP. it actually indicates preemption.
    // The emulator paused to free the js event loop.
    if (code === sigtrap_codes.BLINK_PREEMPT) {
        console.log("preempt");
        requestAnimationFrame(() => {
            this.Module._blinkenlib_preempt_resume();
        });
    }
    // fake SIGTRAP: it actually indicates a tty line read.
    // Emulator paused on a read syscall, waiting for 
    // the user to enter one line on the fake js tty.
    else if (code === sigtrap_codes.BLINK_FAKE_TTY) {
        __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_READLINE_PAUSE);
        __classPrivateFieldGet(this, _Blink_signalHandler, "f").call(this, sig, code);
    }
    // an actual SIGTRAP
    else {
        __classPrivateFieldGet(this, _Blink_signalHandler, "f").call(this, sig, code);
    }
}, _Blink_extern_c__exit_callback = function _Blink_extern_c__exit_callback(code) {
    //Handle separately the return codes tha are generated from the
    //assembler or linker running in the emulator, and not
    //from a regular program
    if (this.state === this.states.ASSEMBLING) {
        this.loadASM_assembler_exit_callback(code);
        return;
    }
    if (this.state === this.states.LINKING) {
        this.loadASM_linker_exit_callback(code);
        return;
    }
    this.stopReason = {
        loadFail: false,
        exitCode: code,
        details: `program terminated with Exit(${code})`,
    };
    __classPrivateFieldGet(this, _Blink_instances, "m", _Blink_setState).call(this, this.states.PROGRAM_STOPPED);
    console.log("exit callback called");
}, _Blink_setEmulationArgs = function _Blink_setEmulationArgs(progname, argc, argv) {
    this.m.writeStringToHeap(this.progname_ptr, progname, this.max_progname_len);
    this.m.writeStringToHeap(this.argc_ptr, argc, this.max_argc_len);
    this.m.writeStringToHeap(this.argv_ptr, argv, this.max_argv_len);
}, _Blink_fetchBinaryFile = async function _Blink_fetchBinaryFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return arrayBuffer;
    }
    catch (error) {
        console.error("Failed to fetch binary file:", error);
    }
}, _Blink_default_signalHandler = function _Blink_default_signalHandler(sig, code) {
    console.log(`received signal: ${sig} code: ${code}`);
}, _Blink_default_stdinHandler = function _Blink_default_stdinHandler() {
    console.log("stdin requested, EOF returned");
    return null; //EOF
}, _Blink_default_stdoutHandler = function _Blink_default_stdoutHandler(charcode) {
    console.log(`stdout: ${String.fromCharCode(charcode)}`);
}, _Blink_default_stderrHandler = function _Blink_default_stderrHandler(charcode) {
    console.log(`stderr: ${String.fromCharCode(charcode)}`);
}, _Blink_default_stateChangeHandler = function _Blink_default_stateChangeHandler(state, oldState) {
    console.log(`state change: ${oldState} -> ${state}`);
};
