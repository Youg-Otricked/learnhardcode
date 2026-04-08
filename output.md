### File: ./rust/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello, Rust!",
  "description": "Welcome to Rust! Rust is a fast, safe systems programming language.\nIn this course, you will be working for the fictional os company, **_Oxideworks labs_ on their new project, _Verdigris OS_**.\nYou will understand the code below soon, but for now, complete the assignemnt\n\n### Assignment:\nReplace the text in the println! macro with \"Hello, Welcome to Verdigris!\"",
  "starterCode": "fn main() {\n    println!(\"Hello!\");\n}\n",
  "expectedOutput": "Hello, Welcome to Verdigris!\n",
  "nextLesson": "lesson2.json",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./QuantumC/lessons-qc/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello, Quantum C!",
  "description": "Welcome to **Quantum C**.\n\nIn this course, you will be making a custom quantum computer simulator, called `TechQ`. This course will teach you eveything about QuantumC, but for now:\n\n### Assignment:\nChange the text in the `std::qout` statement to print to console \"Starting VM\". Ignore the << '\\n' bit",
  "starterCode": "int main() {\n    std::qout << \"HELLO!\" << '\\n';\n    return 0;\n}\n",
  "expectedOutput": "Starting VM\n",
  "mustContain": "",
  "nextLesson": "lesson2.json",
  "previous": null,
  "showButtons": false,
  "correct": "",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "runHarness": "",
  "submitHarness": "",
  "solution": "",
  "hint": "Just change the string between `std::qout << ` and ` << '\\n'` so it matches exactly.",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./zig/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello, Rust!",
  "description": "Welcome to Rust! Rust is a fast, safe systems programming language.\nIn this course, you will be working for the fictional os company, **_Oxideworks labs_ on their new project, _Verdigris OS_**.\nYou will understand the code below soon, but for now, complete the assignemnt\n\n### Assignment:\nReplace the text in the println! macro with \"Hello, Welcome to Verdigris!\"",
  "starterCode": "fn main() {\n    println!(\"Hello!\");\n}\n",
  "expectedOutput": "Hello, Welcome to Verdigris!\n",
  "nextLesson": "lesson2.json",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./asm/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to LHINX",
    "description": "## Welcome to LHINX Kernel Development\nYou just got hired to work on the **LHINX** kernel. Your first task is simple - change the boot message.\n\nDon't worry about understanding the code yet. Just change the text between the quotes to say `LHINX booted!` exactly.\n\n---\nChange the message and hit Run.",
    "starterCode": "section .data\n    msg db \"Hello, World!\", 10\n    len equ $ - msg\n\nsection .text\n    global _start\n\n_start:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, len\n    syscall\n\n    mov rax, 60\n    xor rdi, rdi\n    syscall",
    "expectedOutput": "LHINX booted!",
    "nextLesson": "lesson2.json",
    "previous": null,
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
### File: ./go/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to GopherCloud",
    "description": "## Welcome to GopherCloud!\nYou just got hired as a backend engineer at **GopherCloud**, the fastest growing cloud infrastructure company in the world.\n\nYour first task is simple - fix the startup message that prints when the server boots.\n\n---\n\nChange the code so it prints `GopherCloud server is running!` exactly.",
    "starterCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"TODO: fix me\")\n}",
    "expectedOutput": "GopherCloud server is running!\n",
    "nextLesson": "lesson2.json",
    "previous": null,
    "showButtons": false,
    "correct": "",
    "b1t": "",
    "b2t": "",
    "b3t": "",
    "b4t": "",
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
### File: ./web/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to Googol!",
    "description": "## NOTE:\nThis course has a prerequisit! You must have completed the **_Learn TypeScript_** course before starting. If you haven't, then do it [Here!](https://youg-otricked.github.io/learnhardcode/TS/ts.html), but otherwise, let's get onto the course!\n---\n# Welcome\nYou just got hired  at **Googol**, The hottest new search engine.\n\nWe are making a basic test 200 code page: replace 404: Not Found with 200: OK\n\n---\n\nChange the code so it says 200: OK instead of 404: Not Found.\n---\nYou can press the buttons at the top to change to different files, but for this lesson, don't edit anything but index.html. After running code, re-click a file to go back to the editor.",
    "starterTS": "// We'll get to TS soon.",
    "starterCss": "body {\n    background-color: #000000;\n    color: #ffffff;\n} /* You will understand this soon, don't worry. */",
    "starterHtml": "<!DOCTYPE html>\n<html>\n<head>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n    <h1 id=\"title\">404: Not Found</h1>\n</body>\n</html>",
    "reqElems": [
        {
            "type": "element", 
            "label": "h1",
            "value": "200: OK"
        }
    ],
    "nextLesson": "lesson2.json",
    "previous": null,
    "showButtons": false,
    "correct": "",
    "b1t": "",
    "b2t": "",
    "b3t": "",
    "b4t": "",
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
### File: ./gprog/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello, Quantum C!",
  "description": "Welcome to **Quantum C**.\n\nIn this course, you will be making a custom quantum computer simulator, called `TechQ`. This course will teach you eveything about QuantumC, but for now:\n\n### Assignment:\nChange the text in the `std::qout` statement to print to console \"Starting VM\". Ignore the << '\\n' bit",
  "starterCode": "int main() {\n    std::qout << \"HELLO!\" << '\\n';\n    return 0;\n}\n",
  "expectedOutput": "Starting VM\n",
  "mustContain": "",
  "nextLesson": "lesson2.json",
  "previous": null,
  "showButtons": false,
  "correct": "",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "runHarness": "",
  "submitHarness": "",
  "solution": "",
  "hint": "Just change the string between `std::qout << ` and ` << '\\n'` so it matches exactly.",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./cs/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello C#",
  "description": "## In this course, you will be learning C# for a fictional company, **Aurora Anvil Studios** on their latest flagship game, Chronoshard.\nSoon, you will understand everything the code below does. For now, just do what the assingment says\n\n# Assignment:\n#### The Chronoshard team needs a welcome message. replace the //Text goes here so it says \"Opening Chronoshard!\"",
  "starterCode": "using System;\n\nnamespace Chronoshard\n{\n    class Boot\n    {\n        public static int Main()\n        {\n            Console.WriteLine(\"//Text goes here\");\n            return 0;\n        }\n    }\n}",
  "expectedOutput": "Opening Chronoshard!\n",
  "nextLesson": "lesson2.json?v=1",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "hint": "Line 9",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./cpp/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Hello World",
  "description": "C++ is one of the most famous programing languages, and for good reason. It is one of tha fastest languages, with manual memory managment, OOP, static typing and so much more. In the next few lessons, you will understand what the following code does, but for now, fix the  code to output 'Hello, World!' exactly.",
  "starterCode": "#include <iostream>\n\nint main() {\n    std::cout << \"World, Hello.\" << '\\n';\n    return 0;\n}\n",
  "expectedOutput": "Hello, World!\n",
  "nextLesson": "lesson2.json?v=7",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./TS/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to MeTube",
    "description": "## Welcome to MeTube!\nYou just got hired as a backend developer at **MeTube**, the world's hottest video platform.\n\nYour first task is simple - fix the welcome message that displays when the server starts.\n\n---\n\nChange the code so it prints `MeTube server is running!` exactly.",
    "starterCode": "const serverMessage: string = \"TODO: fix me\";\nconsole.log(serverMessage);",
    "expectedOutput": "MeTube server is running!\n",
    "nextLesson": "lesson2.json",
    "previous": null,
    "showButtons": false,
    "correct": "",
    "b1t": "",
    "b2t": "",
    "b3t": "",
    "b4t": "",
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
### File: ./c/lessons/lesson1.json
{
  "id": "lesson1.json",
  "title": "Welcome to MacroHard",
  "description": "In this course, you will learn C from scratch all the way to building your own garbage collector.\nYou are a developer at the totally-not-real company _MacroHard_, working on their latest operating system:\n**Bidirectional Interface Network Data Observation System 12 (BINDOS)**\n---\n## Assignment:\nJust make the code output _exactly_ \"Welcome to BINDOS\"",
  "hint": "Change the text inside the `printf` statement.",
  "starterCode": "#include <stdio.h>\n\nint main() {\n    printf(\"Welcome to <wait i dont want to get copyrighted>\");\n    return 0;\n}\n",
  "expectedOutput": "Welcome to BINDOS\n",
  "nextLesson": "lesson2.json",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./sql/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to BWS",
    "description": "## Welcome to BWS!\nYou just got hired as a database administrator at **BWS (Better Web Services)**, the world's totally-not-a-knockoff cloud platform.\n\nYour first task is simple - query the system status table to make sure everything is online.\n\n---\n\nWrite a query to SELECT everything from the `system_status` table.",
    "setupCode": "CREATE TABLE system_status (service TEXT, status TEXT, uptime INT); INSERT INTO system_status VALUES ('database', 'online', 99); INSERT INTO system_status VALUES ('storage', 'online', 97); INSERT INTO system_status VALUES ('compute', 'on fire', 0);",
    "starterCode": "SELECT * FROM -- table_name_here;\n",
    "expectedOutput": "service | status | uptime\ndatabase | online | 99\nstorage | online | 97\ncompute | on fire | 0",
    "nextLesson": "lesson2.json",
    "previous": null,
    "showButtons": false,
    "correct": "",
    "b1t": "",
    "b2t": "",
    "b3t": "",
    "b4t": "",
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
### File: ./learnlinux/learnlinux/lesson1.json
{
  "id": "lesson1.json",
  "title": "Setup",
  "description": "## Welcome to learn Linux!\nIn this course, you will be taught from the basics, all the way up to actualy setting up local development. In this course, you will be working for a ficticious banking company, \"City bank\"\n---\nNow, to use linux, first you need to have it. If you already are using Linux, or MacOS, no need to do this step, but if you are on Windows, you need to get somthing called _**Windows Subsystem for Linux (WSL)**_. This program allows you to use a linux shell on Windows!\n---\n### Installing WSL:\nSimply, open a administrator powershell, then run `wsl --install`. Be ready as it will take a while. After, restart your computer. After it is instaled, you may run WSL by just searching WSL, and clicking on it to open it. To make sure you have the right distro, run `cat /etc/os-release` and make sure it says Ubuntu.\n---\nNow that you have linux, you need to install the LearnHardCode CLI. This is how you will submit lessons to the course. To get the CLI, just run `curl -L https://github.com/Youg-Otricked/learnhardcode-cli_and_cli-courses/releases/latest/download/lhc -o lhc && chmod +x lhc`, then run `./lhc setup <chosen username>`, then just `source ~/.bashrc`\n\n---\nThen, just run\n```\nlhc help\n```\nIf you see a list of commands, run `lhc upgrade`. Now you're ready!\n---\nPress the submit button to continue",
  "starterCode": " ",
  "expectedOutput": " ",
  "nextLesson": "lesson2.json?v=7",
  "previous": null,
  "showButtons": false,
  "correct": "nobns",
  "b1t": "",
  "b2t": "",
  "b3t": "",
  "b4t": "",
  "runHarness": "",
  "mode": "text",
  "difficulty": "easiest",
  "xp": "10"
}
---
### File: ./haskell/lessons/lesson1.json
{
    "id": "lesson1.json",
    "title": "Welcome to Pear!",
    "description": "## Welcome to Pear!\nYou just got hired  at **Pear**, the only other tech company that can release the same product 18 times and get away with it! You will be working on the pPhone 18, our flagship model\n\nRight now, you just need to make the phone's boot screen print the right message.\n\n---\n\nChange the code so it prints `Welcome to POS 209` exactly.",
    "starterCode": "main :: IO ()\nmain = putStrLn \"Hello, Haskell!\"",
    "expectedOutput": "Welcome to POS 209\n",
    "nextLesson": "lesson2.json",
    "previous": null,
    "showButtons": false,
    "correct": "",
    "b1t": "",
    "b2t": "",
    "b3t": "",
    "b4t": "",
    "mode": "editor",
    "difficulty": "easiest",
    "xp": "10"
}
---
