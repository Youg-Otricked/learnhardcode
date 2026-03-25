package main

import (
    "bytes"
    "fmt"
    "syscall/js"
    "github.com/traefik/yaegi/interp"
    "github.com/traefik/yaegi/stdlib"
)

var interpreter *interp.Interpreter
var outputBuf bytes.Buffer

func main() {
    c := make(chan struct{}, 0)
    
    global := js.Global()
    if global.Get("window").IsUndefined() {
        global.Set("window", global)
    }
    
    interpreter = interp.New(interp.Options{
        Stdout: &outputBuf,
        Stderr: &outputBuf,
    })
    interpreter.Use(stdlib.Symbols)
    
    global.Get("window").Set("yaegi", map[string]interface{}{
        "eval":  js.FuncOf(evalGo),
        "reset": js.FuncOf(resetInterpreter),
    })
    
    <-c
}

func evalGo(this js.Value, args []js.Value) interface{} {
    if len(args) != 1 {
        return map[string]interface{}{
            "success": false,
            "error":   "eval requires exactly one argument",
        }
    }
    
    outputBuf.Reset()
    sourceCode := args[0].String()
    
    var evalError error
    func() {
        defer func() {
            if r := recover(); r != nil {
                evalError = fmt.Errorf("panic: %v", r)
            }
        }()
        _, evalError = interpreter.Eval(sourceCode)
    }()
    
    output := outputBuf.String()
    
    if evalError != nil {
        return map[string]interface{}{
            "success": false,
            "error":   evalError.Error(),
            "output":  output,
        }
    }
    
    return map[string]interface{}{
        "success": true,
        "output":  output,
    }
}

func resetInterpreter(this js.Value, args []js.Value) interface{} {
    outputBuf.Reset()
    interpreter = interp.New(interp.Options{
        Stdout: &outputBuf,
        Stderr: &outputBuf,
    })
    interpreter.Use(stdlib.Symbols)
    return map[string]interface{}{"success": true}
}