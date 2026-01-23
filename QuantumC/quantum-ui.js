let QuantumModule = null;
let editor = null;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });
monaco.languages.register({ id: 'qc' });

monaco.languages.setMonarchTokensProvider('qc', {
  tokenizer: {
    root: [
      // Comments
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],

      // Preprocessor
      [/^\s*#\s*include/, { token: 'keyword.control.preprocessor', next: '@include' }],
      [/^\s*#\s*(error|warning|define|undef|ifdef|ifndef|endif|pragma)\b/, 'keyword.control.preprocessor'],

      // Keywords & Constants
      [/\b(qif|qelse|qelif|qswitch|if|else|while|for|return|break|continue|switch|case|default|namespace|fn)\b/, 'keyword'],
      [/\b(const|static|public|private|protected|long|short|final)\b/, 'storage.modifier'],
      [/\b(true|false|null|nullptr|none|both)\b/, 'constant.language'],

      // Types
      [/\b(int|float|double|qbool|void|bool|string|char|dict|map|list|enum|struct|class|type|auto)\b/, 'storage.type'],
      [/\b[A-Z][a-zA-Z0-9_]*\b/, 'entity.name.type'],
      [/\b[a-zA-Z_][a-zA-Z0-9_]*(?=::)/, 'entity.name.namespace'],

      // Functions and Members
      [/\b[a-zA-Z_][a-zA-Z0-9_]*\s*(?=\()/, 'entity.name.function'],
      [/(?<=\.|->)[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.other.member'],

      // Strings and Characters
      [/"/, 'string', '@string'],
      [/'([^'\\\\]|\\.)'/, 'string.quoted.single'],

      // Numbers
      [/\b(0x[0-9a-fA-F]+|0b[01]+|[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?f?)\b/, 'number'],

      // Operators
      [/(\+\+|--|\+|\-|\*\*|\*| \/|%|==|!=|<=|>=|<|>|&&&|&&|\|\|\||\|\||!!|!|=|\+=|\-=|\*=|\/=|&|\||\^|<<|>>)/, 'operator'],
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/"/, 'string', '@pop'],
      [/\\./, 'string.escape']
    ],

    include: [
      [/[ \t]+/, ''],
      [/<[^>]+>/, 'string.include'],
      [/[a-zA-Z_][a-zA-Z0-9_]*/, 'entity.name.namespace'],
      [/,/, 'punctuation.separator'],
      [/$/, '', '@pop'],
    ],
  },
});
monaco.editor.defineTheme('qcTheme', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'storage.type', foreground: '569CD6' },
    { token: 'entity.name.function', foreground: 'DCDCAA' },
    { token: 'operator', foreground: 'D4D4D4' },
    // Add more mappings here
  ],
  colors: {}
});
monaco.editor.setTheme('qcTheme');

require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `int main() {
    println("Hello from Quantum C!");
    
    int x = 5;
    int y = 3;
    println(f"Answer: {x + y}");
    
    return 0;
}`,
        language: 'qc',  
        theme: 'qcTheme',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
        document.getElementById('run').click();
    });
    
    console.log('Monaco Editor initialized');
});

QuantumC().then(function(module) {
    QuantumModule = module;
    document.getElementById('output').innerText = 'Ready! Press Ctrl+Enter or click "Run Code".';
    console.log('Quantum C WASM loaded successfully');
}).catch(function(err) {
    document.getElementById('output').innerText = 'Error loading WASM: ' + err;
    console.error('Failed to load Quantum C:', err);
});

document.getElementById('run').addEventListener('click', function() {
    if (!QuantumModule) {
        alert('WASM module still loading... please wait');
        return;
    }
    
    if (!editor) {
        alert('Editor still loading... please wait');
        return;
    }
    
    const code = editor.getValue();
    const outputEl = document.getElementById('output');
    
    outputEl.innerText = 'Running...\n';
    outputEl.className = '';
    
    try {
        const result = QuantumModule.ccall(
            'run_quantum_code',
            'string',
            ['string'],
            [code]
        );
        
        outputEl.innerText = result || '(no output)';
        
        if (result.includes('Error') || result.includes('error')) {
            outputEl.className = 'error';
        } else {
            outputEl.className = 'success';
        }
    } catch (err) {
        outputEl.innerText = 'Runtime Error: ' + err.message;
        outputEl.className = 'error';
    }
});

document.getElementById('clear-output').addEventListener('click', function() {
    document.getElementById('output').innerText = '';
    document.getElementById('output').className = '';
});

const examples = [
    {
        name: "Hello World",
        code: `int main() {
    println("Hello, World!");
    return 0;
}`
    },
    {
        name: "Lambda",
        code: `int main() {
    auto add = fn(int x, int y) {
        return x + y;
    };
    
    println(add(5, 3));
    return 0;
}`
    },
    {
        name: "Multi-Return",
        code: `int, string get_user() {
    return 123, "Alice";
}

int main() {
    int id, string name = get_user();
    println(f"User: {name}, ID: {id}");
    return 0;
}`
    },
    {
        name: "F-Strings",
        code: `int main() {
    string name = "World";
    int x = 42;
    
    println(f"Hello, {name}!");
    println(f"The answer is {x}");
    
    return 0;
}`
    },
    {
    name: "Quantum Boolean",
    code: `int main() {
        qbool q = both;
        
        qif (q) {
            println("q was true this time");
        } qelse {
            println("q was false this time");
        }
        
        return 0;
    }`
    },
    {
    name: "Union Types",
    code: `type Number = int | float | double;

    Number max(Number a, Number b) {
        if (a > b) return a;
        return b;
    }

    int main() {
        Number x = 3;
        Number y = 4.5;
        println(max(x, y));
        return 0;
    }`
    },
    {
    name: "Class with init",
    code: `class Point {
        int x;
        int y;
        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
        void init() {
            this.x = 10;
            this.y = 20;
        }
    }

    int main() {
        Point p;        // default init calls p.init()
        println(f"({p.x}, {p.y})");
        return 0;
    }`
    },
    {
        name: "Lists and foreach",
        code: `int main() {
            list<int> nums = [1, 2, 3, 4, 5];
            
            foreach (int n in nums) {
                if (n % 2 == 0) {
                    println(f"{n} is even");
                }
            }
            
            return 0;
        }`
    },
    {
        name: "Including from standered lib and advanced QBool",
        code: `
        namespace Exported {
            #include <AdvQBool, ./stdlib.qc>
        }

        int main() {
            AdvQBool::AQB q = AdvQBool::AQB(70);

            println("Rolling quantum truth 5 times:");
            int i = 0;
            while (i < 5) {
                if (q) {
                    println("q was true");
                } else {
                    println("q was false");
                }
                i = i + 1;
            }

            println(q.repr());
            return 0;
        }`
    },
    {
        name: "Multi include from stdlib",
        code: `
        namespace Exported {
            #include <Math,    ./stdlib.qc>
            #include <Utils,   ./stdlib.qc>
        }
        int main() {
            Math::Number a = 3;
            Math::Number b = 4.5;

            println(f"max = {Math::max(a, b)}");

            int[] r = Utils::range(0, 10, 2);
            int i = 0;
            while (i < r.length) {
                print(f"{r[i]} ");
                i = i + 1;
            }
            println("");

            return 0;
        }`
    }
];

let exampleIndex = 0;

document.getElementById('load-example').addEventListener('click', function() {
    if (!editor) return;
    
    editor.setValue(examples[exampleIndex].code);
    
    const outputEl = document.getElementById('output');
    outputEl.innerText = `Loaded: ${examples[exampleIndex].name}\n\nClick "Run Code" to execute!`;
    outputEl.className = '';
    
    exampleIndex = (exampleIndex + 1) % examples.length;
});

console.log('Quantum C Playground loaded');
console.log('Shortcuts: Ctrl+Enter to run code');
