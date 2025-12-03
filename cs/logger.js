(function () {
    const old = console.log;
    const output = document.getElementById('output-text');
    const system = document.getElementById('log-system');
    const arrow = "> ";
    
    console.logConsole = function logConsole(args) { old.apply(console, arguments) }
    
    console.log = function (message) {
        if (typeof message == 'object') {
            const text = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />'
            
            if(text.startsWith('dbg:')){
                system.innerHTML += arrow + text.substring(5, text.length);
            }else{
                output.innerHTML += arrow + text;
            }
        } else {
            if (message.toString().startsWith('dbg:')){
                system.innerHTML += arrow + message.substring(5, message.length) + '<br />';
            }else{
                if (message.toString().startsWith('err:')){
                    const inner = arrow + message.substring(5, message.length) + '<br />';
                    output.innerHTML += `<span style="color: var(--error)">${inner}</span>`;
                }else{
                    const inner = arrow + message + '<br />';
                    output.innerHTML += inner;
                }  
            }
        }
        old.apply(console, arguments);
    }
})();