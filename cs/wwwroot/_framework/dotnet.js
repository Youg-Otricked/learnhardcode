//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var e = !1;
const t = async () =>
    WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 8, 1, 6,
        0, 6, 64, 25, 11, 11,
      ]),
    ),
  o = async () =>
    WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 15,
        1, 13, 0, 65, 1, 253, 15, 65, 2, 253, 15, 253, 128, 2, 11,
      ]),
    ),
  n = async () =>
    WebAssembly.validate(
      new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
        1, 8, 0, 65, 0, 253, 15, 253, 98, 11,
      ]),
    ),
  r = Symbol.for("wasm promise_control");
function i(e, t) {
  let o = null;
  const n = new Promise(function (n, r) {
    o = {
      isDone: !1,
      promise: null,
      resolve: (t) => {
        o.isDone || ((o.isDone = !0), n(t), e && e());
      },
      reject: (e) => {
        o.isDone || ((o.isDone = !0), r(e), t && t());
      },
    };
  });
  o.promise = n;
  const i = n;
  return ((i[r] = o), { promise: i, promise_control: o });
}
function s(e) {
  return e[r];
}
function a(e) {
  (e &&
    (function (e) {
      return void 0 !== e[r];
    })(e)) ||
    Be(!1, "Promise is not controllable");
}
const l = "__mono_message__",
  c = ["debug", "log", "trace", "warn", "info", "error"],
  d = "MONO_WASM: ";
let u, f, m, g, p, h;
function w(e) {
  g = e;
}
function b(e) {
  if (Pe.diagnosticTracing) {
    const t = "function" == typeof e ? e() : e;
    console.debug(d + t);
  }
}
function y(e, ...t) {
  console.info(d + e, ...t);
}
function v(e, ...t) {
  console.info(e, ...t);
}
function E(e, ...t) {
  console.warn(d + e, ...t);
}
function _(e, ...t) {
  if (t && t.length > 0 && t[0] && "object" == typeof t[0]) {
    if (t[0].silent) return;
    if (t[0].toString) return void console.error(d + e, t[0].toString());
  }
  console.error(d + e, ...t);
}
function x(e, t, o) {
  return function (...n) {
    try {
      let r = n[0];
      if (void 0 === r) r = "undefined";
      else if (null === r) r = "null";
      else if ("function" == typeof r) r = r.toString();
      else if ("string" != typeof r)
        try {
          r = JSON.stringify(r);
        } catch (e) {
          r = r.toString();
        }
      t(
        o
          ? JSON.stringify({ method: e, payload: r, arguments: n.slice(1) })
          : [e + r, ...n.slice(1)],
      );
    } catch (e) {
      m.error(`proxyConsole failed: ${e}`);
    }
  };
}
function j(e, t, o) {
  ((f = t), (g = e), (m = { ...t }));
  const n = `${o}/console`
    .replace("https://", "wss://")
    .replace("http://", "ws://");
  ((u = new WebSocket(n)),
    u.addEventListener("error", A),
    u.addEventListener("close", S),
    (function () {
      for (const e of c) f[e] = x(`console.${e}`, T, !0);
    })());
}
function R(e) {
  let t = 30;
  const o = () => {
    u
      ? 0 == u.bufferedAmount || 0 == t
        ? (e && v(e),
          (function () {
            for (const e of c) f[e] = x(`console.${e}`, m.log, !1);
          })(),
          u.removeEventListener("error", A),
          u.removeEventListener("close", S),
          u.close(1e3, e),
          (u = void 0))
        : (t--, globalThis.setTimeout(o, 100))
      : e && m && m.log(e);
  };
  o();
}
function T(e) {
  u && u.readyState === WebSocket.OPEN ? u.send(e) : m.log(e);
}
function A(e) {
  m.error(`[${g}] proxy console websocket error: ${e}`, e);
}
function S(e) {
  m.debug(`[${g}] proxy console websocket closed: ${e}`, e);
}
function D() {
  Pe.preferredIcuAsset = O(Pe.config);
  let e = "invariant" == Pe.config.globalizationMode;
  if (!e)
    if (Pe.preferredIcuAsset)
      Pe.diagnosticTracing &&
        b("ICU data archive(s) available, disabling invariant mode");
    else {
      if (
        "custom" === Pe.config.globalizationMode ||
        "all" === Pe.config.globalizationMode ||
        "sharded" === Pe.config.globalizationMode
      ) {
        const e =
          "invariant globalization mode is inactive and no ICU data archives are available";
        throw (_(`ERROR: ${e}`), new Error(e));
      }
      (Pe.diagnosticTracing &&
        b(
          "ICU data archive(s) not available, using invariant globalization mode",
        ),
        (e = !0),
        (Pe.preferredIcuAsset = null));
    }
  const t = "DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",
    o = Pe.config.environmentVariables;
  if ((void 0 === o[t] && e && (o[t] = "1"), void 0 === o.TZ))
    try {
      const e = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
      e && (o.TZ = e);
    } catch (e) {
      y("failed to detect timezone, will fallback to UTC");
    }
}
function O(e) {
  var t;
  if (
    (null === (t = e.resources) || void 0 === t ? void 0 : t.icu) &&
    "invariant" != e.globalizationMode
  ) {
    const t =
        e.applicationCulture ||
        (ke
          ? globalThis.navigator &&
            globalThis.navigator.languages &&
            globalThis.navigator.languages[0]
          : Intl.DateTimeFormat().resolvedOptions().locale),
      o = e.resources.icu;
    let n = null;
    if ("custom" === e.globalizationMode) {
      if (o.length >= 1) return o[0].name;
    } else
      t && "all" !== e.globalizationMode
        ? "sharded" === e.globalizationMode &&
          (n = (function (e) {
            const t = e.split("-")[0];
            return "en" === t ||
              [
                "fr",
                "fr-FR",
                "it",
                "it-IT",
                "de",
                "de-DE",
                "es",
                "es-ES",
              ].includes(e)
              ? "icudt_EFIGS.dat"
              : ["zh", "ko", "ja"].includes(t)
                ? "icudt_CJK.dat"
                : "icudt_no_CJK.dat";
          })(t))
        : (n = "icudt.dat");
    if (n)
      for (let e = 0; e < o.length; e++) {
        const t = o[e];
        if (t.virtualPath === n) return t.name;
      }
  }
  return ((e.globalizationMode = "invariant"), null);
}
new Date().valueOf();
const C = class {
  constructor(e) {
    this.url = e;
  }
  toString() {
    return this.url;
  }
};
async function k(e, t) {
  try {
    const o = "function" == typeof globalThis.fetch;
    if (Se) {
      const n = e.startsWith("file://");
      if (!n && o)
        return globalThis.fetch(e, t || { credentials: "same-origin" });
      (p || ((h = Ne.require("url")), (p = Ne.require("fs"))),
        n && (e = h.fileURLToPath(e)));
      const r = await p.promises.readFile(e);
      return {
        ok: !0,
        headers: { length: 0, get: () => null },
        url: e,
        arrayBuffer: () => r,
        json: () => JSON.parse(r),
        text: () => {
          throw new Error("NotImplementedException");
        },
      };
    }
    if (o) return globalThis.fetch(e, t || { credentials: "same-origin" });
    if ("function" == typeof read)
      return {
        ok: !0,
        url: e,
        headers: { length: 0, get: () => null },
        arrayBuffer: () => new Uint8Array(read(e, "binary")),
        json: () => JSON.parse(read(e, "utf8")),
        text: () => read(e, "utf8"),
      };
  } catch (t) {
    return {
      ok: !1,
      url: e,
      status: 500,
      headers: { length: 0, get: () => null },
      statusText: "ERR28: " + t,
      arrayBuffer: () => {
        throw t;
      },
      json: () => {
        throw t;
      },
      text: () => {
        throw t;
      },
    };
  }
  throw new Error("No fetch implementation available");
}
function I(e) {
  return (
    "string" != typeof e && Be(!1, "url must be a string"),
    !M(e) &&
      0 !== e.indexOf("./") &&
      0 !== e.indexOf("../") &&
      globalThis.URL &&
      globalThis.document &&
      globalThis.document.baseURI &&
      (e = new URL(e, globalThis.document.baseURI).toString()),
    e
  );
}
const U = /^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,
  P = /[a-zA-Z]:[\\/]/;
function M(e) {
  return Se || Ie
    ? e.startsWith("/") ||
        e.startsWith("\\") ||
        -1 !== e.indexOf("///") ||
        P.test(e)
    : U.test(e);
}
let L,
  N = 0;
const $ = [],
  z = [],
  W = new Map(),
  F = {
    "js-module-threads": !0,
    "js-module-runtime": !0,
    "js-module-dotnet": !0,
    "js-module-native": !0,
    "js-module-diagnostics": !0,
  },
  B = { ...F, "js-module-library-initializer": !0 },
  V = { ...F, dotnetwasm: !0, heap: !0, manifest: !0 },
  q = { ...B, manifest: !0 },
  H = { ...B, dotnetwasm: !0 },
  J = { dotnetwasm: !0, symbols: !0 },
  Z = { ...B, dotnetwasm: !0, symbols: !0 },
  Q = { symbols: !0 };
function G(e) {
  return !("icu" == e.behavior && e.name != Pe.preferredIcuAsset);
}
function K(e, t, o) {
  (null != t || (t = []),
    Be(1 == t.length, `Expect to have one ${o} asset in resources`));
  const n = t[0];
  return ((n.behavior = o), X(n), e.push(n), n);
}
function X(e) {
  V[e.behavior] && W.set(e.behavior, e);
}
function Y(e) {
  Be(V[e], `Unknown single asset behavior ${e}`);
  const t = W.get(e);
  if (t && !t.resolvedUrl)
    if (((t.resolvedUrl = Pe.locateFile(t.name)), F[t.behavior])) {
      const e = ge(t);
      e
        ? ("string" != typeof e &&
            Be(
              !1,
              "loadBootResource response for 'dotnetjs' type should be a URL string",
            ),
          (t.resolvedUrl = e))
        : (t.resolvedUrl = ce(t.resolvedUrl, t.behavior));
    } else if ("dotnetwasm" !== t.behavior)
      throw new Error(`Unknown single asset behavior ${e}`);
  return t;
}
function ee(e) {
  const t = Y(e);
  return (Be(t, `Single asset for ${e} not found`), t);
}
let te = !1;
async function oe() {
  if (!te) {
    ((te = !0), Pe.diagnosticTracing && b("mono_download_assets"));
    try {
      const e = [],
        t = [],
        o = (e, t) => {
          (!Z[e.behavior] && G(e) && Pe.expected_instantiated_assets_count++,
            !H[e.behavior] &&
              G(e) &&
              (Pe.expected_downloaded_assets_count++, t.push(se(e))));
        };
      for (const t of $) o(t, e);
      for (const e of z) o(e, t);
      (Pe.allDownloadsQueued.promise_control.resolve(),
        Promise.all([...e, ...t])
          .then(() => {
            Pe.allDownloadsFinished.promise_control.resolve();
          })
          .catch((e) => {
            throw (Pe.err("Error in mono_download_assets: " + e), Xe(1, e), e);
          }),
        await Pe.runtimeModuleLoaded.promise);
      const n = async (e) => {
          const t = await e;
          if (t.buffer) {
            if (!Z[t.behavior]) {
              ((t.buffer && "object" == typeof t.buffer) ||
                Be(
                  !1,
                  "asset buffer must be array-like or buffer-like or promise of these",
                ),
                "string" != typeof t.resolvedUrl &&
                  Be(!1, "resolvedUrl must be string"));
              const e = t.resolvedUrl,
                o = await t.buffer,
                n = new Uint8Array(o);
              (pe(t),
                await Ue.beforeOnRuntimeInitialized.promise,
                Ue.instantiate_asset(t, e, n));
            }
          } else
            J[t.behavior]
              ? ("symbols" === t.behavior &&
                  (await Ue.instantiate_symbols_asset(t), pe(t)),
                J[t.behavior] && ++Pe.actual_downloaded_assets_count)
              : (t.isOptional ||
                  Be(!1, "Expected asset to have the downloaded buffer"),
                !H[t.behavior] && G(t) && Pe.expected_downloaded_assets_count--,
                !Z[t.behavior] &&
                  G(t) &&
                  Pe.expected_instantiated_assets_count--);
        },
        r = [],
        i = [];
      for (const t of e) r.push(n(t));
      for (const e of t) i.push(n(e));
      (Promise.all(r)
        .then(() => {
          Ce || Ue.coreAssetsInMemory.promise_control.resolve();
        })
        .catch((e) => {
          throw (Pe.err("Error in mono_download_assets: " + e), Xe(1, e), e);
        }),
        Promise.all(i)
          .then(async () => {
            Ce ||
              (await Ue.coreAssetsInMemory.promise,
              Ue.allAssetsInMemory.promise_control.resolve());
          })
          .catch((e) => {
            throw (Pe.err("Error in mono_download_assets: " + e), Xe(1, e), e);
          }));
    } catch (e) {
      throw (Pe.err("Error in mono_download_assets: " + e), e);
    }
  }
}
let ne = !1;
function re() {
  if (ne) return;
  ne = !0;
  const e = Pe.config,
    t = [];
  if (e.assets)
    for (const t of e.assets)
      ("object" != typeof t &&
        Be(!1, `asset must be object, it was ${typeof t} : ${t}`),
        "string" != typeof t.behavior &&
          Be(!1, "asset behavior must be known string"),
        "string" != typeof t.name && Be(!1, "asset name must be string"),
        t.resolvedUrl &&
          "string" != typeof t.resolvedUrl &&
          Be(!1, "asset resolvedUrl could be string"),
        t.hash &&
          "string" != typeof t.hash &&
          Be(!1, "asset resolvedUrl could be string"),
        t.pendingDownload &&
          "object" != typeof t.pendingDownload &&
          Be(!1, "asset pendingDownload could be object"),
        t.isCore ? $.push(t) : z.push(t),
        X(t));
  else if (e.resources) {
    const o = e.resources;
    (o.wasmNative || Be(!1, "resources.wasmNative must be defined"),
      o.jsModuleNative || Be(!1, "resources.jsModuleNative must be defined"),
      o.jsModuleRuntime || Be(!1, "resources.jsModuleRuntime must be defined"),
      K(z, o.wasmNative, "dotnetwasm"),
      K(t, o.jsModuleNative, "js-module-native"),
      K(t, o.jsModuleRuntime, "js-module-runtime"),
      o.jsModuleDiagnostics &&
        K(t, o.jsModuleDiagnostics, "js-module-diagnostics"));
    const n = (e, t, o) => {
      const n = e;
      ((n.behavior = t), o ? ((n.isCore = !0), $.push(n)) : z.push(n));
    };
    if (o.coreAssembly)
      for (let e = 0; e < o.coreAssembly.length; e++)
        n(o.coreAssembly[e], "assembly", !0);
    if (o.assembly)
      for (let e = 0; e < o.assembly.length; e++)
        n(o.assembly[e], "assembly", !o.coreAssembly);
    if (0 != e.debugLevel && Pe.isDebuggingSupported()) {
      if (o.corePdb)
        for (let e = 0; e < o.corePdb.length; e++) n(o.corePdb[e], "pdb", !0);
      if (o.pdb)
        for (let e = 0; e < o.pdb.length; e++) n(o.pdb[e], "pdb", !o.corePdb);
    }
    if (e.loadAllSatelliteResources && o.satelliteResources)
      for (const e in o.satelliteResources)
        for (let t = 0; t < o.satelliteResources[e].length; t++) {
          const r = o.satelliteResources[e][t];
          ((r.culture = e), n(r, "resource", !o.coreAssembly));
        }
    if (o.coreVfs)
      for (let e = 0; e < o.coreVfs.length; e++) n(o.coreVfs[e], "vfs", !0);
    if (o.vfs)
      for (let e = 0; e < o.vfs.length; e++) n(o.vfs[e], "vfs", !o.coreVfs);
    const r = O(e);
    if (r && o.icu)
      for (let e = 0; e < o.icu.length; e++) {
        const t = o.icu[e];
        t.name === r && n(t, "icu", !1);
      }
    if (o.wasmSymbols)
      for (let e = 0; e < o.wasmSymbols.length; e++)
        n(o.wasmSymbols[e], "symbols", !1);
  }
  if (e.appsettings)
    for (let t = 0; t < e.appsettings.length; t++) {
      const o = e.appsettings[t],
        n = he(o);
      ("appsettings.json" !== n &&
        n !== `appsettings.${e.applicationEnvironment}.json`) ||
        z.push({
          name: o,
          behavior: "vfs",
          cache: "no-cache",
          useCredentials: !0,
        });
    }
  e.assets = [...$, ...z, ...t];
}
async function ie(e) {
  const t = await se(e);
  return (await t.pendingDownloadInternal.response, t.buffer);
}
async function se(e) {
  try {
    return await ae(e);
  } catch (t) {
    if (!Pe.enableDownloadRetry) throw t;
    if (Ie || Se) throw t;
    if (e.pendingDownload && e.pendingDownloadInternal == e.pendingDownload)
      throw t;
    if (e.resolvedUrl && -1 != e.resolvedUrl.indexOf("file://")) throw t;
    if (t && 404 == t.status) throw t;
    ((e.pendingDownloadInternal = void 0), await Pe.allDownloadsQueued.promise);
    try {
      return (
        Pe.diagnosticTracing && b(`Retrying download '${e.name}'`),
        await ae(e)
      );
    } catch (t) {
      return (
        (e.pendingDownloadInternal = void 0),
        await new Promise((e) => globalThis.setTimeout(e, 100)),
        Pe.diagnosticTracing &&
          b(`Retrying download (2) '${e.name}' after delay`),
        await ae(e)
      );
    }
  }
}
async function ae(e) {
  for (; L; ) await L.promise;
  try {
    (++N,
      N == Pe.maxParallelDownloads &&
        (Pe.diagnosticTracing && b("Throttling further parallel downloads"),
        (L = i())));
    const t = await (async function (e) {
      if (
        (e.pendingDownload && (e.pendingDownloadInternal = e.pendingDownload),
        e.pendingDownloadInternal && e.pendingDownloadInternal.response)
      )
        return e.pendingDownloadInternal.response;
      if (e.buffer) {
        const t = await e.buffer;
        return (
          e.resolvedUrl || (e.resolvedUrl = "undefined://" + e.name),
          (e.pendingDownloadInternal = {
            url: e.resolvedUrl,
            name: e.name,
            response: Promise.resolve({
              ok: !0,
              arrayBuffer: () => t,
              json: () => JSON.parse(new TextDecoder("utf-8").decode(t)),
              text: () => {
                throw new Error("NotImplementedException");
              },
              headers: { get: () => {} },
            }),
          }),
          e.pendingDownloadInternal.response
        );
      }
      const t =
        e.loadRemote && Pe.config.remoteSources
          ? Pe.config.remoteSources
          : [""];
      let o;
      for (let n of t) {
        ((n = n.trim()), "./" === n && (n = ""));
        const t = le(e, n);
        e.name === t
          ? Pe.diagnosticTracing && b(`Attempting to download '${t}'`)
          : Pe.diagnosticTracing &&
            b(`Attempting to download '${t}' for ${e.name}`);
        try {
          e.resolvedUrl = t;
          const n = fe(e);
          if (
            ((e.pendingDownloadInternal = n),
            (o = await n.response),
            !o || !o.ok)
          )
            continue;
          return o;
        } catch (e) {
          o || (o = { ok: !1, url: t, status: 0, statusText: "" + e });
          continue;
        }
      }
      const n =
        e.isOptional ||
        (e.name.match(/\.pdb$/) && Pe.config.ignorePdbLoadErrors);
      if ((o || Be(!1, `Response undefined ${e.name}`), !n)) {
        const t = new Error(
          `download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`,
        );
        throw ((t.status = o.status), t);
      }
      y(
        `optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`,
      );
    })(e);
    return t
      ? (J[e.behavior] ||
          ((e.buffer = await t.arrayBuffer()),
          ++Pe.actual_downloaded_assets_count),
        e)
      : e;
  } finally {
    if ((--N, L && N == Pe.maxParallelDownloads - 1)) {
      Pe.diagnosticTracing && b("Resuming more parallel downloads");
      const e = L;
      ((L = void 0), e.promise_control.resolve());
    }
  }
}
function le(e, t) {
  let o;
  return (
    null == t && Be(!1, `sourcePrefix must be provided for ${e.name}`),
    e.resolvedUrl
      ? (o = e.resolvedUrl)
      : ((o =
          "" === t
            ? "assembly" === e.behavior || "pdb" === e.behavior
              ? e.name
              : "resource" === e.behavior && e.culture && "" !== e.culture
                ? `${e.culture}/${e.name}`
                : e.name
            : t + e.name),
        (o = ce(Pe.locateFile(o), e.behavior))),
    (o && "string" == typeof o) ||
      Be(!1, "attemptUrl need to be path or url string"),
    o
  );
}
function ce(e, t) {
  return (Pe.modulesUniqueQuery && q[t] && (e += Pe.modulesUniqueQuery), e);
}
let de = 0;
const ue = new Set();
function fe(e) {
  try {
    e.resolvedUrl || Be(!1, "Request's resolvedUrl must be set");
    const t = (function (e) {
        let t = e.resolvedUrl;
        if (Pe.loadBootResource) {
          const o = ge(e);
          if (o instanceof Promise) return o;
          "string" == typeof o && (t = o);
        }
        const o = {};
        return (
          e.cache
            ? (o.cache = e.cache)
            : Pe.config.disableNoCacheFetch || (o.cache = "no-cache"),
          e.useCredentials
            ? (o.credentials = "include")
            : !Pe.config.disableIntegrityCheck &&
              e.hash &&
              (o.integrity = e.hash),
          Pe.fetch_like(t, o)
        );
      })(e),
      o = { name: e.name, url: e.resolvedUrl, response: t };
    return (
      ue.add(e.name),
      o.response.then(() => {
        ("assembly" == e.behavior && Pe.loadedAssemblies.push(e.name),
          de++,
          Pe.onDownloadResourceProgress &&
            Pe.onDownloadResourceProgress(de, ue.size));
      }),
      o
    );
  } catch (t) {
    const o = {
      ok: !1,
      url: e.resolvedUrl,
      status: 500,
      statusText: "ERR29: " + t,
      arrayBuffer: () => {
        throw t;
      },
      json: () => {
        throw t;
      },
    };
    return { name: e.name, url: e.resolvedUrl, response: Promise.resolve(o) };
  }
}
const me = {
  resource: "assembly",
  assembly: "assembly",
  pdb: "pdb",
  icu: "globalization",
  vfs: "configuration",
  manifest: "manifest",
  dotnetwasm: "dotnetwasm",
  "js-module-dotnet": "dotnetjs",
  "js-module-native": "dotnetjs",
  "js-module-runtime": "dotnetjs",
  "js-module-threads": "dotnetjs",
};
function ge(e) {
  var t;
  if (Pe.loadBootResource) {
    const o = null !== (t = e.hash) && void 0 !== t ? t : "",
      n = e.resolvedUrl,
      r = me[e.behavior];
    if (r) {
      const t = Pe.loadBootResource(r, e.name, n, o, e.behavior);
      return "string" == typeof t ? I(t) : t;
    }
  }
}
function pe(e) {
  ((e.pendingDownloadInternal = null),
    (e.pendingDownload = null),
    (e.buffer = null),
    (e.moduleExports = null));
}
function he(e) {
  let t = e.lastIndexOf("/");
  return (t >= 0 && t++, e.substring(t));
}
async function we(e) {
  e &&
    (await Promise.all(
      (null != e ? e : []).map((e) =>
        (async function (e) {
          try {
            const t = e.name;
            if (!e.moduleExports) {
              const o = ce(Pe.locateFile(t), "js-module-library-initializer");
              (Pe.diagnosticTracing &&
                b(`Attempting to import '${o}' for ${e}`),
                (e.moduleExports = await import(/*! webpackIgnore: true */ o)));
            }
            Pe.libraryInitializers.push({
              scriptName: t,
              exports: e.moduleExports,
            });
          } catch (t) {
            E(`Failed to import library initializer '${e}': ${t}`);
          }
        })(e),
      ),
    ));
}
async function be(e, t) {
  if (!Pe.libraryInitializers) return;
  const o = [];
  for (let n = 0; n < Pe.libraryInitializers.length; n++) {
    const r = Pe.libraryInitializers[n];
    r.exports[e] && o.push(ye(r.scriptName, e, () => r.exports[e](...t)));
  }
  await Promise.all(o);
}
async function ye(e, t, o) {
  try {
    await o();
  } catch (o) {
    throw (
      E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),
      Xe(1, o),
      o
    );
  }
}
function ve(e, t) {
  if (e === t) return e;
  const o = { ...t };
  return (
    void 0 !== o.assets &&
      o.assets !== e.assets &&
      (o.assets = [...(e.assets || []), ...(o.assets || [])]),
    void 0 !== o.resources &&
      (o.resources = _e(
        e.resources || {
          assembly: [],
          jsModuleNative: [],
          jsModuleRuntime: [],
          wasmNative: [],
        },
        o.resources,
      )),
    void 0 !== o.environmentVariables &&
      (o.environmentVariables = {
        ...(e.environmentVariables || {}),
        ...(o.environmentVariables || {}),
      }),
    void 0 !== o.runtimeOptions &&
      o.runtimeOptions !== e.runtimeOptions &&
      (o.runtimeOptions = [
        ...(e.runtimeOptions || []),
        ...(o.runtimeOptions || []),
      ]),
    Object.assign(e, o)
  );
}
function Ee(e, t) {
  if (e === t) return e;
  const o = { ...t };
  return (
    o.config &&
      (e.config || (e.config = {}), (o.config = ve(e.config, o.config))),
    Object.assign(e, o)
  );
}
function _e(e, t) {
  if (e === t) return e;
  const o = { ...t };
  return (
    void 0 !== o.coreAssembly &&
      (o.coreAssembly = [...(e.coreAssembly || []), ...(o.coreAssembly || [])]),
    void 0 !== o.assembly &&
      (o.assembly = [...(e.assembly || []), ...(o.assembly || [])]),
    void 0 !== o.lazyAssembly &&
      (o.lazyAssembly = [...(e.lazyAssembly || []), ...(o.lazyAssembly || [])]),
    void 0 !== o.corePdb &&
      (o.corePdb = [...(e.corePdb || []), ...(o.corePdb || [])]),
    void 0 !== o.pdb && (o.pdb = [...(e.pdb || []), ...(o.pdb || [])]),
    void 0 !== o.jsModuleWorker &&
      (o.jsModuleWorker = [
        ...(e.jsModuleWorker || []),
        ...(o.jsModuleWorker || []),
      ]),
    void 0 !== o.jsModuleNative &&
      (o.jsModuleNative = [
        ...(e.jsModuleNative || []),
        ...(o.jsModuleNative || []),
      ]),
    void 0 !== o.jsModuleDiagnostics &&
      (o.jsModuleDiagnostics = [
        ...(e.jsModuleDiagnostics || []),
        ...(o.jsModuleDiagnostics || []),
      ]),
    void 0 !== o.jsModuleRuntime &&
      (o.jsModuleRuntime = [
        ...(e.jsModuleRuntime || []),
        ...(o.jsModuleRuntime || []),
      ]),
    void 0 !== o.wasmSymbols &&
      (o.wasmSymbols = [...(e.wasmSymbols || []), ...(o.wasmSymbols || [])]),
    void 0 !== o.wasmNative &&
      (o.wasmNative = [...(e.wasmNative || []), ...(o.wasmNative || [])]),
    void 0 !== o.icu && (o.icu = [...(e.icu || []), ...(o.icu || [])]),
    void 0 !== o.satelliteResources &&
      (o.satelliteResources = (function (e, t) {
        if (e === t) return e;
        for (const o in t) e[o] = [...(e[o] || []), ...(t[o] || [])];
        return e;
      })(e.satelliteResources || {}, o.satelliteResources || {})),
    void 0 !== o.modulesAfterConfigLoaded &&
      (o.modulesAfterConfigLoaded = [
        ...(e.modulesAfterConfigLoaded || []),
        ...(o.modulesAfterConfigLoaded || []),
      ]),
    void 0 !== o.modulesAfterRuntimeReady &&
      (o.modulesAfterRuntimeReady = [
        ...(e.modulesAfterRuntimeReady || []),
        ...(o.modulesAfterRuntimeReady || []),
      ]),
    void 0 !== o.extensions &&
      (o.extensions = { ...(e.extensions || {}), ...(o.extensions || {}) }),
    void 0 !== o.vfs && (o.vfs = [...(e.vfs || []), ...(o.vfs || [])]),
    Object.assign(e, o)
  );
}
function xe() {
  const e = Pe.config;
  if (
    ((e.environmentVariables = e.environmentVariables || {}),
    (e.runtimeOptions = e.runtimeOptions || []),
    (e.resources = e.resources || {
      assembly: [],
      jsModuleNative: [],
      jsModuleWorker: [],
      jsModuleRuntime: [],
      wasmNative: [],
      vfs: [],
      satelliteResources: {},
    }),
    e.assets)
  ) {
    Pe.diagnosticTracing &&
      b("config.assets is deprecated, use config.resources instead");
    for (const t of e.assets) {
      const o = {};
      switch (t.behavior) {
        case "assembly":
          o.assembly = [t];
          break;
        case "pdb":
          o.pdb = [t];
          break;
        case "resource":
          ((o.satelliteResources = {}),
            (o.satelliteResources[t.culture] = [t]));
          break;
        case "icu":
          o.icu = [t];
          break;
        case "symbols":
          o.wasmSymbols = [t];
          break;
        case "vfs":
          o.vfs = [t];
          break;
        case "dotnetwasm":
          o.wasmNative = [t];
          break;
        case "js-module-threads":
          o.jsModuleWorker = [t];
          break;
        case "js-module-runtime":
          o.jsModuleRuntime = [t];
          break;
        case "js-module-native":
          o.jsModuleNative = [t];
          break;
        case "js-module-diagnostics":
          o.jsModuleDiagnostics = [t];
          break;
        case "js-module-dotnet":
          break;
        default:
          throw new Error(
            `Unexpected behavior ${t.behavior} of asset ${t.name}`,
          );
      }
      _e(e.resources, o);
    }
  }
  (e.debugLevel,
    e.applicationEnvironment || (e.applicationEnvironment = "Production"),
    e.applicationCulture &&
      (e.environmentVariables.LANG = `${e.applicationCulture}.UTF-8`),
    (Ue.diagnosticTracing = Pe.diagnosticTracing = !!e.diagnosticTracing),
    (Ue.waitForDebugger = e.waitForDebugger),
    (Pe.maxParallelDownloads =
      e.maxParallelDownloads || Pe.maxParallelDownloads),
    (Pe.enableDownloadRetry =
      void 0 !== e.enableDownloadRetry
        ? e.enableDownloadRetry
        : Pe.enableDownloadRetry));
}
let je = !1;
async function Re(e) {
  var t;
  if (je) return void (await Pe.afterConfigLoaded.promise);
  let o;
  try {
    if (
      (e.configSrc ||
        (Pe.config &&
          0 !== Object.keys(Pe.config).length &&
          (Pe.config.assets || Pe.config.resources)) ||
        (e.configSrc = "dotnet.boot.js"),
      (o = e.configSrc),
      (je = !0),
      o &&
        (Pe.diagnosticTracing && b("mono_wasm_load_config"),
        await (async function (e) {
          const t = e.configSrc,
            o = Pe.locateFile(t);
          let n = null;
          void 0 !== Pe.loadBootResource &&
            (n = Pe.loadBootResource("manifest", t, o, "", "manifest"));
          let r,
            i = null;
          if (n)
            if ("string" == typeof n)
              n.includes(".json")
                ? ((i = await s(I(n))), (r = await Ae(i)))
                : (r = (await import(I(n))).config);
            else {
              const e = await n;
              "function" == typeof e.json
                ? ((i = e), (r = await Ae(i)))
                : (r = e.config);
            }
          else
            o.includes(".json")
              ? ((i = await s(ce(o, "manifest"))), (r = await Ae(i)))
              : (r = (await import(ce(o, "manifest"))).config);
          function s(e) {
            return Pe.fetch_like(e, {
              method: "GET",
              credentials: "include",
              cache: "no-cache",
            });
          }
          (Pe.config.applicationEnvironment &&
            (r.applicationEnvironment = Pe.config.applicationEnvironment),
            ve(Pe.config, r));
        })(e)),
      xe(),
      await we(
        null === (t = Pe.config.resources) || void 0 === t
          ? void 0
          : t.modulesAfterConfigLoaded,
      ),
      await be("onRuntimeConfigLoaded", [Pe.config]),
      e.onConfigLoaded)
    )
      try {
        (await e.onConfigLoaded(Pe.config, Le), xe());
      } catch (e) {
        throw (_("onConfigLoaded() failed", e), e);
      }
    (xe(), Pe.afterConfigLoaded.promise_control.resolve(Pe.config));
  } catch (t) {
    const n = `Failed to load config file ${o} ${t} ${null == t ? void 0 : t.stack}`;
    throw (
      (Pe.config = e.config =
        Object.assign(Pe.config, { message: n, error: t, isError: !0 })),
      Xe(1, new Error(n)),
      t
    );
  }
}
function Te() {
  return !!globalThis.navigator && (Pe.isChromium || Pe.isFirefox);
}
async function Ae(e) {
  const t = Pe.config,
    o = await e.json();
  (t.applicationEnvironment ||
    o.applicationEnvironment ||
    (o.applicationEnvironment =
      e.headers.get("Blazor-Environment") ||
      e.headers.get("DotNet-Environment") ||
      void 0),
    o.environmentVariables || (o.environmentVariables = {}));
  const n = e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");
  n && (o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES = n);
  const r = e.headers.get("ASPNETCORE-BROWSER-TOOLS");
  return (r && (o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS = r), o);
}
"function" != typeof importScripts ||
  globalThis.onmessage ||
  (globalThis.dotnetSidecar = !0);
const Se =
    "object" == typeof process &&
    "object" == typeof process.versions &&
    "string" == typeof process.versions.node,
  De = "function" == typeof importScripts,
  Oe = De && "undefined" != typeof dotnetSidecar,
  Ce = De && !Oe,
  ke = "object" == typeof window || (De && !Se),
  Ie = !ke && !Se;
let Ue = {},
  Pe = {},
  Me = {},
  Le = {},
  Ne = {},
  $e = !1;
const ze = {},
  We = { config: ze },
  Fe = {
    mono: {},
    binding: {},
    internal: Ne,
    module: We,
    loaderHelpers: Pe,
    runtimeHelpers: Ue,
    diagnosticHelpers: Me,
    api: Le,
  };
function Be(e, t) {
  if (e) return;
  const o = "Assert failed: " + ("function" == typeof t ? t() : t),
    n = new Error(o);
  (_(o, n), Ue.nativeAbort(n));
}
function Ve() {
  return void 0 !== Pe.exitCode;
}
function qe() {
  return Ue.runtimeReady && !Ve();
}
function He() {
  (Ve() &&
    Be(
      !1,
      `.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`,
    ),
    Ue.runtimeReady ||
      Be(
        !1,
        ".NET runtime didn't start yet. Please call dotnet.create() first.",
      ));
}
function Je() {
  ke &&
    (globalThis.addEventListener("unhandledrejection", et),
    globalThis.addEventListener("error", tt));
}
let Ze, Qe;
function Ge(e) {
  (Qe && Qe(e), Xe(e, Pe.exitReason));
}
function Ke(e) {
  (Ze && Ze(e || Pe.exitReason), Xe(1, e || Pe.exitReason));
}
function Xe(t, o) {
  var n, r;
  const i = o && "object" == typeof o;
  t = i && "number" == typeof o.status ? o.status : void 0 === t ? -1 : t;
  const s = i && "string" == typeof o.message ? o.message : "" + o;
  (((o = i
    ? o
    : Ue.ExitStatus
      ? (function (e, t) {
          const o = new Ue.ExitStatus(e);
          return ((o.message = t), (o.toString = () => t), o);
        })(t, s)
      : new Error("Exit with code " + t + " " + s)).status = t),
    o.message || (o.message = s));
  const a = "" + (o.stack || new Error().stack);
  try {
    Object.defineProperty(o, "stack", { get: () => a });
  } catch (e) {}
  const l = !!o.silent;
  if (((o.silent = !0), Ve()))
    Pe.diagnosticTracing && b("mono_exit called after exit");
  else {
    try {
      (We.onAbort == Ke && (We.onAbort = Ze),
        We.onExit == Ge && (We.onExit = Qe),
        ke &&
          (globalThis.removeEventListener("unhandledrejection", et),
          globalThis.removeEventListener("error", tt)),
        Ue.runtimeReady
          ? (Ue.jiterpreter_dump_stats && Ue.jiterpreter_dump_stats(!1),
            0 === t &&
              (null === (n = Pe.config) || void 0 === n
                ? void 0
                : n.interopCleanupOnExit) &&
              Ue.forceDisposeProxies(!0, !0),
            e &&
              0 !== t &&
              (null === (r = Pe.config) ||
                void 0 === r ||
                r.dumpThreadsOnNonZeroExit))
          : (Pe.diagnosticTracing && b(`abort_startup, reason: ${o}`),
            (function (e) {
              (Pe.allDownloadsQueued.promise_control.reject(e),
                Pe.allDownloadsFinished.promise_control.reject(e),
                Pe.afterConfigLoaded.promise_control.reject(e),
                Pe.wasmCompilePromise.promise_control.reject(e),
                Pe.runtimeModuleLoaded.promise_control.reject(e),
                Ue.dotnetReady &&
                  (Ue.dotnetReady.promise_control.reject(e),
                  Ue.afterInstantiateWasm.promise_control.reject(e),
                  Ue.beforePreInit.promise_control.reject(e),
                  Ue.afterPreInit.promise_control.reject(e),
                  Ue.afterPreRun.promise_control.reject(e),
                  Ue.beforeOnRuntimeInitialized.promise_control.reject(e),
                  Ue.afterOnRuntimeInitialized.promise_control.reject(e),
                  Ue.afterPostRun.promise_control.reject(e)));
            })(o)));
    } catch (e) {
      E("mono_exit A failed", e);
    }
    try {
      l ||
        ((function (e, t) {
          if (0 !== e && t) {
            const e = Ue.ExitStatus && t instanceof Ue.ExitStatus ? b : _;
            "string" == typeof t
              ? e(t)
              : (void 0 === t.stack && (t.stack = new Error().stack + ""),
                t.message
                  ? e(
                      Ue.stringify_as_error_with_stack
                        ? Ue.stringify_as_error_with_stack(
                            t.message + "\n" + t.stack,
                          )
                        : t.message + "\n" + t.stack,
                    )
                  : e(JSON.stringify(t)));
          }
          !Ce &&
            Pe.config &&
            (Pe.config.logExitCode
              ? Pe.config.forwardConsoleLogsToWS
                ? R("WASM EXIT " + e)
                : v("WASM EXIT " + e)
              : Pe.config.forwardConsoleLogsToWS && R());
        })(t, o),
        (function (e) {
          if (
            ke &&
            !Ce &&
            Pe.config &&
            Pe.config.appendElementOnExit &&
            document
          ) {
            const t = document.createElement("label");
            ((t.id = "tests_done"),
              0 !== e && (t.style.background = "red"),
              (t.innerHTML = "" + e),
              document.body.appendChild(t));
          }
        })(t));
    } catch (e) {
      E("mono_exit B failed", e);
    }
    ((Pe.exitCode = t),
      Pe.exitReason || (Pe.exitReason = o),
      !Ce && Ue.runtimeReady && We.runtimeKeepalivePop());
  }
  if (Pe.config && Pe.config.asyncFlushOnExit && 0 === t)
    throw (
      (async () => {
        try {
          await (async function () {
            try {
              const e = await import(/*! webpackIgnore: true */ "process"),
                t = (e) =>
                  new Promise((t, o) => {
                    (e.on("error", o), e.end("", "utf8", t));
                  }),
                o = t(e.stderr),
                n = t(e.stdout);
              let r;
              const i = new Promise((e) => {
                r = setTimeout(() => e("timeout"), 1e3);
              });
              (await Promise.race([Promise.all([n, o]), i]), clearTimeout(r));
            } catch (e) {
              _(`flushing std* streams failed: ${e}`);
            }
          })();
        } finally {
          Ye(t, o);
        }
      })(),
      o
    );
  Ye(t, o);
}
function Ye(e, t) {
  if (Ue.runtimeReady && Ue.nativeExit)
    try {
      Ue.nativeExit(e);
    } catch (e) {
      !Ue.ExitStatus ||
        e instanceof Ue.ExitStatus ||
        E("set_exit_code_and_quit_now failed: " + e.toString());
    }
  if (0 !== e || !ke)
    throw (Se && Ne.process ? Ne.process.exit(e) : Ue.quit && Ue.quit(e, t), t);
}
function et(e) {
  ot(e, e.reason, "rejection");
}
function tt(e) {
  ot(e, e.error, "error");
}
function ot(e, t, o) {
  e.preventDefault();
  try {
    (t || (t = new Error("Unhandled " + o)),
      void 0 === t.stack && (t.stack = new Error().stack),
      (t.stack = t.stack + ""),
      t.silent || (_("Unhandled error:", t), Xe(1, t)));
  } catch (e) {}
}
!(function (e) {
  if ($e) throw new Error("Loader module already loaded");
  (($e = !0),
    (Ue = e.runtimeHelpers),
    (Pe = e.loaderHelpers),
    (Me = e.diagnosticHelpers),
    (Le = e.api),
    (Ne = e.internal),
    Object.assign(Le, { INTERNAL: Ne, invokeLibraryInitializers: be }),
    Object.assign(e.module, { config: ve(ze, { environmentVariables: {} }) }));
  const r = {
      mono_wasm_bindings_is_ready: !1,
      config: e.module.config,
      diagnosticTracing: !1,
      nativeAbort: (e) => {
        throw e || new Error("abort");
      },
      nativeExit: (e) => {
        throw new Error("exit:" + e);
      },
    },
    l = {
      gitHash: "a612c2a1056fe3265387ae3ff7c94eba1505caf9",
      config: e.module.config,
      diagnosticTracing: !1,
      maxParallelDownloads: 16,
      enableDownloadRetry: !0,
      _loaded_files: [],
      loadedFiles: [],
      loadedAssemblies: [],
      libraryInitializers: [],
      workerNextNumber: 1,
      actual_downloaded_assets_count: 0,
      actual_instantiated_assets_count: 0,
      expected_downloaded_assets_count: 0,
      expected_instantiated_assets_count: 0,
      afterConfigLoaded: i(),
      allDownloadsQueued: i(),
      allDownloadsFinished: i(),
      wasmCompilePromise: i(),
      runtimeModuleLoaded: i(),
      loadingWorkers: i(),
      is_exited: Ve,
      is_runtime_running: qe,
      assert_runtime_running: He,
      mono_exit: Xe,
      createPromiseController: i,
      getPromiseController: s,
      assertIsControllablePromise: a,
      mono_download_assets: oe,
      resolve_single_asset_path: ee,
      setup_proxy_console: j,
      set_thread_prefix: w,
      installUnhandledErrorHandler: Je,
      retrieve_asset_download: ie,
      invokeLibraryInitializers: be,
      isDebuggingSupported: Te,
      exceptions: t,
      simd: n,
      relaxedSimd: o,
    };
  (Object.assign(Ue, r), Object.assign(Pe, l));
})(Fe);
let nt,
  rt,
  it,
  st = !1,
  at = !1;
async function lt(e) {
  if (!at) {
    if (
      ((at = !0),
      ke &&
        Pe.config.forwardConsoleLogsToWS &&
        void 0 !== globalThis.WebSocket &&
        j("main", globalThis.console, globalThis.location.origin),
      We || Be(!1, "Null moduleConfig"),
      Pe.config || Be(!1, "Null moduleConfig.config"),
      "function" == typeof e)
    ) {
      const t = e(Fe.api);
      if (t.ready) throw new Error("Module.ready couldn't be redefined.");
      (Object.assign(We, t), Ee(We, t));
    } else {
      if ("object" != typeof e)
        throw new Error(
          "Can't use moduleFactory callback of createDotnetRuntime function.",
        );
      Ee(We, e);
    }
    await (async function (e) {
      if (Se) {
        const e = await import(/*! webpackIgnore: true */ "process"),
          t = 14;
        if (e.versions.node.split(".")[0] < t)
          throw new Error(
            `NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`,
          );
      }
      const t = /*! webpackIgnore: true */ import.meta.url,
        o = t.indexOf("?");
      var n;
      if (
        (o > 0 && (Pe.modulesUniqueQuery = t.substring(o)),
        (Pe.scriptUrl = t.replace(/\\/g, "/").replace(/[?#].*/, "")),
        (Pe.scriptDirectory =
          (n = Pe.scriptUrl).slice(0, n.lastIndexOf("/")) + "/"),
        (Pe.locateFile = (e) =>
          "URL" in globalThis && globalThis.URL !== C
            ? new URL(e, Pe.scriptDirectory).toString()
            : M(e)
              ? e
              : Pe.scriptDirectory + e),
        (Pe.fetch_like = k),
        (Pe.out = console.log),
        (Pe.err = console.error),
        (Pe.onDownloadResourceProgress = e.onDownloadResourceProgress),
        ke && globalThis.navigator)
      ) {
        const e = globalThis.navigator,
          t = e.userAgentData && e.userAgentData.brands;
        t && t.length > 0
          ? (Pe.isChromium = t.some(
              (e) =>
                "Google Chrome" === e.brand ||
                "Microsoft Edge" === e.brand ||
                "Chromium" === e.brand,
            ))
          : e.userAgent &&
            ((Pe.isChromium = e.userAgent.includes("Chrome")),
            (Pe.isFirefox = e.userAgent.includes("Firefox")));
      }
      ((Ne.require = Se
        ? await import(/*! webpackIgnore: true */ "module").then((e) =>
            e.createRequire(/*! webpackIgnore: true */ import.meta.url),
          )
        : Promise.resolve(() => {
            throw new Error("require not supported");
          })),
        void 0 === globalThis.URL && (globalThis.URL = C));
    })(We);
  }
}
async function ct(e) {
  return (
    await lt(e),
    (Ze = We.onAbort),
    (Qe = We.onExit),
    (We.onAbort = Ke),
    (We.onExit = Ge),
    We.ENVIRONMENT_IS_PTHREAD
      ? (async function () {
          ((function () {
            const e = new MessageChannel(),
              t = e.port1,
              o = e.port2;
            (t.addEventListener(
              "message",
              (e) => {
                var n, r;
                ((n = JSON.parse(e.data.config)),
                  (r = JSON.parse(e.data.monoThreadInfo)),
                  st
                    ? Pe.diagnosticTracing && b("mono config already received")
                    : (ve(Pe.config, n),
                      (Ue.monoThreadInfo = r),
                      xe(),
                      Pe.diagnosticTracing && b("mono config received"),
                      (st = !0),
                      Pe.afterConfigLoaded.promise_control.resolve(Pe.config),
                      ke &&
                        n.forwardConsoleLogsToWS &&
                        void 0 !== globalThis.WebSocket &&
                        Pe.setup_proxy_console(
                          "worker-idle",
                          console,
                          globalThis.location.origin,
                        )),
                  t.close(),
                  o.close());
              },
              { once: !0 },
            ),
              t.start(),
              self.postMessage({ [l]: { monoCmd: "preload", port: o } }, [o]));
          })(),
            await Pe.afterConfigLoaded.promise,
            (function () {
              const e = Pe.config;
              e.assets || Be(!1, "config.assets must be defined");
              for (const t of e.assets) (X(t), Q[t.behavior] && z.push(t));
            })(),
            setTimeout(async () => {
              try {
                await oe();
              } catch (e) {
                Xe(1, e);
              }
            }, 0));
          const e = dt(),
            t = await Promise.all(e);
          return (await ut(t), We);
        })()
      : (async function () {
          var e;
          (await Re(We), re());
          const t = dt();
          ((async function () {
            try {
              const e = ee("dotnetwasm");
              (await se(e),
                (e &&
                  e.pendingDownloadInternal &&
                  e.pendingDownloadInternal.response) ||
                  Be(!1, "Can't load dotnet.native.wasm"));
              const t = await e.pendingDownloadInternal.response,
                o =
                  t.headers && t.headers.get
                    ? t.headers.get("Content-Type")
                    : void 0;
              let n;
              if (
                "function" == typeof WebAssembly.compileStreaming &&
                "application/wasm" === o
              )
                n = await WebAssembly.compileStreaming(t);
              else {
                ke &&
                  "application/wasm" !== o &&
                  E(
                    'WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.',
                  );
                const e = await t.arrayBuffer();
                (Pe.diagnosticTracing && b("instantiate_wasm_module buffered"),
                  (n = Ie
                    ? await Promise.resolve(new WebAssembly.Module(e))
                    : await WebAssembly.compile(e)));
              }
              ((e.pendingDownloadInternal = null),
                (e.pendingDownload = null),
                (e.buffer = null),
                (e.moduleExports = null),
                Pe.wasmCompilePromise.promise_control.resolve(n));
            } catch (e) {
              Pe.wasmCompilePromise.promise_control.reject(e);
            }
          })(),
            setTimeout(async () => {
              try {
                (D(), await oe());
              } catch (e) {
                Xe(1, e);
              }
            }, 0));
          const o = await Promise.all(t);
          return (
            await ut(o),
            await Ue.dotnetReady.promise,
            await we(
              null === (e = Pe.config.resources) || void 0 === e
                ? void 0
                : e.modulesAfterRuntimeReady,
            ),
            await be("onRuntimeReady", [Fe.api]),
            Le
          );
        })()
  );
}
function dt() {
  const e = ee("js-module-runtime"),
    t = ee("js-module-native");
  if (nt && rt) return [nt, rt, it];
  ("object" == typeof e.moduleExports
    ? (nt = e.moduleExports)
    : (Pe.diagnosticTracing &&
        b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),
      (nt = import(/*! webpackIgnore: true */ e.resolvedUrl))),
    "object" == typeof t.moduleExports
      ? (rt = t.moduleExports)
      : (Pe.diagnosticTracing &&
          b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),
        (rt = import(/*! webpackIgnore: true */ t.resolvedUrl))));
  const o = Y("js-module-diagnostics");
  return (
    o &&
      ("object" == typeof o.moduleExports
        ? (it = o.moduleExports)
        : (Pe.diagnosticTracing &&
            b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),
          (it = import(/*! webpackIgnore: true */ o.resolvedUrl)))),
    [nt, rt, it]
  );
}
async function ut(e) {
  const {
      initializeExports: t,
      initializeReplacements: o,
      configureRuntimeStartup: n,
      configureEmscriptenStartup: r,
      configureWorkerStartup: i,
      setRuntimeGlobals: s,
      passEmscriptenInternals: a,
    } = e[0],
    { default: l } = e[1],
    c = e[2];
  (s(Fe),
    t(Fe),
    c && c.setRuntimeGlobals(Fe),
    await n(We),
    Pe.runtimeModuleLoaded.promise_control.resolve(),
    l(
      (e) => (
        Object.assign(We, {
          ready: e.ready,
          __dotnet_runtime: {
            initializeReplacements: o,
            configureEmscriptenStartup: r,
            configureWorkerStartup: i,
            passEmscriptenInternals: a,
          },
        }),
        We
      ),
    ).catch((e) => {
      if (e.message && e.message.toLowerCase().includes("out of memory"))
        throw new Error(
          ".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features",
        );
      throw e;
    }));
}
const ft = new (class {
    withModuleConfig(e) {
      try {
        return (Ee(We, e), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withOnConfigLoaded(e) {
      try {
        return (Ee(We, { onConfigLoaded: e }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withConsoleForwarding() {
      try {
        return (ve(ze, { forwardConsoleLogsToWS: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withExitOnUnhandledError() {
      try {
        return (ve(ze, { exitOnUnhandledError: !0 }), Je(), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withAsyncFlushOnExit() {
      try {
        return (ve(ze, { asyncFlushOnExit: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withExitCodeLogging() {
      try {
        return (ve(ze, { logExitCode: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withElementOnExit() {
      try {
        return (ve(ze, { appendElementOnExit: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withInteropCleanupOnExit() {
      try {
        return (ve(ze, { interopCleanupOnExit: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withDumpThreadsOnNonZeroExit() {
      try {
        return (ve(ze, { dumpThreadsOnNonZeroExit: !0 }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withWaitingForDebugger(e) {
      try {
        return (ve(ze, { waitForDebugger: e }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withInterpreterPgo(e, t) {
      try {
        return (
          ve(ze, { interpreterPgo: e, interpreterPgoSaveDelay: t }),
          ze.runtimeOptions
            ? ze.runtimeOptions.push("--interp-pgo-recording")
            : (ze.runtimeOptions = ["--interp-pgo-recording"]),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withConfig(e) {
      try {
        return (ve(ze, e), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withConfigSrc(e) {
      try {
        return (
          (e && "string" == typeof e) || Be(!1, "must be file path or URL"),
          Ee(We, { configSrc: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withVirtualWorkingDirectory(e) {
      try {
        return (
          (e && "string" == typeof e) || Be(!1, "must be directory path"),
          ve(ze, { virtualWorkingDirectory: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withEnvironmentVariable(e, t) {
      try {
        const o = {};
        return ((o[e] = t), ve(ze, { environmentVariables: o }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withEnvironmentVariables(e) {
      try {
        return (
          (e && "object" == typeof e) || Be(!1, "must be dictionary object"),
          ve(ze, { environmentVariables: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withDiagnosticTracing(e) {
      try {
        return (
          "boolean" != typeof e && Be(!1, "must be boolean"),
          ve(ze, { diagnosticTracing: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withDebugging(e) {
      try {
        return (
          (null != e && "number" == typeof e) || Be(!1, "must be number"),
          ve(ze, { debugLevel: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withApplicationArguments(...e) {
      try {
        return (
          (e && Array.isArray(e)) || Be(!1, "must be array of strings"),
          ve(ze, { applicationArguments: e }),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withRuntimeOptions(e) {
      try {
        return (
          (e && Array.isArray(e)) || Be(!1, "must be array of strings"),
          ze.runtimeOptions
            ? ze.runtimeOptions.push(...e)
            : (ze.runtimeOptions = e),
          this
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withMainAssembly(e) {
      try {
        return (ve(ze, { mainAssemblyName: e }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withApplicationArgumentsFromQuery() {
      try {
        if (!globalThis.window)
          throw new Error("Missing window to the query parameters from");
        if (void 0 === globalThis.URLSearchParams)
          throw new Error("URLSearchParams is supported");
        const e = new URLSearchParams(globalThis.window.location.search).getAll(
          "arg",
        );
        return this.withApplicationArguments(...e);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withApplicationEnvironment(e) {
      try {
        return (ve(ze, { applicationEnvironment: e }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withApplicationCulture(e) {
      try {
        return (ve(ze, { applicationCulture: e }), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    withResourceLoader(e) {
      try {
        return ((Pe.loadBootResource = e), this);
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    async download() {
      try {
        await (async function () {
          (lt(We),
            await Re(We),
            re(),
            D(),
            oe(),
            await Pe.allDownloadsFinished.promise);
        })();
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    async create() {
      try {
        return (
          this.instance ||
            (this.instance = await (async function () {
              return (await ct(We), Fe.api);
            })()),
          this.instance
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
    async run() {
      try {
        return (
          We.config || Be(!1, "Null moduleConfig.config"),
          this.instance || (await this.create()),
          this.instance.runMainAndExit()
        );
      } catch (e) {
        throw (Xe(1, e), e);
      }
    }
  })(),
  mt = Xe,
  gt = ct;
(Ie ||
  "function" == typeof globalThis.URL ||
  Be(
    !1,
    "This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features",
  ),
  "function" != typeof globalThis.BigInt64Array &&
    Be(
      !1,
      "This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features",
    ),
  ft.withConfig(
    /*json-start*/ {
      mainAssemblyName: "SharpScript",
      applicationEnvironment: "Development",
      resources: {
        hash: "sha256-RVwxmOwpyXt2cB7IJRQwoBaG94l8Dje9PPqoOAGbIT0=",
        jsModuleNative: [
          {
            name: "dotnet.native.ykrnppwhq2.js",
          },
        ],
        jsModuleRuntime: [
          {
            name: "dotnet.runtime.peu2mfb29t.js",
          },
        ],
        wasmNative: [
          {
            name: "dotnet.native.53ez3dx5uy.wasm",
            integrity: "sha256-Ebk+Km0uqtdo/srKe0YcuUOlFykCcKVkBt03gTWt0aU=",
            cache: "force-cache",
          },
        ],
        icu: [
          {
            virtualPath: "icudt_CJK.dat",
            name: "icudt_CJK.tjcz0u77k5.dat",
            integrity: "sha256-SZLtQnRc0JkwqHab0VUVP7T3uBPSeYzxzDnpxPpUnHk=",
            cache: "force-cache",
          },
          {
            virtualPath: "icudt_EFIGS.dat",
            name: "icudt_EFIGS.tptq2av103.dat",
            integrity: "sha256-8fItetYY8kQ0ww6oxwTLiT3oXlBwHKumbeP2pRF4yTc=",
            cache: "force-cache",
          },
          {
            virtualPath: "icudt_no_CJK.dat",
            name: "icudt_no_CJK.lfu7j35m59.dat",
            integrity: "sha256-L7sV7NEYP37/Qr2FPCePo5cJqRgTXRwGHuwF5Q+0Nfs=",
            cache: "force-cache",
          },
        ],
        coreAssembly: [
          {
            virtualPath: "System.Runtime.InteropServices.JavaScript.wasm",
            name: "System.Runtime.InteropServices.JavaScript.ythr5w8c2e.wasm",
            integrity: "sha256-BrhFm19PIxt6fz1AX4v76P9/m+B9WYsHTWpqw5b+xHk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Private.CoreLib.wasm",
            name: "System.Private.CoreLib.8h8z078oeb.wasm",
            integrity: "sha256-rBHc3grtPK4G8c6pr7585tQZX3RgugnX0JMk9MBrGw8=",
            cache: "force-cache",
          },
        ],
        assembly: [
          {
            virtualPath: "Humanizer.wasm",
            name: "Humanizer.oqup3v7t3k.wasm",
            integrity: "sha256-4NbSboZzzP9nikRtXapUZNzOyITt7ht9TNqCIQHr5OE=",
            cache: "force-cache",
          },
          {
            virtualPath: "ICSharpCode.Decompiler.wasm",
            name: "ICSharpCode.Decompiler.l2zqf8tn14.wasm",
            integrity: "sha256-86w5F0jOe/PIuguvr8eY/85YkYUWV+2Gz39YawDnJw0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Authorization.wasm",
            name: "Microsoft.AspNetCore.Authorization.roqc1km2rj.wasm",
            integrity: "sha256-G2MGZ9ewONcPR9sDqM6GscLX+imqgtCbSDJmYjkq0rc=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Components.wasm",
            name: "Microsoft.AspNetCore.Components.uddsvpv1sv.wasm",
            integrity: "sha256-wuWRCfk296hzRmhePje6J3ah5yXcxXEBd706DXJFRQ4=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Components.Forms.wasm",
            name: "Microsoft.AspNetCore.Components.Forms.zrueb40r85.wasm",
            integrity: "sha256-sTHEhK4OXluS5QYyGPIkfDxAb1DqOuLKpTaWfiJmwgQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Components.Web.wasm",
            name: "Microsoft.AspNetCore.Components.Web.g5qdp1mxha.wasm",
            integrity: "sha256-XD2AzMV5aAT9HSLBN43quBUP/dVWw6qftqBWBucW0FU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Components.WebAssembly.wasm",
            name: "Microsoft.AspNetCore.Components.WebAssembly.9mjwvs1qyp.wasm",
            integrity: "sha256-r9UsPiHtdLyFHAIaIW1zZQ8yD7DiKJiKfiRhAw3TsU4=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.AspNetCore.Metadata.wasm",
            name: "Microsoft.AspNetCore.Metadata.m3mxap0jif.wasm",
            integrity: "sha256-3gPh5xu7hiWhbxpuO0oUdHzXtFNcg/mqHDIjIbFraGQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.wasm",
            name: "Microsoft.CodeAnalysis.nbv3etrano.wasm",
            integrity: "sha256-U1MayK/3gRVhzzvHky+28g14dEf4GATGwmVtHR5WFVo=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.CSharp.wasm",
            name: "Microsoft.CodeAnalysis.CSharp.31a9gop453.wasm",
            integrity: "sha256-+WStwuGCjabG8rCwqCuGDKWu9qGj/1xzHSFgokNo19c=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.CSharp.Features.wasm",
            name: "Microsoft.CodeAnalysis.CSharp.Features.gz80wdvd2h.wasm",
            integrity: "sha256-fNEAO4tZszdraF5UUEEtRgDBzT/5iynQcpTNQ3e2yIo=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.CSharp.Workspaces.wasm",
            name: "Microsoft.CodeAnalysis.CSharp.Workspaces.w194242yj9.wasm",
            integrity: "sha256-LIeV6FSmK0GnaI/HQFPl+zpSAXWuO3hfEd0R0+O7MUk=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.Elfie.wasm",
            name: "Microsoft.CodeAnalysis.Elfie.6dt0yknqsb.wasm",
            integrity: "sha256-VkmO4woyJqa7TDcQ9e+kuZEdNoHkFA3Nd/d9RXWVxa0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.Features.wasm",
            name: "Microsoft.CodeAnalysis.Features.xgc62kcptb.wasm",
            integrity: "sha256-oZbe2q50BXsrhnWyhoGRG4/5EdX3j/YpIz2P/Pu5R0w=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.Scripting.wasm",
            name: "Microsoft.CodeAnalysis.Scripting.r0600hu15z.wasm",
            integrity: "sha256-hd0nqO+Vqy7+W7AAw/ydL50fa8u8Ma7trSS1FEz3VwU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.VisualBasic.wasm",
            name: "Microsoft.CodeAnalysis.VisualBasic.k2br4n5g1q.wasm",
            integrity: "sha256-NP/oTjH6RdCBBSBz5LxqQWtu7brx/0Gdyg6oW6AYkzI=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.VisualBasic.Features.wasm",
            name: "Microsoft.CodeAnalysis.VisualBasic.Features.cocmogdce4.wasm",
            integrity: "sha256-rBEOAJ8kFPcEjt3SZ9dG7FNoyxO0gqLcT4gjKPSCJo0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.wasm",
            name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.kpit975t3z.wasm",
            integrity: "sha256-+LiNo6woCyxAu+F+f7huTo77Nh8Wek7NqmOhLxGWFGo=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.Workspaces.wasm",
            name: "Microsoft.CodeAnalysis.Workspaces.4et7yeld2m.wasm",
            integrity: "sha256-dIUu8SR2fPnvYKxFUrkMzApIOZffXlmbxm9N3Wgli5I=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.DiaSymReader.wasm",
            name: "Microsoft.DiaSymReader.n7aozp74g0.wasm",
            integrity: "sha256-s8A+LIZPdelFgqksm2voS6oVrorJuL2xM+/mgQHThnM=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.DotNet.HotReload.WebAssembly.Browser.wasm",
            name: "Microsoft.DotNet.HotReload.WebAssembly.Browser.hrhwg3a64c.wasm",
            integrity: "sha256-7T3xXhofp38yBmdv6CI7STwXMpOeEHm6J4GkYs//NlU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Configuration.wasm",
            name: "Microsoft.Extensions.Configuration.fgwnqtu7qk.wasm",
            integrity: "sha256-D5KB5N8DmzgXD7IIQwluWKs42DZg7/JJfC1Ig3H58vY=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Configuration.Abstractions.wasm",
            name: "Microsoft.Extensions.Configuration.Abstractions.thew1o6jcx.wasm",
            integrity: "sha256-YTLJpJ1JxkU9eodqZ+opZ9x9GpG21u85Vm+XqDhEnK0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Configuration.Binder.wasm",
            name: "Microsoft.Extensions.Configuration.Binder.7o70008j8o.wasm",
            integrity: "sha256-KZmgQYV5Lt7ByebbA6decx/7/5wBMmOPdRnvbbOBG70=",
            cache: "force-cache",
          },
          {
            virtualPath:
              "Microsoft.Extensions.Configuration.FileExtensions.wasm",
            name: "Microsoft.Extensions.Configuration.FileExtensions.ouivavlhyy.wasm",
            integrity: "sha256-MCcZhVRgzGEJYLBX4qKsBIbNBa/K/XrffR5G9te+hI8=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Configuration.Json.wasm",
            name: "Microsoft.Extensions.Configuration.Json.giv4t23za9.wasm",
            integrity: "sha256-iO3toOz+vT1gVcygKrktyq2sNdxAYEbsT8G/+wFpsNg=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.DependencyInjection.wasm",
            name: "Microsoft.Extensions.DependencyInjection.vs620n44bv.wasm",
            integrity: "sha256-EXUNskckZFDMuWWnJPnqOVoWea3we0Hxa95yYf+xjCQ=",
            cache: "force-cache",
          },
          {
            virtualPath:
              "Microsoft.Extensions.DependencyInjection.Abstractions.wasm",
            name: "Microsoft.Extensions.DependencyInjection.Abstractions.ud13mwbta3.wasm",
            integrity: "sha256-PpBs/eBAhpaDsADGsob5OEbcNGTxc0pej98psWfWjrM=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Diagnostics.wasm",
            name: "Microsoft.Extensions.Diagnostics.jnogfbng3i.wasm",
            integrity: "sha256-MTR1NLwrzXe0SPvtvttyL6zsX1lCjgPnydpz4nW6Mxo=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Diagnostics.Abstractions.wasm",
            name: "Microsoft.Extensions.Diagnostics.Abstractions.v59ymogeuz.wasm",
            integrity: "sha256-4xgO9yBlTZBNJ+KR0SBjKSeMqh6CoSOevMehMsXhayA=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.FileProviders.Abstractions.wasm",
            name: "Microsoft.Extensions.FileProviders.Abstractions.ssv83rveyv.wasm",
            integrity: "sha256-/PFqFXaxbeZtTuMqYl7uXeq55WoiDe+nDrHTrlVW2g8=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.FileProviders.Physical.wasm",
            name: "Microsoft.Extensions.FileProviders.Physical.8gz29xpyh3.wasm",
            integrity: "sha256-CANeN+322fHd0OgWgAUihPoGE2ex6PFJyPr5d8zQtJ0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.FileSystemGlobbing.wasm",
            name: "Microsoft.Extensions.FileSystemGlobbing.ozuva4e3vv.wasm",
            integrity: "sha256-pCgKh5A1+oYM/NUWTY2YuRJWcTqq4NncrT0aVTHxqkI=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Logging.wasm",
            name: "Microsoft.Extensions.Logging.y4ydx3rk2c.wasm",
            integrity: "sha256-7rQS5FTbW6HOY7Az4Q4xfopDObDh6RaYVVBpy2gddis=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Logging.Abstractions.wasm",
            name: "Microsoft.Extensions.Logging.Abstractions.1q3x7vre4l.wasm",
            integrity: "sha256-5/skwcro+miLeAW0+DIiiy2N9/0lMXvcH7LyAr9wacI=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Options.wasm",
            name: "Microsoft.Extensions.Options.2rz5zbidnd.wasm",
            integrity: "sha256-PrPNB4uF87saF4wn4wOtUMtwGEGphK6czOeS2ZoS8xY=",
            cache: "force-cache",
          },
          {
            virtualPath:
              "Microsoft.Extensions.Options.ConfigurationExtensions.wasm",
            name: "Microsoft.Extensions.Options.ConfigurationExtensions.zmb03w0weu.wasm",
            integrity: "sha256-652PeC0NOeRXAGuKIVsw6IOAbOjqYxwiAQzRSRNZX6U=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Primitives.wasm",
            name: "Microsoft.Extensions.Primitives.bd164v6l3f.wasm",
            integrity: "sha256-b0zJNvj5YDRD34cwkYLJ2wyQ4DRqQhXtTuJ+XlS9/zo=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Extensions.Validation.wasm",
            name: "Microsoft.Extensions.Validation.r1sv3m5lsf.wasm",
            integrity: "sha256-QdXTsh7zkwbh9Mf0A/ImTlaiefipVUlZ6uvOUX6C+Xk=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.JSInterop.wasm",
            name: "Microsoft.JSInterop.1r0ampr2q1.wasm",
            integrity: "sha256-TSwG0RXuP19z/VcPtEg0e8LJSFS4rFKf01zHcqNJaKA=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.JSInterop.WebAssembly.wasm",
            name: "Microsoft.JSInterop.WebAssembly.oz8fkrrrd6.wasm",
            integrity: "sha256-vNQI+7PzYwneCfXCfLMKUdjpMicKS0Ihwi/xu1KAywU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Mobius.ILasm.wasm",
            name: "Mobius.ILasm.97uyrcaq85.wasm",
            integrity: "sha256-ZZgh+suRp2QBGtRVhRqn9rVmv2CHbDMaRz6K/mXTfwA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Composition.AttributedModel.wasm",
            name: "System.Composition.AttributedModel.hyeu26vmks.wasm",
            integrity: "sha256-x84mFOiY5IWiziu9hIWjA6czMIk6htE97njiO3FDjRo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Composition.Convention.wasm",
            name: "System.Composition.Convention.4877usrvew.wasm",
            integrity: "sha256-rKHBdJvvV4nn0guxOvr2yBkrEZ4eaCDd5k2k/DEbLZ4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Composition.Hosting.wasm",
            name: "System.Composition.Hosting.a9ctg85j9x.wasm",
            integrity: "sha256-sty0RQPGuXTbfPpdShyp3z/gyNYGo2OFhG35piO89u8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Composition.Runtime.wasm",
            name: "System.Composition.Runtime.dhvcgz21fu.wasm",
            integrity: "sha256-n/n0L0V2nZi5TDDWshNActqwHTDwEK8yveUb0JsE7Dw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Composition.TypedParts.wasm",
            name: "System.Composition.TypedParts.8mz2ucolo2.wasm",
            integrity: "sha256-0G5Hi2xgqbBB2yGECyUG6L9gfqg6LxlDieh5VDO2LLc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Configuration.ConfigurationManager.wasm",
            name: "System.Configuration.ConfigurationManager.r8ewpdrbdh.wasm",
            integrity: "sha256-G41WDKxdmr1Z4ALhmD/UmQMmWMtl4uxYqWfEfaUFyNg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.EventLog.wasm",
            name: "System.Diagnostics.EventLog.w9qz4e67um.wasm",
            integrity: "sha256-PPSG9gKl0/mbXdSrlIFQSSnMY39vXyomRUweuZnfki4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Hashing.wasm",
            name: "System.IO.Hashing.6t5rx68r10.wasm",
            integrity: "sha256-1tC0lIGlZQy/j0GAs65xZ89jiPd9DnI6il9Q4lF7Pt4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.ProtectedData.wasm",
            name: "System.Security.Cryptography.ProtectedData.zng97z5min.wasm",
            integrity: "sha256-YaB+6yh+zaT0CnBAGu3bpSX/AXM5OBWeSMaTz5WVokw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Permissions.wasm",
            name: "System.Security.Permissions.dib0glxj5r.wasm",
            integrity: "sha256-u3E1W8GZxjfupWPunnM2ua2+YPNSOySs55yKaxTU6Js=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Windows.Extensions.wasm",
            name: "System.Windows.Extensions.9cp5u5g072.wasm",
            integrity: "sha256-d9719RkpXaDGd6uNW+FBPlVVF2e8ghaor26Mec/SJng=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CSharp.wasm",
            name: "Microsoft.CSharp.452y5fjxmv.wasm",
            integrity: "sha256-qI8x1zR8xZT7o0t2zwwcmAEGPfyZIHRH0Os6hiHJS2g=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.VisualBasic.Core.wasm",
            name: "Microsoft.VisualBasic.Core.re3geseai5.wasm",
            integrity: "sha256-vWy86fZ2jrmML8i9uG6vpskGWNYsPobE7GNKaElcK+0=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.VisualBasic.wasm",
            name: "Microsoft.VisualBasic.91iw3j3d9p.wasm",
            integrity: "sha256-TaKBjR51XLJb2PIo8OsUrQyrnjijpg4dE22qOC/odlM=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Win32.Primitives.wasm",
            name: "Microsoft.Win32.Primitives.2mjytoh92q.wasm",
            integrity: "sha256-NnsWCzlYsbSXluNe5+VlC4yRnnlsr8U/R6g+b+7loWM=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Win32.Registry.wasm",
            name: "Microsoft.Win32.Registry.yz8nt3ycsq.wasm",
            integrity: "sha256-sinZAashymf16TV/TJcbeDp0w84/AvwQd3GjkUofxXU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.AppContext.wasm",
            name: "System.AppContext.uwq3fpef1w.wasm",
            integrity: "sha256-/r2mIP99iJhZh+H7qzKreHvUN124Hpvx8VQVL153+DA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Buffers.wasm",
            name: "System.Buffers.m4yhcvz2y2.wasm",
            integrity: "sha256-+iDgAF9PtIHWe2dO+xAT40YPLenBJIBcAzxtX+LiH5g=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Collections.Concurrent.wasm",
            name: "System.Collections.Concurrent.1zv6wuzklu.wasm",
            integrity: "sha256-XW/R3VJ2r942Zv4xzVwk5xmlwGJHZQgsvIHMGty4/cw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Collections.Immutable.wasm",
            name: "System.Collections.Immutable.6uzpuv4o5d.wasm",
            integrity: "sha256-UoSXJJLA1WOclL6V5l+j6fsn8AIU2zyP8e4+WqHARiE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Collections.NonGeneric.wasm",
            name: "System.Collections.NonGeneric.k5rgagff9o.wasm",
            integrity: "sha256-eCf3yNlNqdcdcPGQPg4IHLMGVNGHK1MWCUM3vatUZ8Q=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Collections.Specialized.wasm",
            name: "System.Collections.Specialized.84wojkejb4.wasm",
            integrity: "sha256-mBs6H0JxWwAf/TSA96YAGdrbEuD1rzwQCrDyeeXWf74=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Collections.wasm",
            name: "System.Collections.63jrcion39.wasm",
            integrity: "sha256-Yu0OYA+3NZBsWqkZ/wV/TwuR1wjjRX4z19nv1LLKavg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.Annotations.wasm",
            name: "System.ComponentModel.Annotations.cjsvkufomv.wasm",
            integrity: "sha256-yKGfz9VP+u6xJaoq0kwZgNGHw8Yq68mBa1UviKl9+Zg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.DataAnnotations.wasm",
            name: "System.ComponentModel.DataAnnotations.vpng0qt4u6.wasm",
            integrity: "sha256-7asbHrFHUGGCub/8B5yu8IhIYWWPHx2Pp2lpuOLMq9o=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.EventBasedAsync.wasm",
            name: "System.ComponentModel.EventBasedAsync.en4q13ibd5.wasm",
            integrity: "sha256-9vgmzw0BDaOQ2PtjeI0DAoi9z/nlUVPflx8eqjRdD38=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.Primitives.wasm",
            name: "System.ComponentModel.Primitives.u0y5oi3qdg.wasm",
            integrity: "sha256-fosXsxXbJuBmXUV2VMWlI0jZsySyUeihq2/jlJhcGF4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.TypeConverter.wasm",
            name: "System.ComponentModel.TypeConverter.e2hbv9lola.wasm",
            integrity: "sha256-Jr7BJQdvjrZ3QD5DKD4j6P2dJCeBDPXdXiZ0KlRdWco=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ComponentModel.wasm",
            name: "System.ComponentModel.m11rh1qn2x.wasm",
            integrity: "sha256-9gzZfUDJ0ufIZyrdScgqPEFkjPgo0MIHyBlHboBM7KQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Configuration.wasm",
            name: "System.Configuration.j8qjkqg593.wasm",
            integrity: "sha256-bXjftCUa8kGxdOVzIp+sEQbr/CjIOjXYCs5L/77ufQU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Console.wasm",
            name: "System.Console.x9at0eh4vs.wasm",
            integrity: "sha256-ReHhOT1vzMgY6tjmti4nvr5JCwGiPCnAY2vGXnndMMI=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Core.wasm",
            name: "System.Core.ickp29885z.wasm",
            integrity: "sha256-vkafG31oXTrMX5yaamDI/spd8jNnomgUr9PzhOkIOHU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Data.Common.wasm",
            name: "System.Data.Common.4wisaz8pj4.wasm",
            integrity: "sha256-pMSY+zIRjzUEQWRY9rVDxY7nURLKRGCtekIisuLMZ4Q=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Data.DataSetExtensions.wasm",
            name: "System.Data.DataSetExtensions.904tnen1ot.wasm",
            integrity: "sha256-dye0vFa+ZoGZX4D1zyaAGLdUEjpEGDxIHDwPZH8uL4A=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Data.wasm",
            name: "System.Data.0h75nr7qqd.wasm",
            integrity: "sha256-7JfF3VIG7BKWP53hvF39h0S2oPBH0YY7m3pWq7HiwOg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.Contracts.wasm",
            name: "System.Diagnostics.Contracts.z1eotzj35n.wasm",
            integrity: "sha256-2QlZ5VU2ri3A/0GQYMjhjgs7BzKfppBn0OCQGVZMk1I=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.Debug.wasm",
            name: "System.Diagnostics.Debug.aeh9b1tcuc.wasm",
            integrity: "sha256-Uh+ZcinJKjFTWgTT+AlkXhc9bpsVehsi27YCvBN3g4g=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.DiagnosticSource.wasm",
            name: "System.Diagnostics.DiagnosticSource.ou2dt7nfo2.wasm",
            integrity: "sha256-sDg7Uzjnb8IAlZ8RbPJKm3DcXmBz2EmLRg251rERMEc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.FileVersionInfo.wasm",
            name: "System.Diagnostics.FileVersionInfo.kv9gl8mgag.wasm",
            integrity: "sha256-ALV7jJpaVcDzfTp4s+VJsVEfds/FdMFrU9Yu0d68Ck4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.Process.wasm",
            name: "System.Diagnostics.Process.lqtqkmw274.wasm",
            integrity: "sha256-87qMRUyI/yWzglHnmUlgzJCB1L5nKBLE5t0eMNGHvWk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.StackTrace.wasm",
            name: "System.Diagnostics.StackTrace.wvlboxd9cz.wasm",
            integrity: "sha256-jI8q0Fmsrrg+dNuXV4i4Gh9UKR0Ne13rXus01hw3nls=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.TextWriterTraceListener.wasm",
            name: "System.Diagnostics.TextWriterTraceListener.mx5w1z1p6w.wasm",
            integrity: "sha256-9rxh6TqQmUbRCCgjXZoU1/6ORMu3I6iXk3w28M6acC8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.Tools.wasm",
            name: "System.Diagnostics.Tools.862j1ozg5o.wasm",
            integrity: "sha256-wMJeVy0r09tdEK4PT0pjKM0sRx8XOTOEch4cF15ZpBE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.TraceSource.wasm",
            name: "System.Diagnostics.TraceSource.j08okd90mo.wasm",
            integrity: "sha256-k7Zpex9zx84qbCIW8u70Lau05LtbEnyqycQhVZcAeCc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Diagnostics.Tracing.wasm",
            name: "System.Diagnostics.Tracing.bnz7jo4op8.wasm",
            integrity: "sha256-ybzYdUnh/rTtVBqcRzhjWaT0zvXQT1dmNHSSP1sIsfg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Drawing.Primitives.wasm",
            name: "System.Drawing.Primitives.k3z431p3v7.wasm",
            integrity: "sha256-sGGZS12uCPIfOHQyOfpT0PDGOeUw2Fdp/413ZTob07U=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Drawing.wasm",
            name: "System.Drawing.v0usa2s224.wasm",
            integrity: "sha256-/1gug1Ht0MR5wkSh5F+J2kc7H0pgOg99nHrS/U4gu2I=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Dynamic.Runtime.wasm",
            name: "System.Dynamic.Runtime.iktlm0yhdx.wasm",
            integrity: "sha256-8r4Gcc75TWtDzR5ea3NAqpujLpas8JLeZOUT1v44IUQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Formats.Asn1.wasm",
            name: "System.Formats.Asn1.9iyl1hnh76.wasm",
            integrity: "sha256-8dbpG6+AvMYqSjdWJ9LnxeRWtfGwmcD/PnMFzuOxzK0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Formats.Tar.wasm",
            name: "System.Formats.Tar.9ikmelhi7g.wasm",
            integrity: "sha256-rxwyBAP+8LmUcT/Y0STjxdVWDhVJC1kldNQWclQAoJE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Globalization.Calendars.wasm",
            name: "System.Globalization.Calendars.e8yl47y6cv.wasm",
            integrity: "sha256-jkCO5UhqHD1be0llpamY9HPLjlBwmogSEDTkLSyrqUo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Globalization.Extensions.wasm",
            name: "System.Globalization.Extensions.fvxkfs32tv.wasm",
            integrity: "sha256-e/eL04Tm4VAmYK6KaPvwiMDgHiXmLneMpgn6dwOvoIQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Globalization.wasm",
            name: "System.Globalization.4ulc930few.wasm",
            integrity: "sha256-jE4z6oYu95YoHlXsD8JIoZ142/COHps6Bmnb3oVlC2I=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Compression.Brotli.wasm",
            name: "System.IO.Compression.Brotli.ibxx4kh8c6.wasm",
            integrity: "sha256-7opZritVQEYR7FVPNkdboWKXy2k4SyJIYbQnJrfR8UY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Compression.FileSystem.wasm",
            name: "System.IO.Compression.FileSystem.bselp9vv9w.wasm",
            integrity: "sha256-5ZQ67OVzx1GQaKQLOeayqNtX4NoP5DW2hslwSz1QXiM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Compression.ZipFile.wasm",
            name: "System.IO.Compression.ZipFile.b0ha8vyo8i.wasm",
            integrity: "sha256-m3j06SBRZTBr2j90oi804y2OFYq4VmUs+QlYR0pGZLk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Compression.wasm",
            name: "System.IO.Compression.sgbc42zrd8.wasm",
            integrity: "sha256-DIExnZSsDs83cEVRdUbzjlqe9sGtr71aNu4u+ZhAtYY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.FileSystem.AccessControl.wasm",
            name: "System.IO.FileSystem.AccessControl.oi9xn5s0h3.wasm",
            integrity: "sha256-kOYCxzUNpEjnN3BN4NJNkGSDWdwJtpPw/3P75sklPsg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.FileSystem.DriveInfo.wasm",
            name: "System.IO.FileSystem.DriveInfo.fi1uhp9255.wasm",
            integrity: "sha256-2dd/IRmG6yqPNLXemLlJ/EtHWJ69u4gqQwed45td5iU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.FileSystem.Primitives.wasm",
            name: "System.IO.FileSystem.Primitives.6j2ed42ac7.wasm",
            integrity: "sha256-UmHG/C2rYAoM3jtPn4R3/Ay38ECMxWJcTv4YzZhIYyI=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.FileSystem.Watcher.wasm",
            name: "System.IO.FileSystem.Watcher.v9i07bnq2k.wasm",
            integrity: "sha256-g7/3S8TlPd9P37bGrc1kFawutrlA3x0lp9/E2aSZdsg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.FileSystem.wasm",
            name: "System.IO.FileSystem.fktu0k4b93.wasm",
            integrity: "sha256-L8F4/NYQ5/NVb6n7oqGjittOCpTSqQ6u3BjCsXUJisM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.IsolatedStorage.wasm",
            name: "System.IO.IsolatedStorage.8ll4gxwfs1.wasm",
            integrity: "sha256-TDqU8hAmJvd+0H+XDRmqzbk2YkViCDAcfK8mlcT/5u4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.MemoryMappedFiles.wasm",
            name: "System.IO.MemoryMappedFiles.6do4olk7ib.wasm",
            integrity: "sha256-WuAoiEXy7IYaK8gAmXOZRJR8v5lD29rbdUMjRqBGJUk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Pipelines.wasm",
            name: "System.IO.Pipelines.21z0t9w6sq.wasm",
            integrity: "sha256-VjKTSsw4R3tDeRwKXw8L2BxmkzpZgt/JWljyPN0HRqM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Pipes.AccessControl.wasm",
            name: "System.IO.Pipes.AccessControl.5lvzz4lks7.wasm",
            integrity: "sha256-qW12/DgaAi5b+fpbUJmzH87WzPXm3Fy6micoQU4mzCE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.Pipes.wasm",
            name: "System.IO.Pipes.xosph8vk4a.wasm",
            integrity: "sha256-gR6HddfEsMBemhHfHGrt9hl8aY6K5mKyxa07iixZXlg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.UnmanagedMemoryStream.wasm",
            name: "System.IO.UnmanagedMemoryStream.d1pja42pyi.wasm",
            integrity: "sha256-gT91sKIfygQaZ9vkzKRSKK4LvVzHwVedRkkp0Pfa0F4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.IO.wasm",
            name: "System.IO.i9g92fmb9y.wasm",
            integrity: "sha256-akcNLHUsdebAMHrxAYCV/H6BoEeZYBIGpp+Wp7CYJSw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Linq.AsyncEnumerable.wasm",
            name: "System.Linq.AsyncEnumerable.4m1mh525k0.wasm",
            integrity: "sha256-VAkeSeC4p1GES8hvFcOK8w+65ZTmDdAbbLIL4zX5T48=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Linq.Expressions.wasm",
            name: "System.Linq.Expressions.4nat0rber0.wasm",
            integrity: "sha256-IFc8j2OJqBJYMshhomqGcyqauGqfhq4KWrNPqoTSGkA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Linq.Parallel.wasm",
            name: "System.Linq.Parallel.qf7zemz9aw.wasm",
            integrity: "sha256-ZmZj76lCqddo2AnWfeDbzXoQQfY7O/V4/cMudLALO18=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Linq.Queryable.wasm",
            name: "System.Linq.Queryable.vwinf8twbn.wasm",
            integrity: "sha256-geFlo3mx7Fy4jEOfa1szXQXkLw20bnYcuBLLVLluEEM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Linq.wasm",
            name: "System.Linq.rp2jklkmsi.wasm",
            integrity: "sha256-f1wo8JHk5OxZczStVC/MjjaT4OJ6cx/2+Hcz1mLoYeA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Memory.wasm",
            name: "System.Memory.3r0soomurg.wasm",
            integrity: "sha256-z0os6kbHJ8RohqezIHtamEXO2TIYXeESYFfzPO5Yqbc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Http.Json.wasm",
            name: "System.Net.Http.Json.t9gqpmtbpb.wasm",
            integrity: "sha256-H8rrK/mJCEPyvxADWjnHOUWZLmI5LKpzgg+Nm8qCre0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Http.wasm",
            name: "System.Net.Http.9rl4gopayw.wasm",
            integrity: "sha256-JcdFQvurhm0v4MWEyw6Tz3A2DaJg7rlh5ogBBafyRJU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.HttpListener.wasm",
            name: "System.Net.HttpListener.zg37o92yol.wasm",
            integrity: "sha256-rXZFgUW0v726aXDEjtobpEUHiur/egvWciebswh83pE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Mail.wasm",
            name: "System.Net.Mail.qk214miut2.wasm",
            integrity: "sha256-tgCPfswJg6u/TM5umZi2C5V3IYUPRK9rxiKkf51iTzk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.NameResolution.wasm",
            name: "System.Net.NameResolution.50dzekuu9x.wasm",
            integrity: "sha256-a9WehA9NpMugsS2YEWWiuuSnAUm6S961wESCFfYHMGs=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.NetworkInformation.wasm",
            name: "System.Net.NetworkInformation.k8343mqust.wasm",
            integrity: "sha256-ZAR9QVlpUvh4/EQSGZMQxi2g1hDGyGIdupJXCDLHrt8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Ping.wasm",
            name: "System.Net.Ping.00vh2kvsiz.wasm",
            integrity: "sha256-MLlkgkZbPgdL0Cm83IFdtf1tlum1sMeYD1u5Syl+X0s=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Primitives.wasm",
            name: "System.Net.Primitives.whs5oed1wm.wasm",
            integrity: "sha256-fMD1M+LzoYuL3Z8woZXrgr7TWATzvi4kdR92pTY+56s=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Quic.wasm",
            name: "System.Net.Quic.grloe2ix5j.wasm",
            integrity: "sha256-1AVMwwYA71Pny3jB5iq4ptl4z6hg38n5f2Y+VZ93uBA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Requests.wasm",
            name: "System.Net.Requests.r8ar2pd94c.wasm",
            integrity: "sha256-ZT333Ng2GK/Z3hOnS6JKcccs/GkN6j+YHpbi7SNCu88=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Security.wasm",
            name: "System.Net.Security.yn3zcskz4j.wasm",
            integrity: "sha256-TnnWesp499tqC2Fh5lxyIhfC0JlFkcSdGo+oUiptcoQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.ServerSentEvents.wasm",
            name: "System.Net.ServerSentEvents.37wbq4jfsy.wasm",
            integrity: "sha256-Qa4qeG6luT6eaB+xDTb/+ot6Py+/K3/gBPRmA/0F2Ho=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.ServicePoint.wasm",
            name: "System.Net.ServicePoint.j436yqvrg9.wasm",
            integrity: "sha256-rfC31myqS6LNlAL4WjPesdfsAuPezjX/GhMJeXEclOg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.Sockets.wasm",
            name: "System.Net.Sockets.utzdm9sw2p.wasm",
            integrity: "sha256-olBBLxzHFaVDMyIk/vsKfWT2pPiEOfEDBOfqUvfExHo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.WebClient.wasm",
            name: "System.Net.WebClient.e5a4gx4ylt.wasm",
            integrity: "sha256-YgDGVpDgYfND/OnpdQ3Lh73I2mSrAkYunGBs2A+21lk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.WebHeaderCollection.wasm",
            name: "System.Net.WebHeaderCollection.rbzkmij005.wasm",
            integrity: "sha256-132kZUevDfV/PbTb42SxRVMeC6mV9Nh8eB+zINB3QVE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.WebProxy.wasm",
            name: "System.Net.WebProxy.38jcv8jeeu.wasm",
            integrity: "sha256-UzukfIgTmjE0J7tXX9/+wYT7Ma5CP7h4E26PrsA7Uok=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.WebSockets.Client.wasm",
            name: "System.Net.WebSockets.Client.nv5izr3rt6.wasm",
            integrity: "sha256-vdL/w04I7fbn++cd4guuIR+w66BHyunOD3ZjUz481jc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.WebSockets.wasm",
            name: "System.Net.WebSockets.hdzn84g6uh.wasm",
            integrity: "sha256-1SrBg89TmJRX1mFY0vCVRlY2NTmPLw3MXjQaMOz15gE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Net.wasm",
            name: "System.Net.zku96ychk7.wasm",
            integrity: "sha256-E5FBFR/BK5YE21gsS0MSt1NYCv+B7XsWwYuALQkVuCU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Numerics.Vectors.wasm",
            name: "System.Numerics.Vectors.1l8xruz8uh.wasm",
            integrity: "sha256-tQyeyOKO+aQfHnYAmiyiBWBf3rrZSuttvFnGw/H4HHg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Numerics.wasm",
            name: "System.Numerics.on9qk50okp.wasm",
            integrity: "sha256-ZHvmyqwmpFZnXLrPpv83lB7b48meNt/DbTrtsmf1ZZk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ObjectModel.wasm",
            name: "System.ObjectModel.4omhtq90sd.wasm",
            integrity: "sha256-BAIg4cpEfut5uSavwkp9L0mlWfMq2UEnGKCx5g/yGGU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Private.DataContractSerialization.wasm",
            name: "System.Private.DataContractSerialization.zlwtcvnuqv.wasm",
            integrity: "sha256-qV0RVzpTMIGzv8I5z6Jkytgz/TW/wOmjjxCb3Z/+QNs=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Private.Uri.wasm",
            name: "System.Private.Uri.clehp4avpy.wasm",
            integrity: "sha256-IA3ZFjPg+LJZ8UhEgROmYSVIMvABtauncyO7kmJ6wqU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Private.Xml.Linq.wasm",
            name: "System.Private.Xml.Linq.ga3n3gh9b6.wasm",
            integrity: "sha256-aOOKCMfgi1RFwluA96JWD63Gpvyup/hKYoevTxf2MH0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Private.Xml.wasm",
            name: "System.Private.Xml.g9rvjereoe.wasm",
            integrity: "sha256-xLYwtizrGok0g4SL+TvlRaw6UJVHJogbubF3nVxUDo0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.DispatchProxy.wasm",
            name: "System.Reflection.DispatchProxy.b7qn4zpc0q.wasm",
            integrity: "sha256-mZv466MbDX3jRN79lY927Gvz1sFuW8RMdiC2ISqDaME=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Emit.ILGeneration.wasm",
            name: "System.Reflection.Emit.ILGeneration.x0vkqyycss.wasm",
            integrity: "sha256-ERw6k0NrnU8w0IPJZpwHZBCLwY9JBPw8doG05RVGn80=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Emit.Lightweight.wasm",
            name: "System.Reflection.Emit.Lightweight.3tzjd7znni.wasm",
            integrity: "sha256-B9UrvAQJ8gphmo0XadSEIS7zx48OUvTBbt4+qOVwg8k=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Emit.wasm",
            name: "System.Reflection.Emit.3t7flfwg7o.wasm",
            integrity: "sha256-uVm++7WgL+aWQ+W6A3XMA0MItiRLXwShY+LWT5+vGs8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Extensions.wasm",
            name: "System.Reflection.Extensions.ymwga5opgl.wasm",
            integrity: "sha256-xrhszywGQG+wwsJZzyomqh7EOs5qQPDNOeH2zZ+KKQo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Metadata.wasm",
            name: "System.Reflection.Metadata.9lgg9wjd2a.wasm",
            integrity: "sha256-/VBYNOtdOexweQErUQv2O4GXFMr3V6AnRUnjdCVgId0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.Primitives.wasm",
            name: "System.Reflection.Primitives.n2ngq6as7g.wasm",
            integrity: "sha256-z6oyAn7kYNkQBI+bRGKqve30iNmzGraFHYs5bfbe0QY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.TypeExtensions.wasm",
            name: "System.Reflection.TypeExtensions.ivmzcfvrc6.wasm",
            integrity: "sha256-jjZkmPOFQRklX0jnJb3nsezw/KWjsD9T+RuOdqWshU0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Reflection.wasm",
            name: "System.Reflection.v4mfyzbte8.wasm",
            integrity: "sha256-MSQYohCn9/DoyWxFSL7hGyOapz5ZCcgEsRdLzBFCvfw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Resources.Reader.wasm",
            name: "System.Resources.Reader.c9z9nieytf.wasm",
            integrity: "sha256-QIZr7nLJ8V/WnrQ6BYoMuFwmTaRZG3si0S3BKhDKLs8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Resources.ResourceManager.wasm",
            name: "System.Resources.ResourceManager.f3fiwdwb50.wasm",
            integrity: "sha256-61Av8KxvIFskB17avqBj40FGVFdlZgVEs1IC32JV/rw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Resources.Writer.wasm",
            name: "System.Resources.Writer.tx9namivq6.wasm",
            integrity: "sha256-EdRFcTz5nnQrjYyjfH0/HOHvq3jyUW6Z6hXyHeIyKjw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.CompilerServices.Unsafe.wasm",
            name: "System.Runtime.CompilerServices.Unsafe.5yw8jyjkyt.wasm",
            integrity: "sha256-M7zXYL4+jZyj3Tm3H02CGpQClvGG/pHFqN5yjRMvtQc=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.CompilerServices.VisualC.wasm",
            name: "System.Runtime.CompilerServices.VisualC.ddbsai2xh9.wasm",
            integrity: "sha256-b6UivS+o/g3h/yu7ejf99+R8py4W0IajCjh0M50hLTM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Extensions.wasm",
            name: "System.Runtime.Extensions.f4fqaba1oz.wasm",
            integrity: "sha256-8fo+Ja3EpiHHVqHRlzQEssrHu6TH8zKkvhrpAUEicQ8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Handles.wasm",
            name: "System.Runtime.Handles.kpe61fymig.wasm",
            integrity: "sha256-+GypCIGPa6k37qKyuT/ABSbQDeb4XCC6oTS/N5KizyQ=",
            cache: "force-cache",
          },
          {
            virtualPath:
              "System.Runtime.InteropServices.RuntimeInformation.wasm",
            name: "System.Runtime.InteropServices.RuntimeInformation.esodb2rpbi.wasm",
            integrity: "sha256-Qh7ZqBDPWSSFqD2ZdvOu6/vgXn8qyBEjO0+BJZwbL8s=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.InteropServices.wasm",
            name: "System.Runtime.InteropServices.02r2ubft18.wasm",
            integrity: "sha256-iPCXkQ7VvOWhzPOw2ctbcJRjtwhDGl0WCMiJTCukJVI=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Intrinsics.wasm",
            name: "System.Runtime.Intrinsics.j8lrpban8m.wasm",
            integrity: "sha256-vTbIUwUqJEWo8i3dqA138bo3vDocmxicf9X6KY/4gUk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Loader.wasm",
            name: "System.Runtime.Loader.bm8d2pac0a.wasm",
            integrity: "sha256-Ha1/qYzL9k22jv7E0YGuyqCs0HcGgvA3HxVdVpDNT+4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Numerics.wasm",
            name: "System.Runtime.Numerics.e3fl2oogjk.wasm",
            integrity: "sha256-Vp5dD4sUKJONaL8mIG5kU4zqublwL4IGCFsd+ImCKO4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Serialization.Formatters.wasm",
            name: "System.Runtime.Serialization.Formatters.a0v88kqnif.wasm",
            integrity: "sha256-Bnla4SDUVh6JdfXAcbzrUjJX3MORICWwY+I8WXqm6zU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Serialization.Json.wasm",
            name: "System.Runtime.Serialization.Json.pez04wd9mo.wasm",
            integrity: "sha256-vzj6j2yXEVraAtKDd2KVXbGeWshCIn51xXZ4B1M5oxw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Serialization.Primitives.wasm",
            name: "System.Runtime.Serialization.Primitives.xy5d3j3dn1.wasm",
            integrity: "sha256-hyGupfalhHC0lDaO+QsV2zCw9Muov1CPZRzKgNtH5LY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Serialization.Xml.wasm",
            name: "System.Runtime.Serialization.Xml.mmwsbcsgly.wasm",
            integrity: "sha256-0hCbtSKuV6vNV89PlSAZBeQaLDLgK+pf3VST11vcFO0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.Serialization.wasm",
            name: "System.Runtime.Serialization.qfpmfujegm.wasm",
            integrity: "sha256-un6iBq696YnialtGGZrJNd0+LNCi87cH4jmSf0lukFk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Runtime.wasm",
            name: "System.Runtime.k6ze2203p2.wasm",
            integrity: "sha256-ZAxRxu4z0LK1z7Js3o0XMPFu+htObWKyOnesqVPrOoM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.AccessControl.wasm",
            name: "System.Security.AccessControl.4mxo8hy5cn.wasm",
            integrity: "sha256-1PMsmuwuaKqrYIirgpvUZ3NTundQDyIQYDEeyceEhmA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Claims.wasm",
            name: "System.Security.Claims.9n1yusa5e5.wasm",
            integrity: "sha256-KxVd6UVj4Gz7ZptBX1C4kT3zeBnBz5dutUkDFAfPmoA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.Algorithms.wasm",
            name: "System.Security.Cryptography.Algorithms.4dnz7b15a9.wasm",
            integrity: "sha256-CCQG3oTGklkKvqz1o8GFYJU7QliJ9Y8dcYeOKbSsaX0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.Cng.wasm",
            name: "System.Security.Cryptography.Cng.dyaxkkx3lb.wasm",
            integrity: "sha256-SxZmS8g/r93tD/sRxNM9osIYyVx72z/H/rqmMQdWNug=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.Csp.wasm",
            name: "System.Security.Cryptography.Csp.20t5iw27a6.wasm",
            integrity: "sha256-EtTJD2JK0Rt7JYIikmhcCxm2nwff+fVOWVzvr4obB8M=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.Encoding.wasm",
            name: "System.Security.Cryptography.Encoding.0lu5m0tfx2.wasm",
            integrity: "sha256-7G90o69YXrWL2H1YqPGejQvqkGaMyT9s+Y9N1+ZMLFU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.OpenSsl.wasm",
            name: "System.Security.Cryptography.OpenSsl.4m4pzjxi3g.wasm",
            integrity: "sha256-nKLRyR6/3ScZM8qqaWqHcZzyIFcnaEJxR+Qt4dPR3+o=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.Primitives.wasm",
            name: "System.Security.Cryptography.Primitives.7bcdd4uolu.wasm",
            integrity: "sha256-kxwYxDrmQQt2a96PZSY+c5m2Bd3resehAaairZJxAZ0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.X509Certificates.wasm",
            name: "System.Security.Cryptography.X509Certificates.dmew7c9amv.wasm",
            integrity: "sha256-+8YtZ824bFWT6xBDxcp29g5VozHkSh7gxEJ9wTTGBV8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Cryptography.wasm",
            name: "System.Security.Cryptography.5rp84ijz8t.wasm",
            integrity: "sha256-YTB50qLxW3FHhVgNVtqxug0aR8MKoHCpyfRywlOOqMM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Principal.Windows.wasm",
            name: "System.Security.Principal.Windows.7ssqvw2wfy.wasm",
            integrity: "sha256-NzMv/gYogSkXi7nAeibdZqkHbd5o2GJwbyQ4eDOVdYQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.Principal.wasm",
            name: "System.Security.Principal.j5dp7k8x6u.wasm",
            integrity: "sha256-KfroySmqVcPGmn3QTpWgL3vo/r5Am7IcbwbX4KAd4no=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.SecureString.wasm",
            name: "System.Security.SecureString.7weoywtuje.wasm",
            integrity: "sha256-Z5MYQrjlu4RgNAwl13nxDkVif68msW3P3UY5NefH6hY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Security.wasm",
            name: "System.Security.snpv53zusk.wasm",
            integrity: "sha256-qFTNZPpD22AMNoP6hp/1th6RcChMCwzt/hUrP6c6ZNk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ServiceModel.Web.wasm",
            name: "System.ServiceModel.Web.3f1khl8k32.wasm",
            integrity: "sha256-0RYujx3hOaqcdMkxqVRlvwMJE3Eiia09EOgy8iVHtOY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ServiceProcess.wasm",
            name: "System.ServiceProcess.a95c1olw0i.wasm",
            integrity: "sha256-nvYNz4JxrW9EbrDAIte/TKIWH7NPDyEzw5uwY/9FWXU=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Encoding.CodePages.wasm",
            name: "System.Text.Encoding.CodePages.8bhn50uz8f.wasm",
            integrity: "sha256-nIMU74re2s2YH+3JuTStexs6vW44sGVJdfrmo+E4c7A=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Encoding.Extensions.wasm",
            name: "System.Text.Encoding.Extensions.tqz9dyg6j7.wasm",
            integrity: "sha256-y208MbIN6InUMbO/8IlZkqYgpJz2uCJlXPz1A3WP/2A=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Encoding.wasm",
            name: "System.Text.Encoding.s9ic8sulfi.wasm",
            integrity: "sha256-gAC6dsyYsYCAhTW1sdCHpEWfvNsGbkfozQG2c7424fg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Encodings.Web.wasm",
            name: "System.Text.Encodings.Web.07hq35kp92.wasm",
            integrity: "sha256-dI/4i50J3daDsGvQXTtXTvZL1Z4OwhmVoH1Kv1sQPeE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Json.wasm",
            name: "System.Text.Json.2alhj4y3bm.wasm",
            integrity: "sha256-BheU4fr2y3m4UHghRCAS+s8H+Fm0hqcn2tSLmH65gFY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.RegularExpressions.wasm",
            name: "System.Text.RegularExpressions.h1qtkesphd.wasm",
            integrity: "sha256-FbVJnY8ASEAyUo17q0mlbx0dQ+i1bc7CWoGnfaKsWTQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.AccessControl.wasm",
            name: "System.Threading.AccessControl.ruehy0ud5k.wasm",
            integrity: "sha256-c+f1xwX2mwd1HivDicXVo53sg3M6plnOA0lZsmE+I0s=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Channels.wasm",
            name: "System.Threading.Channels.s3i62rxr2p.wasm",
            integrity: "sha256-2AAR/+dObI+bFn2Kf2fnAGtTXsbNM/IogjbCwZ4/lD4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Overlapped.wasm",
            name: "System.Threading.Overlapped.lzl7igry1t.wasm",
            integrity: "sha256-ES1NKTg48VYdUTELAqycwaTZE+8G5X28qClfJ3FWAq8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Tasks.Dataflow.wasm",
            name: "System.Threading.Tasks.Dataflow.p9bjzp5pyo.wasm",
            integrity: "sha256-zVYaG7rbWlASjPs2s6rD3fHGXHa5HBqIcKlnUo8qx9k=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Tasks.Extensions.wasm",
            name: "System.Threading.Tasks.Extensions.unp0hcfijn.wasm",
            integrity: "sha256-Fq36YR8JxdzQSY7Z47jZ/s+E1fqJ3WxAJr+JZt4vPu4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Tasks.Parallel.wasm",
            name: "System.Threading.Tasks.Parallel.hyku0ejwye.wasm",
            integrity: "sha256-ZxIVU/W4b6y7eyUvQrpgVkBL1LRFG3w35bISa0EXYlo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Tasks.wasm",
            name: "System.Threading.Tasks.t0sjw89o0i.wasm",
            integrity: "sha256-YxvDFtMZrWfakXzc+aFCZVTkSv6I/tOPItx4OM86rXo=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Thread.wasm",
            name: "System.Threading.Thread.nfbg9v9bn0.wasm",
            integrity: "sha256-43JHPgS5ugV+E9WgXMFIX4e3EwOcqsFZTfP9yEPhhI0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.ThreadPool.wasm",
            name: "System.Threading.ThreadPool.jrzo6stg1k.wasm",
            integrity: "sha256-D1G/Zc3qCCIC5KP5dWjA7e/CnG6SjjVDzCVt+TcPVas=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.Timer.wasm",
            name: "System.Threading.Timer.y8l1kxazi5.wasm",
            integrity: "sha256-0jmQoALhsiEAsYneNGG+CM70+WO1R/s3jHpGUDisSo0=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Threading.wasm",
            name: "System.Threading.47ucbn1gg1.wasm",
            integrity: "sha256-ICVxlUO3Oz3f5ouBy/nzVLMZPT/RhBkqnpKRSQFx1Ts=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Transactions.Local.wasm",
            name: "System.Transactions.Local.cig01jt23c.wasm",
            integrity: "sha256-lHC4o1ZotnFLPm8FaAJBuPLW0A/GlCXIT0zTz94yBc4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Transactions.wasm",
            name: "System.Transactions.pl50n6qbg7.wasm",
            integrity: "sha256-XcstMVAoLdZ+orRvyskPiuUqRLf5D5lc9kN/NB8aUio=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.ValueTuple.wasm",
            name: "System.ValueTuple.mj3r9p0pcw.wasm",
            integrity: "sha256-Tsg7R79augGu7C+8BbYKEU9gLPTRw1kd107Jk8EfUTY=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Web.HttpUtility.wasm",
            name: "System.Web.HttpUtility.3jfxpyq4in.wasm",
            integrity: "sha256-IRJv93qx1UHClw10dYSICCZDR8RKYkHFRj8E+M+ODy4=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Web.wasm",
            name: "System.Web.2a6wq9gv6d.wasm",
            integrity: "sha256-Njq6HTh3Pty4dn0WZhYVQUcmg+2rtRPH+qZWYnNb+Pk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Windows.wasm",
            name: "System.Windows.bw79ix589z.wasm",
            integrity: "sha256-O1aloJDDF5FgI3Rz/S/j1kSVDzwdmyHrldq4/LehmfA=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.Linq.wasm",
            name: "System.Xml.Linq.nvnhbwdsg6.wasm",
            integrity: "sha256-I85V223miQIsEDHwUwJctMPs7r5BH8oklVHTuPILOXE=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.ReaderWriter.wasm",
            name: "System.Xml.ReaderWriter.szsdminork.wasm",
            integrity: "sha256-+F2HpJovT57vb8lhHuHeOu1cweg9oGfXz64WZc6dGho=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.Serialization.wasm",
            name: "System.Xml.Serialization.b9imguls9w.wasm",
            integrity: "sha256-EWLyaQVNmvOuGv6OF2zeCD70/btF0kfVKTKsxm6Qor8=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.XDocument.wasm",
            name: "System.Xml.XDocument.8hg6c0at0c.wasm",
            integrity: "sha256-7AQsOnr4cz5tEYv3X16GczrqG8krUeDSeFmiYPQLfPk=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.XPath.XDocument.wasm",
            name: "System.Xml.XPath.XDocument.g7i5gd64yo.wasm",
            integrity: "sha256-bK8dOOh8VCY0QD5N9QgI8XoGFWZl2vam6NEj/2mrjbg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.XPath.wasm",
            name: "System.Xml.XPath.11wk1hhnfk.wasm",
            integrity: "sha256-28tbhhHcpHXCupvK0u/qF9goapqSbSOXpI6Bhsb8CUM=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.XmlDocument.wasm",
            name: "System.Xml.XmlDocument.isetn6xlxa.wasm",
            integrity: "sha256-Io8HC44Y/4l1xWpEaPyQ7Fye/nkI+GBp/4T9Le8U4Fw=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.XmlSerializer.wasm",
            name: "System.Xml.XmlSerializer.okgnp5v9bw.wasm",
            integrity: "sha256-WC878pTuewOvlqU8PxzU3tyBTpdXJuQmfQ+RLYBQ82U=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Xml.wasm",
            name: "System.Xml.zjgi7nrlno.wasm",
            integrity: "sha256-scgB56no4jmGIaqIMm3vIz4NoEAXmRIVNvYn/XJyAas=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.wasm",
            name: "System.7rk3uansaa.wasm",
            integrity: "sha256-00H57iplaS5jV1pIsR27AMoBc513vj5KV9av/bqM69Q=",
            cache: "force-cache",
          },
          {
            virtualPath: "WindowsBase.wasm",
            name: "WindowsBase.wz82kkc1p3.wasm",
            integrity: "sha256-DP5uISPLoKdOpnsShfhy6uzDlHvBhbugGr+pAs4U7qQ=",
            cache: "force-cache",
          },
          {
            virtualPath: "mscorlib.wasm",
            name: "mscorlib.555t1ekkz8.wasm",
            integrity: "sha256-SZjAK8HAw2h/GFSpIb7U4RKjkUZZYvXe08WODLwUw5M=",
            cache: "force-cache",
          },
          {
            virtualPath: "netstandard.wasm",
            name: "netstandard.0e3bjkca9m.wasm",
            integrity: "sha256-6OiHD0QF9BpgURFP9xxsmcfqcZwdHzlD4SGZRCw5/Bs=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.CSharp.NetAnalyzers.wasm",
            name: "Microsoft.CodeAnalysis.CSharp.NetAnalyzers.iuromsscgm.wasm",
            integrity: "sha256-+ihopNJMu9duCGGl9GLAT55+a/uCIy29J+S5w9xx2zU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.wasm",
            name: "Microsoft.CodeAnalysis.NetAnalyzers.b8aybp1krv.wasm",
            integrity: "sha256-tZjwtHdg0jqwwCfcLkKbAUgqwG9IMBtRDRWetYUJPVA=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.CodeAnalysis.VisualBasic.NetAnalyzers.wasm",
            name: "Microsoft.CodeAnalysis.VisualBasic.NetAnalyzers.ewj5pbgu8f.wasm",
            integrity: "sha256-AsfV1JAKq9jdkBdnSRKS08DUl1oLELdbIyR4OMg8WKM=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Interop.ComInterfaceGenerator.wasm",
            name: "Microsoft.Interop.ComInterfaceGenerator.pk4w05dzrp.wasm",
            integrity: "sha256-KaMxisHC0AoESLgg0ex9OglTrLnl7E80xtU/HEC2JZA=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Interop.JavaScript.JSImportGenerator.wasm",
            name: "Microsoft.Interop.JavaScript.JSImportGenerator.49tw29svoc.wasm",
            integrity: "sha256-GOIxzFuykek2wQ2tUl8ECROtekhWY4I4WAFmiVYl5BU=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Interop.LibraryImportGenerator.wasm",
            name: "Microsoft.Interop.LibraryImportGenerator.qmiq6irs4k.wasm",
            integrity: "sha256-LiH6TWqu2XvgtrO6a2BDYhMKo/hDNlEFtTkx3pB1VKA=",
            cache: "force-cache",
          },
          {
            virtualPath: "Microsoft.Interop.SourceGeneration.wasm",
            name: "Microsoft.Interop.SourceGeneration.8d0nyieux9.wasm",
            integrity: "sha256-ZFQVszi9dQSwzEu9UqgXL7qo3SET5RHtRiss4eEIetg=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.Json.SourceGeneration.wasm",
            name: "System.Text.Json.SourceGeneration.qx41a3x1tw.wasm",
            integrity: "sha256-PlWNcY/zw3hh2poHPOAykpFHFkK7XKmXQ4/dADE5v7c=",
            cache: "force-cache",
          },
          {
            virtualPath: "System.Text.RegularExpressions.Generator.wasm",
            name: "System.Text.RegularExpressions.Generator.v3cs59wa3f.wasm",
            integrity: "sha256-S5UjSVCJ0K1PORav9HBAJg5rSg5ME0gP2sVW5P6YXR8=",
            cache: "force-cache",
          },
          {
            virtualPath: "SharpScript.wasm",
            name: "SharpScript.mxn4azp2wo.wasm",
            integrity: "sha256-1udyUps6sjHmevsIkUfgYjMCkIzG3YqFjYh9zGoq7Rk=",
            cache: "force-cache",
          },
        ],
        pdb: [
          {
            virtualPath: "SharpScript.pdb",
            name: "SharpScript.1hhmquv2zj.pdb",
            integrity: "sha256-9QMI2PxePvwnF6sajkOup2KTPr+Ef7Pbb+HxpLP/WiQ=",
            cache: "force-cache",
          },
        ],
        satelliteResources: {
          cs: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.n9xij9ahtd.wasm",
              integrity: "sha256-6w/ubI6vr8Mee3U17g5T+3tqO1gAkoD7zWK1tcv2ouw=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.nwrdawv9mc.wasm",
              integrity: "sha256-eTc43+J9ZBCO/LxZOSNopfnBVvtcU1I8lM4MoqN/EDE=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.o0y0rpchu4.wasm",
              integrity: "sha256-yFRMFnSPzsiah+SzI3Qdt1D4UQRdy7bHw0urHrUIorE=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.n1692tvq1d.wasm",
              integrity: "sha256-28wImIlMsqEEUSzgfOPqvMkemt+JmL8gBTlV/hiKIbg=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.jbnnn98fqd.wasm",
              integrity: "sha256-Ma9FJ9nzdpbIDAxnTDQnbMJ3Um/dQvrJRvQo6fb9lKM=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.lqqs3a9rt8.wasm",
              integrity: "sha256-XRFhuSOVvPhN0atQuKlgyr4EAD+tPAIkkGlJ7fTzWB0=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.wgftnt2khb.wasm",
              integrity: "sha256-kB5vubkQT8gbJzlstSl1g73HA4wLQsBQWtQ5mua3ZD8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.5ye17y2lep.wasm",
              integrity: "sha256-E28Gf6CwlJLG15hi6rid3uCC1ornkIkWA43c3ZfF0EM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.z47ogyt0be.wasm",
              integrity: "sha256-3R3z8YcuCOLCO2tqlV3runsJSR2q/XnClKakZMtj6ZU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.jfn398dpr5.wasm",
              integrity: "sha256-X3JlBfz35TVXM84yWOza47OjS2LHiBPJeENgSHngCvQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.7kqpgcid5o.wasm",
              integrity: "sha256-SY02MpShUmGI8NcCYrbZPlYjwexAoQXG0p8R8zN9tOQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.51bt0mwmcj.wasm",
              integrity: "sha256-54rtnm0lf/aiygouV3SLFbbXO+5mCcPNMnMTnAvwnxg=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.5xwoflssff.wasm",
              integrity: "sha256-qV9hv2wgzbtnh8p/u0RcqzCjuLQBrx8PNUr8UNpawdc=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.fu91zn16j6.wasm",
              integrity: "sha256-FzfGG2ZBW4BbUNmPbvDoduk/vROqcwR4A3dlYMRIF+g=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.rptvitcdcf.wasm",
              integrity: "sha256-0XHh+sgFeP7d2rdgukrpz78vp87OLwykmATZDEkBRjU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.zvvvspy8v1.wasm",
              integrity: "sha256-L3ND1nngS7hKAvw5zJeneFKtfkXbnM0/9CUSQ3E2QWo=",
              cache: "force-cache",
            },
          ],
          de: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.mke0trcyeg.wasm",
              integrity: "sha256-Ou0x0kLTwE3fuU16+U3y6mVZ1C2NPiVUJmimIk/33GU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.w905u4drdq.wasm",
              integrity: "sha256-XHGX7ymRHISl5sG7wUPLN+HddndvvF03qghXZlHIWo8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.e7guizyw8b.wasm",
              integrity: "sha256-dnSM5DEeHAWhx6+BOyswKtpSXs/MAPOdUJ7NEEMr9IE=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.rntfmu4i55.wasm",
              integrity: "sha256-Ge4L1L9C9iHOL9SVLEMe5OogR2xRvgbQR3kdcyPJyDI=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.ddxcv8hyjb.wasm",
              integrity: "sha256-8WL8rjs8+7kKxz0Dwp9EqJhB0agCmptNfJcVRvviXqs=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.0uvarzn823.wasm",
              integrity: "sha256-qJb6eJaUeVh3PBenudsQqBGhW/hKlYkMYtumSXeVjnE=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.ytbuo9s1bo.wasm",
              integrity: "sha256-mowECLCBi6z15c9sD2jM3pYLPaAjQc29SRvOGWO8psc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.u9p6eijlju.wasm",
              integrity: "sha256-jnQgbQ2z5ImYot7+PGy9O/uEwZOLwaq3fv4ZOPLnIy8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.prpdzth3nz.wasm",
              integrity: "sha256-tSpNEuAvxGBuyB+pyjIMAyXkEcg+rGNKTHo59pkefVk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.vogfs3qx2c.wasm",
              integrity: "sha256-wZWnCETj2zS9nseW2qahsidJJWOtu4rEdFq1/BpkH18=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.o4o0fzps1c.wasm",
              integrity: "sha256-2BqS+Lnia7juIwuBL/8PX09iFAeRpsE5tHLvdGor6H0=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.bx75x0hfb9.wasm",
              integrity: "sha256-X0gGadAALHtCKUAMoVq533kvAcK2j9/VTMhbmToEYJk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.a89blccc7r.wasm",
              integrity: "sha256-hleb1H1ud9C//IgcwjS/OMaKY0MA0OFvphywO4NRInk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.3xrllnlne4.wasm",
              integrity: "sha256-l4FALSuhp+d6F3oaehLTHu6TcMUHlg4aE3JT3vJcZiE=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.mks4xm3chx.wasm",
              integrity: "sha256-Wo2XWw+bkFHyw7ADbbB+OmLcTgAWmGIy0oc3FRLvRNY=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.7wacdbfsf6.wasm",
              integrity: "sha256-J+syVYPqfRYK197b4eUNcfQzsHSDpV2gtcrIGKaIJEM=",
              cache: "force-cache",
            },
          ],
          es: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.pkaq0ofjtg.wasm",
              integrity: "sha256-9zeA0d5GD/60wNbgTnobTXmMIrj6zm8AEcPMjYBRTJc=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.5aw6zcklbg.wasm",
              integrity: "sha256-E+RmaXlhLvTk9lR1vZCJkFfSfDbJ03qTQgq0Xg3SK1Y=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.quzjz5h7kw.wasm",
              integrity: "sha256-vrwDr7+0H0SYoG6WLfNa9fBvDVU/lHHw9BBFjyGCvd0=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.8oynqtdvkv.wasm",
              integrity: "sha256-SI09Omql4ZV7+D5371nvTXCoHNE6h76iPOVFO1fL6ts=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.5obrqaqtoc.wasm",
              integrity: "sha256-1RVFrGaUDJ43d9/z+DcFV25LE72cv2bqbCLf961B328=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.fmdh7xejlw.wasm",
              integrity: "sha256-N4rFLWxih2tHByt145XzObbepri5zaB5J6/Y/bEl0ZY=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.77gl31ropo.wasm",
              integrity: "sha256-Q3zMkaugCC1nDn/1sBUN/WDhvQmL5VA+FclXBMVD4DY=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.hkuqjgkxbo.wasm",
              integrity: "sha256-vy/d/ZZh2DKIGnaGuBsKQxweUUhYMaFrY0TYQuB2RQU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.9baxoj9b5r.wasm",
              integrity: "sha256-i7lhb4+n1UDBqX3fKczBGa1JwLQtFSmEnOyY2kz0T1Y=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.tjib7kwy79.wasm",
              integrity: "sha256-qekxcKqz6nULWkvmGMYtzm9AZczJWi0DsMVydNXYieM=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.c9kgj7xm40.wasm",
              integrity: "sha256-kMkL6J5ToB4TBlD2tFUGIs9KYV0E7/mVMvfdorJc62M=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.o6900fins7.wasm",
              integrity: "sha256-gKoemMdnV4Z6FqTHTblC1yiMeey9Jwuomt7unwfSjG8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.jyhvv0e6n0.wasm",
              integrity: "sha256-q0sA2SU327Q61L060jJKOvlKNljaepvnobgqN93vnz0=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.31mjvcbrr8.wasm",
              integrity: "sha256-R5X5qK1mIIcxap8GX5zTUOe2mG0wpKP6pj0h+U+lueA=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.rzwvz36ty8.wasm",
              integrity: "sha256-x0cx7kXcF9JMOSWc2mXRtUIWdRNtZU01g3qtUpMw4Ro=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.kbi6n0nodv.wasm",
              integrity: "sha256-wHYEFKg36PeIxf9momgAA38VVuAipGDzgzL30csDlqc=",
              cache: "force-cache",
            },
          ],
          fr: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.qykwzrytnf.wasm",
              integrity: "sha256-3h6YXVHgWP2GUo7UkbXTRyzXNYBWcEC2nOqV7zfGjXc=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.87ow0l3bng.wasm",
              integrity: "sha256-hKY3hIeDQLowm7tym4aWghjRdiKmxP/FNtCqnqHAGDQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.qnxtu0c7nm.wasm",
              integrity: "sha256-pq39SW4WG6s8beyXLLG5TvFegZPxD1ja8d9n4CL1aoo=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wva2pr48ks.wasm",
              integrity: "sha256-ZBecag4aOhXU6OchtnxE6CIW37ChFZal/FVxDFf0awE=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.q7249qnn4u.wasm",
              integrity: "sha256-NmWM6vWqmLcl2tnW+7VJaYuV4RQAZJspLb9jCZsmmcU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.lrmcyerzvx.wasm",
              integrity: "sha256-QcjxdwX7s3M66/Q9CmmgE+RGHzGkymoqPkpLC3mYSyo=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.oo204g4m2i.wasm",
              integrity: "sha256-aG7/aytZhLKNzCvXVVCoaPJVNwwz2gCNUXQfce5Ehxs=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.hbaqfh6yid.wasm",
              integrity: "sha256-QxZD4uSzxHrpGasSym8LYxufDvK0qqmY+Gqwgz9eNqw=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.4238w5d30h.wasm",
              integrity: "sha256-hFrenzsn44XZUxofHa1TsOY1ZeuNAGeoWIi+uNsuMy8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.q29jpkge0r.wasm",
              integrity: "sha256-sr03rmlSpOdyrCUaoy4SKhKlUaIkkdDBDMYeFIN9chI=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.uqwo4a55ye.wasm",
              integrity: "sha256-OsiwwzQuIm+V7o+1J8EYD6jEyuxARugWyTGy35tG1ls=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.tyfxpob2dc.wasm",
              integrity: "sha256-6+dorWfU4arrZrJ38wSaPb+IPw+PiUJYX0DHqmZOEOc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.xpleku84k0.wasm",
              integrity: "sha256-i04gYX6qw4rfysE3azMjMuEZe/uaqxxhhHv3RjWc+Ww=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.2nmylu01cu.wasm",
              integrity: "sha256-4qsbsl7G7NrTiUxToZIq5hXxZmGZLfVFv41VaALBgBc=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.itlbzef56s.wasm",
              integrity: "sha256-ypFCd2ICpnL6Fo1QkMxlsZPDAAsMMghsrdFJMFXLEtk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.ufa64k05z7.wasm",
              integrity: "sha256-Wg72sJ3EO78Lwbz9SJqoLDg5A7hp2scx6LkMxe3cdTY=",
              cache: "force-cache",
            },
          ],
          it: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.3i3fhtjr7l.wasm",
              integrity: "sha256-hQvjPINgfcOgOd/NI7Fu0qjNaScbnZcLceXaf/gcbGk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.ame99mt0q7.wasm",
              integrity: "sha256-QkOCnFoiLmdZAY31BgkzqGg2VaMmftpfJKD2LoiplmM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.cew8lqd5d0.wasm",
              integrity: "sha256-BENtA2jbDi9RUnF0+IIKmsKY7eqL3NKs8iQDGXN5PjM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.9p7hlcjfyi.wasm",
              integrity: "sha256-w+nb6DNlje/VczE9JsjilVeucOq2vi6a2hV3HpQlhG8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.uqp0e82xyh.wasm",
              integrity: "sha256-VtBGFLgJnIhVMwK2gOC6RTBFValbxBy36yuOr+dJ/xs=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.5lmwbq8yk6.wasm",
              integrity: "sha256-pzJxFsI/wKvU71zL3GIjXQbEy/Z95tC++pkc+J2ZJRU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.zifjuev74q.wasm",
              integrity: "sha256-paS5Y8Rhi2WhE+iWhzg8WOZrAZevBDbVKNHtQdFVxPU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.ji66lui50a.wasm",
              integrity: "sha256-ezOMfznX6gF/dWRMQGGGd5KaoIiZ0iwxRvCI9qis+zw=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.lm4eeusvun.wasm",
              integrity: "sha256-7ZQZtZpB5aBwTs3JNNXbWgyhylRQGguVsCQNXIl4Rf4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.oaifrh65fj.wasm",
              integrity: "sha256-YInwcSpwbyALyQdfMBajya8FDtcxrCKfR9oZIZniaN4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.iwff5pcnew.wasm",
              integrity: "sha256-vliwnqv+8SbyKhMCF/Ak48+fqMKd4QrJDuUaPG2TbS8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.ifyld8505o.wasm",
              integrity: "sha256-csENVziB3sOcNx15M/V/4hoYR62mYLsXGIUQ+fBWiPU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.9ya8cdnafn.wasm",
              integrity: "sha256-cbnX+A4PXXo2x6wy5aWVuiXr8vZM1H4l5gBsJSqFg5c=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.d67fswk3i6.wasm",
              integrity: "sha256-Fe5OV8goZ1JnQkVBsMWONuxN0pkL3FaeCwSMOa6ZU1Q=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.y3ur2vanb7.wasm",
              integrity: "sha256-0rA5kx4qh7u93j+eH4GvYM0pxgkqvr6xfiNebOLyNiQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.ejycu385ty.wasm",
              integrity: "sha256-Jjwhm9zu5hSXPj4AhHeVfm7+Z6zObu9luBIRhIlgoY8=",
              cache: "force-cache",
            },
          ],
          ja: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.4tcgks10o5.wasm",
              integrity: "sha256-KMfOAmj6UxTsi1hg1OvOlF2g9TbT555R0q2YislPYqM=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.u450w0nw5a.wasm",
              integrity: "sha256-/qnTtAdbw0UYEH6Y77aioqsUsUwDPG2F3aIJFFQusgc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.37vy9ob1q3.wasm",
              integrity: "sha256-b8uYYve6z7kkIeS9MQ3rcx7jreNxh3ApvyWqKrSvbEU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.u4trljqbsv.wasm",
              integrity: "sha256-Po3kmDCf2HdFAZiZg5zGx7q4DvogksnvXg2x2lZ6ndc=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.o4pnpkzvyh.wasm",
              integrity: "sha256-CKiqRseMBaeRpN/5vjVIqq9agyK9+Zy6hbE9x+C2crk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.pl34u765lz.wasm",
              integrity: "sha256-wxqfk5m14ouFtrpamRd/l0Rn9UdrVeRoSJE6q8ZGTpk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.tvdkqcmocn.wasm",
              integrity: "sha256-txI+miuBJMelYtgNLT7Pbj1XKeT8ULP8IR40TdUk3dE=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.b373zc9rnc.wasm",
              integrity: "sha256-p0kCU70/6Y9a6T/usGZMeNxgHmUtzW7k9gi0Hi098aY=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.s4ola3lpm1.wasm",
              integrity: "sha256-bDNqMfLXukU9hO/V5LQn3ufDewoNc51mWw+Bahz71EQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.hyfxzcazmh.wasm",
              integrity: "sha256-9x0ELTpX8lqX5EavOaorks9lHoZS8vFPGH7xwjivaME=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.k6af2j61jq.wasm",
              integrity: "sha256-tBC0KjI2ENOBZlwqNY6W/tmN1O/QFYWXms9rgvdHoy4=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.ahspfjnuj2.wasm",
              integrity: "sha256-khiCzYr1ZvWLfz16OUog96nRjmNZZbzXUjHd54SAAfs=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.8xd468ooos.wasm",
              integrity: "sha256-fIXZCImZdLt89Zb1mOHrkBE4EJ+raUfSyrc1KoWHoJ4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.zhhag2qub8.wasm",
              integrity: "sha256-6RCLxjFhtwTr1Q4yP/K+5FOvJu18LJWWytYnyxTj+hw=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.llsoib6y01.wasm",
              integrity: "sha256-NxtZP3edqavesMzruZ8QZSaLLmfAMP0ZniX0SJ2GvdM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.i2at27ujcn.wasm",
              integrity: "sha256-xsmSBxYHXjLRfc9hu9p6oy3sh0vE6Kpvw1CiUqhSJls=",
              cache: "force-cache",
            },
          ],
          ko: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.cpj72a7us8.wasm",
              integrity: "sha256-gAY8+9+P5grhML6jwziKr3kdA313AG1CRwGAcn+maIQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.5gjur36ajp.wasm",
              integrity: "sha256-9YQp1tQjp1cnK9GUTjh5mSLpkIYiitrHGkF1NVg+Oi4=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.5y20c856ef.wasm",
              integrity: "sha256-E3XcC7fiD8SY2JiHqVs/Gl5RUTUNjLkE4FoQ+ST8NZ0=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.8ra9w7qpzj.wasm",
              integrity: "sha256-tBogs8Gmq71y5wof8nKzW/19uiqiCIuymI4+Ii26vjY=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.htf8rsxs3w.wasm",
              integrity: "sha256-6wJJN5JJ5N24C2R0AQq1PjRtRNUva0bLGrX6d+73cpc=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.944p8f3y9g.wasm",
              integrity: "sha256-58ombWW4L9bVdUP/sRE6bPntGBHC/riVdeM2tluOv+M=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.69ot2vowi6.wasm",
              integrity: "sha256-Cr5t4MDGRSV1uP8EBZTxhrtCBXpY8HrQIDd/gvR9RGU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.zwmcog0j2d.wasm",
              integrity: "sha256-/egA72Apb3KVv9PMYDv31cTRLzGhrBwjR0qZJXVSaFU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.vw121bigev.wasm",
              integrity: "sha256-0bzCbOnuLo6C4qig19xnh5QjRAUsKwz7pfTeQWxrKpQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.s96r0fd3uf.wasm",
              integrity: "sha256-gHu02zmSq9iVk+wE0skogcaCgigl3R9wnwQbaBUZ9i4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.3ty0jhojyu.wasm",
              integrity: "sha256-yTghcwxIdnqgyS3iYUs8GhyD4XyT+gfoxGJazjxZofs=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.s47i10pl4f.wasm",
              integrity: "sha256-nGUq1FzYr885u1HfiUC7giRRbPL+tBn811XD7HVhrII=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.40fz1bd7kw.wasm",
              integrity: "sha256-TIxs+cZ4kyO4VkUSPyU1dJCHZwdwXceUzE0RMkCxvqU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.b01i7uwh8s.wasm",
              integrity: "sha256-m7TLI4qK/UgiK0QqZDRVuNT7B9NinkKM/ivvYh4nNYA=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.id56red6uc.wasm",
              integrity: "sha256-Sly7G1TbPU/PPrCkxqKSADvBaGHH1BAWsJt+HU239qc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.gdy30vmmzp.wasm",
              integrity: "sha256-xIw4SL/XukIW0jmfYD1skjg++IoQP0BR8UP4TZ3bt/Q=",
              cache: "force-cache",
            },
          ],
          pl: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.4k3yybeuzf.wasm",
              integrity: "sha256-fOudh/Oa4QHlqWbMcGZsuxtoLGvlUAekhSstnRjW+Y8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.lqkmfvi6m8.wasm",
              integrity: "sha256-gwJb09+TlXmBUXBjFw5/kw/TbLgVPLdfHI+IEG/9pLA=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.48rbxtj367.wasm",
              integrity: "sha256-bFyamBK8HjfTR738j3ktMUNXfd2JhXJfJaLnz4b1I8c=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.9cbg53octa.wasm",
              integrity: "sha256-aS6lGXrnq2YU87PEd5YAWZ/t55p/KG/df6ylNvuO8NI=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.6nhvbnbgv5.wasm",
              integrity: "sha256-EsKh4FtpMCtk6+zcwvenMg0WMTalSUuJRW8BGS+XRts=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.p3021hxntg.wasm",
              integrity: "sha256-BcIlmwBOKFVniw+dnXwm1pJZ0kssu0c95d/5lvyt2x4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.ewba5f087i.wasm",
              integrity: "sha256-vhvITslUWvBEDHuyzJNHbSgtzzLBsvQmoDXASjKZrTw=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.ws5bd89yhf.wasm",
              integrity: "sha256-4LAMsT/qobuy2RA3/sQ0Fa5wRq3b3ZKHE24yC3VtfdU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.9h38n1nfrp.wasm",
              integrity: "sha256-nQ6tK/88gZgNWgm4QArSEtOpLiB2j8nogZtpWoMgUXE=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.1zv9gk0z71.wasm",
              integrity: "sha256-41WM1csyk8zkISdT6D7mO6TzrO7RJg4bQ7LqBymXWQQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.m7os1h03vq.wasm",
              integrity: "sha256-blFbnfOLb7+5+zmO1/KeudDnS1Hssljl3vWWQRHmcN4=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.dbezage8jh.wasm",
              integrity: "sha256-OZ1v438kDt0mGf5B6gRwSqssiyiylwDZDVBDxGf7d5Q=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.yawhjrhgsp.wasm",
              integrity: "sha256-ygzHT/rx/fJrseaUJmO2qXSxN9bQwxJC6Sq56UxipQQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.5ag38yq3r2.wasm",
              integrity: "sha256-LaUuv0S7+edQMb6s2avO3ofZepX5X0jA4V+5bYC/yXI=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.g098fh4hca.wasm",
              integrity: "sha256-YE3yhmE9IPDIyplhMcpqpyYmU4o+REFy9QOWw2QVSQ4=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.t62wczplxd.wasm",
              integrity: "sha256-62Q4qbh3DZDyY/DNl5wlOJlw3Ivfn9ob1/MUokj/u0o=",
              cache: "force-cache",
            },
          ],
          "pt-BR": [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.gav2uo6r3u.wasm",
              integrity: "sha256-6GiYJvLRh4Rcq7idZNXUnM1HcUibh1L8hD08nhR7QCw=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.oc2abqtksb.wasm",
              integrity: "sha256-mHKgzUMazdnN+/7yiTE9r/mCP/Pz02UO9goyEWyaREM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.9jqkv0cznc.wasm",
              integrity: "sha256-VcLXc4OOAeRZL9IKRA6G/ro1G1nlo/FLesG+S5/ukF8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.mj7q6f6h7c.wasm",
              integrity: "sha256-sqr/YFjBJ3E5JTFeKJqyugUL9V4FWz6azCRJFC++gr8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.8l89wry5p2.wasm",
              integrity: "sha256-RKAdAbAcpIqBSpU/vS9wnbPkeGO4JKhdi+pwyowbjGg=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.7ig58cwfph.wasm",
              integrity: "sha256-z1pFP6FXc0x4VZVEviNfGGIDIqX3dZvD65/hW/e9OOU=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.lh6het03j5.wasm",
              integrity: "sha256-GV0J1ea/jIUfegVxrq0NTKhx0Fkw0VZHl0bkyHyyXIQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.ku5i7s67pm.wasm",
              integrity: "sha256-HGWpDdY6uwJhqW3xuwa149fmhYLgwZMS3xHnjZ2ouIQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.g19k8mnmzy.wasm",
              integrity: "sha256-xHr0D/FA06kXRE0Kf4s2GegKn4dhepdgcRc1jh5QeNY=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.50ovzbuy7e.wasm",
              integrity: "sha256-RfpjIjtzOgUYHEFOQfX7AXKbcSwTq13zpBvGWOW6la4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.ixcv0ay3nm.wasm",
              integrity: "sha256-Npv6brrirlpOzujra2/Ct+sTHBcZ4CuOdD+dQd51xTk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.z13asb3qk6.wasm",
              integrity: "sha256-94U15vPAk+cawiLA4xwQlttE2qs2gcd6z1CmXmlU8S8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.b9qcqn7ere.wasm",
              integrity: "sha256-EeqjLz7lKWrncNtY4KB7ZkTviqMKDkeNsE1fT+9LWsQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.7ubhetcbd3.wasm",
              integrity: "sha256-0cdNwdJW/3Pw5Akxa1jiGXSgMbbQwQGbze//TxEiUpM=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.qu9n8mplwk.wasm",
              integrity: "sha256-Xn50f/UFcje/fOn+AbSR6WTdCypySDtZou1zQo6ggds=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.yn7fbtnk3o.wasm",
              integrity: "sha256-cjz8fUlyNMWo79C9siIoJ27DidXGoQ/gJV++GiBpjiI=",
              cache: "force-cache",
            },
          ],
          ru: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.nrcc2e4am2.wasm",
              integrity: "sha256-o8XpWKxjqakLGqgvFtNqwnBmF8Rtxf7P3566gnmipUY=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.gosbmekuu1.wasm",
              integrity: "sha256-8PPL4iDNX89N3h+4U50U8+2ELQNmvScr88Ko9t/OFgc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.21u8e9q1zi.wasm",
              integrity: "sha256-Bry9XhtdqMkswHkNGKSX5ar7G2KQ4wDBmfAcuA3HVt8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.0uz72ok24p.wasm",
              integrity: "sha256-KBNanMl2b1NqrvyvJt/jB/dVJVETnaQR6ERkDpEUmk4=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.myfn6o2qqo.wasm",
              integrity: "sha256-jnbkcpH9UnsspYhTRPZS+osZ6dAe5iOvsGCcNoWZ+H8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.5bxni4ilqd.wasm",
              integrity: "sha256-YUohM6zc8kZsTDE8gex5HnuYvhx+uVdAntnYedKf+B0=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.chf9bbgbl5.wasm",
              integrity: "sha256-oG2sZruzLewlDIxcVYthNpOnp64XHA4+u32YB4ShNRU=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.g8xbjc51hg.wasm",
              integrity: "sha256-ALAZ7hXY3AAOfvII49GTTKePLZM6UIf6YNQBruD8/gM=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.fv7o2ktvx7.wasm",
              integrity: "sha256-29/0GdOL3ds7O00O07JGOxRQE9ULdkzK72HrpKtQIC0=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.w39tw9n1ik.wasm",
              integrity: "sha256-pJh8mf9UgOHNpnkQvfLnkMYXZ1iHWWaoSZGL+MhOq4U=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.hxmd6eubsb.wasm",
              integrity: "sha256-q+xe9s4iOfvqD+yJYsCHSlq2pNMUlrwTMEpVQlUWW7E=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.7zli4pm55u.wasm",
              integrity: "sha256-w2dNRuPbUTQebmh92Hnz7FJL6ewir12ZlRUN8k9alyo=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.q5sr8omvgi.wasm",
              integrity: "sha256-Tk9dyUOERwleH9K/W23P3YRb1TUhaTcTffo9R6ly3gQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.cu9g59bxmh.wasm",
              integrity: "sha256-LJFOuRDdJquQgOsiOoyW67SEbZIBtkTxSRju7/RpMe4=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.rmmsbkciiw.wasm",
              integrity: "sha256-baNlD1d272Wpvt90OwFNZ3wZ2yWb922TB+5kUOD6e9A=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.j6wc0a7ap0.wasm",
              integrity: "sha256-FXpbwVcxWeP5b2emjgnYG6EcHoFBOHZuQQ6cRGsff04=",
              cache: "force-cache",
            },
          ],
          tr: [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.kvx0k959jv.wasm",
              integrity: "sha256-gJObgWPoDlx6RfpHfL/R0vCzQJIk2x5XvIa8R3IV4ys=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.kbg457kxdf.wasm",
              integrity: "sha256-oEw6nsgGCSlZoL+6vgqi7kMdEDzBlfB+cy1Mah/HKr8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.h6afgd3mmz.wasm",
              integrity: "sha256-twpY7d17VXruRuIKxUeHjlCT9Bn0+NPxxjbNisTYGLI=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.649ukgvwlq.wasm",
              integrity: "sha256-WrLnn3/DJrGZN+ezFPLs3HxW0xCrsdLIrKU/pTY6ztY=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.z0ox0wdqyu.wasm",
              integrity: "sha256-HTgTcu9ko1Pe1UZQNIeKjdEm12F3NTz0MRzLmGkV5xA=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.gaffjbkpf4.wasm",
              integrity: "sha256-KHq36sJBRENOwDg226eYeC8pxsPUoX52A91I0AtbeHE=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.ml3f4685hm.wasm",
              integrity: "sha256-BiTW3DN1dOuCbeezHxkHQwUe0LVJJjNkyYlgVFph7hc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.s2a27qxyrx.wasm",
              integrity: "sha256-fMEB8JFWeH+eQ6gpi6cfQEIe5AtkkAHlqHhItdI9aHg=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.uwr5rnw6nj.wasm",
              integrity: "sha256-cqzoDeNOM3eNSRqZ3HrGAmETOVdq56WOc+YVAEbTFuo=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.r77vgm0rcx.wasm",
              integrity: "sha256-Rx5bBBYlHqp5dIinwJMOzn4CFGXt3F4Ye1Z2tOFEdsg=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.km5wcsi3oi.wasm",
              integrity: "sha256-hL/RQedWr6HPsmJWStmy2xfT/kme0Z37QKH4Aanx/9Q=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.i2bv7bar5i.wasm",
              integrity: "sha256-yhxj7pX0sxU9N8AvnCKQQKrvSzNAcr7KhIlDj5CFGSk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.w8pjjisg5g.wasm",
              integrity: "sha256-kEHDoDqZ91hx430Bmuph4ku62J4xnWjHXTHsCUuBelo=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.nj5s1tsu14.wasm",
              integrity: "sha256-7X9rY+J5Q7n/psbvzNpXVynRHD5lsx9dmPGIlbZHQ+c=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.3cyv569h7z.wasm",
              integrity: "sha256-bXOcRcvCOfjUin1dsaUMBHHsoqHnX+14pAGjBEw74Ms=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.cc23e1w2r3.wasm",
              integrity: "sha256-ZN/W4pUMn5uwnMdK8j9f583t3WLQD63RR1CUE8P1+NQ=",
              cache: "force-cache",
            },
          ],
          "zh-Hans": [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.kex0v7sgxe.wasm",
              integrity: "sha256-5Jt3EL1uB0HKLbQSaxkaffIa+agAJTQqXQxFgZcrODk=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.o689df3e3z.wasm",
              integrity: "sha256-UPUYV4ovQwKv7X7rD0QeMdEx7rOqzWL9w4tkMPdO90o=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.7e0i2ztqr3.wasm",
              integrity: "sha256-f9AidYpypNNAA9lDqhEWbx4Fs0/HDlSoGS9mdRCTxvk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.w62jjlpxv7.wasm",
              integrity: "sha256-2MhNrCgSuThYZ52U2NX8wyOUfcNou2QQPPL7QDZ94GM=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.ihbqrsv9k2.wasm",
              integrity: "sha256-ptc/x8FexzUD3vVLiek+GIcwx3ZKbwFNtuuO7sNhbbw=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.jq2crgo1lg.wasm",
              integrity: "sha256-JWxs3cWQb6DbCI7JLuGHMc/5f1NUGaesdFsvPD/kzls=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.vjz5oymem5.wasm",
              integrity: "sha256-OwNSdiLZMGZVbHrGyBRmKLi6AJozr+RlgGDoEErgess=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.2or8t14y4c.wasm",
              integrity: "sha256-Et/MFkLSBiggcouMBfoQJRagkw2dBPwg/3U31mU1aj8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.veo1c54yui.wasm",
              integrity: "sha256-KU5/afDploPp76FglhFQu5MxklEx16vTDg4LaRbm9FI=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.6fvqzh7itg.wasm",
              integrity: "sha256-kvjfkdtcqy0BAqEoQHAXaVoAw0310zacynRSvDukHKw=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.w9nwprq532.wasm",
              integrity: "sha256-LN1uN6YQ2PfQdkMotwAmad6M+uzgr4n8824/lKIaq9M=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.mytr9tz9c7.wasm",
              integrity: "sha256-koLZ7lJv05Pd3qKAABhhfVk2OkKiFZzppWtwmiX07jc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.zmlh82tzun.wasm",
              integrity: "sha256-NZh/eLPU1H+PPUYgFu5KAuVSGLKzjI8/+mAK31QmTX8=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.5e1qtxae6y.wasm",
              integrity: "sha256-c/XqEgFIBaT8yU+wJ8f2bR4W0wsWzIvxixjrASyvz3E=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.qva8vyz5gm.wasm",
              integrity: "sha256-6l+3YUxVoyarz1aMoMjuLd7rrGtMcVUQWn6x0MJwrPQ=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.zaf60654ig.wasm",
              integrity: "sha256-BUUFVzNw7z7IdmQuxHbMv45bcefki3eROyCrA7NwJJA=",
              cache: "force-cache",
            },
          ],
          "zh-Hant": [
            {
              virtualPath: "Microsoft.CodeAnalysis.resources.wasm",
              name: "Microsoft.CodeAnalysis.resources.yrar4i9vdg.wasm",
              integrity: "sha256-sjQ4amo197q6AJ17eCfe6vihiDrbcL/+mK3qX42wchQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.CSharp.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.resources.cryakz5h77.wasm",
              integrity: "sha256-iKFSKqEIPamQSOjuutzn5tB43AV2wLjTohjvy3ue3Os=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Features.resources.vdif9k557b.wasm",
              integrity: "sha256-0xNMlSzCt5FyrkUYjWOJ4paQ+xh38OtzAoPR6RORdGg=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.utk0gnpo7v.wasm",
              integrity: "sha256-jjr/6pPO5NXtcd9tx4Y64ko1u5dCidKQI8+NF5aVsRQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.Features.resources.v3zxs23t58.wasm",
              integrity: "sha256-+4PaLaOifhRqhvfPwUqgylSes2/PSZM3b4McfGhJoyg=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Scripting.resources.wasm",
              name: "Microsoft.CodeAnalysis.Scripting.resources.ezq6ib1ek3.wasm",
              integrity: "sha256-GrztLj3d54EPCxFDSq62L/aHZk4PWT8zSxUzm6HJ01U=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.resources.8v308xg29e.wasm",
              integrity: "sha256-bECVhKgB3RuGQFhq0K91C6RObW+U9tsDZjRZ0GV2gLc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Features.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Features.resources.5jgxe3hgzw.wasm",
              integrity: "sha256-8ZsV1513pflmYXf+FQimzlBPWhmYcNhxeXjmadC4JL0=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.06jqvgv1gr.wasm",
              integrity: "sha256-iNLEwVHwUEsBnDDZrwhFm/lQeqetRuFv2pWvRKq1fas=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
              name: "Microsoft.CodeAnalysis.Workspaces.resources.leg61p8h90.wasm",
              integrity: "sha256-cwJUY/V5z+60t9AhETsbTIWJaO+chXzKMoMDxX0A4LA=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.CodeAnalysis.NetAnalyzers.resources.wasm",
              name: "Microsoft.CodeAnalysis.NetAnalyzers.resources.b2rxkyv4b6.wasm",
              integrity: "sha256-vazORTVaHzakM9xVOv+UMHiDPN0OZMb7pSq+nHA5SG8=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.ComInterfaceGenerator.resources.wasm",
              name: "Microsoft.Interop.ComInterfaceGenerator.resources.4feo134qf8.wasm",
              integrity: "sha256-AFRXOlIU0RC58cRDD4oq9S2yIK5RmrY6AF9+piOFsCc=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "Microsoft.Interop.LibraryImportGenerator.resources.wasm",
              name: "Microsoft.Interop.LibraryImportGenerator.resources.2olebzafmo.wasm",
              integrity: "sha256-zuNUsDAwi0Hyyv7GtUl59SItjJ0AaP0HO0VYt9ETqNQ=",
              cache: "force-cache",
            },
            {
              virtualPath: "Microsoft.Interop.SourceGeneration.resources.wasm",
              name: "Microsoft.Interop.SourceGeneration.resources.l4li9jhqvs.wasm",
              integrity: "sha256-daD/33IdlBopd7dRSMVfUemDP8rNYd8+I4PHeYVLr4E=",
              cache: "force-cache",
            },
            {
              virtualPath: "System.Text.Json.SourceGeneration.resources.wasm",
              name: "System.Text.Json.SourceGeneration.resources.eo2f84ijoe.wasm",
              integrity: "sha256-ssxPZBMJ0mf8DEdAqL9X+n5UriZxcGZS6or40wNvHfk=",
              cache: "force-cache",
            },
            {
              virtualPath:
                "System.Text.RegularExpressions.Generator.resources.wasm",
              name: "System.Text.RegularExpressions.Generator.resources.90vw2guau8.wasm",
              integrity: "sha256-B7naJoSKHGeO0kxxC+idXx95+FTXAFDt0KOCDyVivYA=",
              cache: "force-cache",
            },
          ],
        },
        libraryInitializers: [
          {
            name: "_content/Microsoft.DotNet.HotReload.WebAssembly.Browser/Microsoft.DotNet.HotReload.WebAssembly.Browser.99zm1jdh75.lib.module.js",
          },
        ],
        modulesAfterConfigLoaded: [
          {
            name: "../_content/Microsoft.DotNet.HotReload.WebAssembly.Browser/Microsoft.DotNet.HotReload.WebAssembly.Browser.99zm1jdh75.lib.module.js",
          },
        ],
      },
      debugLevel: -1,
      globalizationMode: "sharded",
      extensions: {
        blazor: {},
      },
      runtimeConfig: {
        runtimeOptions: {
          configProperties: {
            "Microsoft.AspNetCore.Components.Routing.RegexConstraintSupport": false,
            "System.Diagnostics.Metrics.Meter.IsSupported": false,
            "System.Diagnostics.Tracing.EventSource.IsSupported": false,
            "System.GC.Server": true,
            "System.Globalization.Invariant": false,
            "System.TimeZoneInfo.Invariant": false,
            "System.Linq.Enumerable.IsSizeOptimized": true,
            "System.Net.Http.EnableActivityPropagation": false,
            "System.Net.Http.WasmEnableStreamingResponse": true,
            "System.Net.SocketsHttpHandler.Http3Support": false,
            "System.Resources.UseSystemResourceKeys": true,
            "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
            "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
            "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": true,
          },
        },
      },
    } /*json-end*/,
  ));
export { gt as default, ft as dotnet, mt as exit };
