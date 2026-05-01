import http.server
import socketserver
import os
class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache') 
        
        super().end_headers()

    def guess_type(self, path):
        if path.endswith(".mjs") or path.endswith(".js"):
            return "text/javascript"
        if path.endswith(".wasm"):
            return "application/wasm"
        return super().guess_type(path)

PORT = 8000
class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True

with ThreadingTCPServer(("", PORT), CORSHandler) as httpd:
    print(f"🚀 Quantum C Server active on port {PORT}")
    print(f"Root directory: {os.getcwd()}")
    httpd.serve_forever()