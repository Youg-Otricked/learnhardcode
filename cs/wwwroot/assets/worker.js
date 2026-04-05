import { n as e, r as t, t as n } from "./shared.js";

"undefined" == typeof window &&
  ((self.window = self),
  (self.document = {
    baseURI: location.href,
    childNodes: [],
    documentElement: { style: { setProperty() {} } },
    addEventListener() {},
    createElement: () => ({}),
    createElementNS: () => ({}),
    hasChildNodes: () => !1,
    querySelector: () => null,
  }),
  (self.history = {}),
  (self.Element = function () {}),
  (self.Node = function () {}));
var a = [],
  s = [];
function o(e) {
  return e instanceof Array
    ? (a.forEach((e) => e.dispose()),
      (a = []),
      e.map((e) => {
        const { actions: t, ...n } = e;
        return {
          ...n,
          actions: e.actions.map(
            (e) => (a.push(e.action), { title: e.title, action: a.length - 1 }),
          ),
        };
      }))
    : [];
}
function i() {
  return {
    "System.Runtime": "System.Runtime.k6ze2203p2.wasm",
    "System.Console": "System.Console.x9at0eh4vs.wasm",
    "System.Private.CoreLib": "System.Private.CoreLib.8h8z078oeb.wasm",
    "Microsoft.CSharp": "Microsoft.CSharp.452y5fjxmv.wasm",
    "System.Linq": "System.Linq.rp2jklkmsi.wasm",
    "System.Net.Http": "System.Net.Http.9rl4gopayw.wasm",
    "System.Net.Primitives": "System.Net.Primitives.whs5oed1wm.wasm",
    "System.Private.Uri": "System.Private.Uri.clehp4avpy.wasm",
    "System.Text.Json": "System.Text.Json.2alhj4y3bm.wasm",
    "System.Text.RegularExpressions": "System.Text.RegularExpressions.h1qtkesphd.wasm",
    "System.ComponentModel.Primitives": "System.ComponentModel.Primitives.u0y5oi3qdg.wasm",
    "Microsoft.VisualBasic.Core": "Microsoft.VisualBasic.Core.re3geseai5.wasm",
    "System.Linq.Expressions": "System.Linq.Expressions.4nat0rber0.wasm",
    "System.Runtime.InteropServices.JavaScript": "System.Runtime.InteropServices.JavaScript.ythr5w8c2e.wasm"
  };
}
var c = new t.default(),
  r = {
    init(e, t) {
      "undefined" == typeof Document &&
        ((document.baseURI = e),
        t && (document.documentElement.style.setProperty = (e, n) => t(e, n)));
    },
    get fingerprinting() {
      return i();
    },
    async startAsync() {
      (await e("../_framework/blazor.webassembly.js"), await Blazor.start());
    },
        initAsync: async (basePath) => {
        const cleanPath = basePath.endsWith('/') ? basePath : basePath + '/';
        const finalMap = {
            "System.Runtime": "System.Runtime.wasm",
            "System.Console": "System.Console.wasm",
            "System.Private.CoreLib": "System.Private.CoreLib.wasm",
            "Microsoft.CSharp": "Microsoft.CSharp.wasm",
            "System.Linq": "System.Linq.wasm",
            "System.Net.Http": "System.Net.Http.wasm",
            "System.Net.Primitives": "System.Net.Primitives.wasm",
            "System.Private.Uri": "System.Private.Uri.wasm",
            "System.Text.Json": "System.Text.Json.wasm",
            "System.Text.RegularExpressions": "System.Text.RegularExpressions.wasm",
            "System.ComponentModel.Primitives": "System.ComponentModel.Primitives.wasm",
            "Microsoft.VisualBasic.Core": "Microsoft.VisualBasic.Core.wasm",
            "System.Linq.Expressions": "System.Linq.Expressions.wasm",
            "System.Runtime.InteropServices.JavaScript": "System.Runtime.InteropServices.JavaScript.wasm"
        };

        console.log("CRITICAL: Initializing compiler at:", cleanPath);
        console.log("CRITICAL: Using Map:", finalMap);
        return await DotNet.invokeMethodAsync(
            "SharpScript",
            "InitAsync",
            cleanPath,
            finalMap
        );
    },
    resetCodeAsync: async (e) =>
      await DotNet.invokeMethodAsync("SharpScript", "ResetCode", e),
    applyChangesAsync: async (e) =>
      await DotNet.invokeMethodAsync("SharpScript", "ApplyChanges", e),
    async processAsync() {
      const { diagnostics: e, ...t } = await DotNet.invokeMethodAsync(
        "SharpScript",
        "ProcessAsync",
      );
      return { ...t, diagnostics: o(e) };
    },
    getAssemblyAsync: async () =>
      await DotNet.invokeMethodAsync("SharpScript", "GetAssemblyAsync"),
    getDiagnosticsAsync: async () =>
      o(await DotNet.invokeMethodAsync("SharpScript", "GetDiagnosticsAsync")),
    async getCompletionsAsync(e) {
      const t = await DotNet.invokeMethodAsync(
        "SharpScript",
        "GetCompletionsAsync",
        e,
      );
      return t instanceof Array
        ? (s.forEach((e) => e.dispose()),
          (s = []),
          t.map((e) => {
            const { self: t, ...n } = e;
            return (s.push(e.self), { ...n, self: s.length - 1 });
          }))
        : [];
    },
    getInfoTipAsync: async (e) =>
      await DotNet.invokeMethodAsync("SharpScript", "GetInfoTipAsync", e),
    getAstAsync: async () =>
      await DotNet.invokeMethodAsync("SharpScript", "GetAstAsync"),
    formatCodeAsync: async () =>
      await DotNet.invokeMethodAsync("SharpScript", "FormatCodeAsync"),
    setCSharpInfoTipLiteAsync: async (e) =>
      await DotNet.invokeMethodAsync("SharpScript", "SetCSharpInfoTipLite", e),
    getCSharpInfoTipLiteAsync: async (e) =>
      await DotNet.invokeMethodAsync(
        "SharpScript",
        "GetCSharpInfoTipLiteAsync",
        e,
      ),
    getLanguageTypesAsync: async () =>
      await c.acquire("inputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetLanguageTypes"),
      ),
    setLanguageTypeAsync: async (e) =>
      await c.acquire("inputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "SetLanguageType", e),
      ),
    getSourceCodeKind: async () =>
      await DotNet.invokeMethodAsync("SharpScript", "GetSourceCodeKind"),
    setSourceCodeKind: async (e) =>
      await DotNet.invokeMethodAsync("SharpScript", "SetSourceCodeKind", e),
    getOutputTypesAsync: async () =>
      await c.acquire("outputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetOutputTypes"),
      ),
    setOutputTypeAsync: async (e) =>
      await c.acquire("outputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "SetOutputType", e),
      ),
    getInputLanguageVersionsAsync: async () =>
      await c.acquire("inputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetInputLanguageVersions"),
      ),
    getInputLanguageVersionAsync: async () =>
      await c.acquire("inputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetInputLanguageVersion"),
      ),
    setInputLanguageVersionAsync: async (e) =>
      await c.acquire("inputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "SetInputLanguageVersion", e),
      ),
    getOutputLanguageVersionsAsync: async () =>
      await c.acquire("outputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetOutputLanguageVersions"),
      ),
    getOutputLanguageVersionAsync: async () =>
      await c.acquire("outputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "GetOutputLanguageVersion"),
      ),
    setOutputLanguageVersionAsync: async (e) =>
      await c.acquire("outputLanguage", () =>
        DotNet.invokeMethodAsync("SharpScript", "SetOutputLanguageVersion", e),
      ),
    invokeMethodAsync: async (e, t, ...n) =>
      await DotNet.invokeMethodAsync(e, t, ...n),
    async diagnosticInvokeAsync(e) {
      const t = a[e];
      if (t) return await t.invokeMethodAsync("InvokeAsync");
    },
    async completionGetDescriptionAsync(e) {
      const t = s[e];
      if (t) return await t.invokeMethodAsync("GetDescriptionAsync");
    },
    async completionGetChangeAsync(e) {
      const t = s[e];
      if (t) return await t.invokeMethodAsync("GetChangeAsync");
    },
    async getAssemblyLinkAsync() {
      const e = await this.getAssemblyAsync();
      if (e) {
        const t = new File(
          [await e.arrayBuffer()],
          "SharpScript.Playground.zip",
        );
        return URL.createObjectURL(t);
      }
    },
  };
"undefined" != typeof WorkerGlobalScope &&
  self instanceof WorkerGlobalScope &&
  n.expose(r);
export { r as dotnet };
//# sourceMappingURL=worker.js.map
