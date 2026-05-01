import http.server
import socketserver

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        super().end_headers()
    def guess_type(self, path):
        if path.endswith(".mjs"):
            return "text/javascript"
        if path.endswith(".js"):
            return "text/javascript"
        return super().guess_type(path)

PORT = 8000
with socketserver.TCPServer(("", PORT), CORSHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()