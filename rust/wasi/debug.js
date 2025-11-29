class Debug {
    constructor(isEnabled) {
        this.isEnabled = isEnabled;
        this.prefix = "wasi:";
        this.log = createLogger(isEnabled, this.prefix);
    }
    // Recreate the logger function with the new enabled state.
    enable(enabled) {
        this.log = createLogger(enabled === undefined ? true : enabled, this.prefix);
    }
    // Getter for the private isEnabled property.
    get enabled() {
        return this.isEnabled;
    }
}
// The createLogger() creates either an empty function or a bound console.log
// function so we can retain accurate line lumbers on Debug.log() calls.
function createLogger(enabled, prefix) {
    if (enabled) {
        const a = console.log.bind(console, "%c%s", "color: #265BA0", prefix);
        return a;
    }
    else {
        return () => { };
    }
}
export const debug = new Debug(false);
