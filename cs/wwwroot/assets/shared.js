import { r as e, t } from "./rolldown-runtime.js";
var n = t((e, t) => {
    var n = function (e) {
      if (
        ((e = e || {}),
        (this.Promise = e.Promise || Promise),
        (this.queues = Object.create(null)),
        (this.domainReentrant = e.domainReentrant || !1),
        this.domainReentrant)
      ) {
        if ("undefined" == typeof process || void 0 === process.domain)
          throw new Error(
            "Domain-reentrant locks require `process.domain` to exist. Please flip `opts.domainReentrant = false`, use a NodeJS version that still implements Domain, or install a browser polyfill.",
          );
        this.domains = Object.create(null);
      }
      ((this.timeout = e.timeout || n.DEFAULT_TIMEOUT),
        (this.maxOccupationTime =
          e.maxOccupationTime || n.DEFAULT_MAX_OCCUPATION_TIME),
        (this.maxExecutionTime =
          e.maxExecutionTime || n.DEFAULT_MAX_EXECUTION_TIME),
        e.maxPending === 1 / 0 ||
        (Number.isInteger(e.maxPending) && e.maxPending >= 0)
          ? (this.maxPending = e.maxPending)
          : (this.maxPending = n.DEFAULT_MAX_PENDING));
    };
    ((n.DEFAULT_TIMEOUT = 0),
      (n.DEFAULT_MAX_OCCUPATION_TIME = 0),
      (n.DEFAULT_MAX_EXECUTION_TIME = 0),
      (n.DEFAULT_MAX_PENDING = 1e3),
      (n.prototype.acquire = function (e, t, n, r) {
        if (Array.isArray(e)) return this._acquireBatch(e, t, n, r);
        if ("function" != typeof t)
          throw new Error("You must pass a function to execute");
        var i = null,
          o = null,
          a = null;
        ("function" != typeof n &&
          ((r = n),
          (n = null),
          (a = new this.Promise(function (e, t) {
            ((i = e), (o = t));
          }))),
          (r = r || {}));
        var s = !1,
          u = null,
          c = null,
          l = null,
          m = this,
          f = function (t, r, u) {
            (c && (clearTimeout(c), (c = null)),
              l && (clearTimeout(l), (l = null)),
              t &&
                (m.queues[e] && 0 === m.queues[e].length && delete m.queues[e],
                m.domainReentrant && delete m.domains[e]),
              s ||
                (a ? (r ? o(r) : i(u)) : "function" == typeof n && n(r, u),
                (s = !0)),
              t &&
                m.queues[e] &&
                m.queues[e].length > 0 &&
                m.queues[e].shift()());
          },
          p = function (n) {
            if (s) return f(n);
            (u && (clearTimeout(u), (u = null)),
              m.domainReentrant && n && (m.domains[e] = process.domain));
            var i = r.maxExecutionTime || m.maxExecutionTime;
            if (
              (i &&
                (l = setTimeout(function () {
                  m.queues[e] &&
                    f(n, new Error("Maximum execution time is exceeded " + e));
                }, i)),
              1 === t.length)
            ) {
              var o = !1;
              try {
                t(function (e, t) {
                  o || ((o = !0), f(n, e, t));
                });
              } catch (a) {
                o || ((o = !0), f(n, a));
              }
            } else
              m._promiseTry(function () {
                return t();
              }).then(
                function (e) {
                  f(n, void 0, e);
                },
                function (e) {
                  f(n, e);
                },
              );
          };
        m.domainReentrant && process.domain && (p = process.domain.bind(p));
        var d = r.maxPending || m.maxPending;
        if (m.queues[e])
          if (
            m.domainReentrant &&
            process.domain &&
            process.domain === m.domains[e]
          )
            p(!1);
          else if (m.queues[e].length >= d)
            f(!1, new Error("Too many pending tasks in queue " + e));
          else {
            var h = function () {
              p(!0);
            };
            r.skipQueue ? m.queues[e].unshift(h) : m.queues[e].push(h);
            var E = r.timeout || m.timeout;
            E &&
              (u = setTimeout(function () {
                ((u = null),
                  f(!1, new Error("async-lock timed out in queue " + e)));
              }, E));
          }
        else ((m.queues[e] = []), p(!0));
        var g = r.maxOccupationTime || m.maxOccupationTime;
        return (
          g &&
            (c = setTimeout(function () {
              m.queues[e] &&
                f(
                  !1,
                  new Error(
                    "Maximum occupation time is exceeded in queue " + e,
                  ),
                );
            }, g)),
          a || void 0
        );
      }),
      (n.prototype._acquireBatch = function (e, t, n, r) {
        "function" != typeof n && ((r = n), (n = null));
        var i = this,
          o = e.reduceRight(function (e, t) {
            return (function (e, t) {
              return function (n) {
                i.acquire(e, t, n, r);
              };
            })(t, e);
          }, t);
        if ("function" != typeof n)
          return new this.Promise(function (e, t) {
            1 === o.length
              ? o(function (n, r) {
                  n ? t(n) : e(r);
                })
              : e(o());
          });
        o(n);
      }),
      (n.prototype.isBusy = function (e) {
        return e ? !!this.queues[e] : Object.keys(this.queues).length > 0;
      }),
      (n.prototype._promiseTry = function (e) {
        try {
          return this.Promise.resolve(e());
        } catch (t) {
          return this.Promise.reject(t);
        }
      }),
      (t.exports = n));
  }),
  r = t((e, t) => {
    t.exports = n();
  }),
  i = Symbol("Comlink.proxy"),
  o = Symbol("Comlink.endpoint"),
  a = Symbol("Comlink.releaseProxy"),
  s = Symbol("Comlink.finalizer"),
  u = Symbol("Comlink.thrown"),
  c = (e) => ("object" == typeof e && null !== e) || "function" == typeof e,
  l = new Map([
    [
      "proxy",
      {
        canHandle: (e) => c(e) && e[i],
        serialize(e) {
          const { port1: t, port2: n } = new MessageChannel();
          return (m(e, t), [n, [n]]);
        },
        deserialize: (e) => (e.start(), p(e)),
      },
    ],
    [
      "throw",
      {
        canHandle: (e) => c(e) && u in e,
        serialize({ value: e }) {
          let t;
          return (
            (t =
              e instanceof Error
                ? {
                    isError: !0,
                    value: { message: e.message, name: e.name, stack: e.stack },
                  }
                : { isError: !1, value: e }),
            [t, []]
          );
        },
        deserialize(e) {
          if (e.isError)
            throw Object.assign(new Error(e.value.message), e.value);
          throw e.value;
        },
      },
    ],
  ]);
function m(e, t = globalThis, n = ["*"]) {
  (t.addEventListener("message", function r(i) {
    if (!i || !i.data) return;
    if (
      !(function (e, t) {
        for (const n of e) {
          if (t === n || "*" === n) return !0;
          if (n instanceof RegExp && n.test(t)) return !0;
        }
        return !1;
      })(n, i.origin)
    )
      return void console.warn(
        `Invalid origin '${i.origin}' for comlink proxy`,
      );
    const { id: o, type: a, path: c } = Object.assign({ path: [] }, i.data),
      l = (i.data.argumentList || []).map(b);
    let p;
    try {
      const t = c.slice(0, -1).reduce((e, t) => e[t], e),
        n = c.reduce((e, t) => e[t], e);
      switch (a) {
        case "GET":
          p = n;
          break;
        case "SET":
          ((t[c.slice(-1)[0]] = b(i.data.value)), (p = !0));
          break;
        case "APPLY":
          p = n.apply(t, l);
          break;
        case "CONSTRUCT":
          p = w(new n(...l));
          break;
        case "ENDPOINT":
          {
            const { port1: t, port2: n } = new MessageChannel();
            (m(e, n),
              (p = (function (e, t) {
                return (T.set(e, t), e);
              })(t, [t])));
          }
          break;
        case "RELEASE":
          p = void 0;
          break;
        default:
          return;
      }
    } catch (d) {
      p = { value: d, [u]: 0 };
    }
    Promise.resolve(p)
      .catch((e) => ({ value: e, [u]: 0 }))
      .then((n) => {
        const [i, u] = x(n);
        (t.postMessage(Object.assign(Object.assign({}, i), { id: o }), u),
          "RELEASE" === a &&
            (t.removeEventListener("message", r),
            f(t),
            s in e && "function" == typeof e[s] && e[s]()));
      })
      .catch((e) => {
        const [n, r] = x({
          value: new TypeError("Unserializable return value"),
          [u]: 0,
        });
        t.postMessage(Object.assign(Object.assign({}, n), { id: o }), r);
      });
  }),
    t.start && t.start());
}
function f(e) {
  (function (e) {
    return "MessagePort" === e.constructor.name;
  })(e) && e.close();
}
function p(e, t) {
  const n = new Map();
  return (
    e.addEventListener("message", function (e) {
      const { data: t } = e;
      if (!t || !t.id) return;
      const r = n.get(t.id);
      if (r)
        try {
          r(t);
        } finally {
          n.delete(t.id);
        }
    }),
    y(e, n, [], t)
  );
}
function d(e) {
  if (e) throw new Error("Proxy has been released and is not useable");
}
function h(e) {
  return P(e, new Map(), { type: "RELEASE" }).then(() => {
    f(e);
  });
}
var E = new WeakMap(),
  g =
    "FinalizationRegistry" in globalThis &&
    new FinalizationRegistry((e) => {
      const t = (E.get(e) || 0) - 1;
      (E.set(e, t), 0 === t && h(e));
    });
function y(e, t, n = [], r = function () {}) {
  let i = !1;
  const s = new Proxy(r, {
    get(r, o) {
      if ((d(i), o === a))
        return () => {
          (!(function (e) {
            g && g.unregister(e);
          })(s),
            h(e),
            t.clear(),
            (i = !0));
        };
      if ("then" === o) {
        if (0 === n.length) return { then: () => s };
        const r = P(e, t, {
          type: "GET",
          path: n.map((e) => e.toString()),
        }).then(b);
        return r.then.bind(r);
      }
      return y(e, t, [...n, o]);
    },
    set(r, o, a) {
      d(i);
      const [s, u] = x(a);
      return P(
        e,
        t,
        { type: "SET", path: [...n, o].map((e) => e.toString()), value: s },
        u,
      ).then(b);
    },
    apply(r, a, s) {
      d(i);
      const u = n[n.length - 1];
      if (u === o) return P(e, t, { type: "ENDPOINT" }).then(b);
      if ("bind" === u) return y(e, t, n.slice(0, -1));
      const [c, l] = v(s);
      return P(
        e,
        t,
        { type: "APPLY", path: n.map((e) => e.toString()), argumentList: c },
        l,
      ).then(b);
    },
    construct(r, o) {
      d(i);
      const [a, s] = v(o);
      return P(
        e,
        t,
        {
          type: "CONSTRUCT",
          path: n.map((e) => e.toString()),
          argumentList: a,
        },
        s,
      ).then(b);
    },
  });
  return (
    (function (e, t) {
      const n = (E.get(t) || 0) + 1;
      (E.set(t, n), g && g.register(e, t, e));
    })(s, e),
    s
  );
}
function v(e) {
  const t = e.map(x);
  return [
    t.map((e) => e[0]),
    ((n = t.map((e) => e[1])), Array.prototype.concat.apply([], n)),
  ];
  var n;
}
var T = new WeakMap();
function w(e) {
  return Object.assign(e, { [i]: !0 });
}
function x(e) {
  for (const [t, n] of l)
    if (n.canHandle(e)) {
      const [r, i] = n.serialize(e);
      return [{ type: "HANDLER", name: t, value: r }, i];
    }
  return [{ type: "RAW", value: e }, T.get(e) || []];
}
function b(e) {
  switch (e.type) {
    case "HANDLER":
      return l.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function P(e, t, n, r) {
  return new Promise((i) => {
    const o = new Array(4)
      .fill(0)
      .map(() =>
        Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16),
      )
      .join("-");
    (t.set(o, i),
      e.start && e.start(),
      e.postMessage(Object.assign({ id: o }, n), r));
  });
}
var A = {},
  O = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      const e = document.getElementsByTagName("link"),
        o = document.querySelector("meta[property=csp-nonce]"),
        a = o?.nonce || o?.getAttribute("nonce");
      ((i = t.map((t) => {
        if (
          ((t = (function (e, t) {
            return new URL(e, t).href;
          })(t, n)),
          t in A)
        )
          return;
        A[t] = !0;
        const r = t.endsWith(".css"),
          i = r ? '[rel="stylesheet"]' : "";
        if (n)
          for (let n = e.length - 1; n >= 0; n--) {
            const i = e[n];
            if (i.href === t && (!r || "stylesheet" === i.rel)) return;
          }
        else if (document.querySelector(`link[href="${t}"]${i}`)) return;
        const o = document.createElement("link");
        return (
          (o.rel = r ? "stylesheet" : "modulepreload"),
          r || (o.as = "script"),
          (o.crossOrigin = ""),
          (o.href = t),
          a && o.setAttribute("nonce", a),
          document.head.appendChild(o),
          r
            ? new Promise((e, n) => {
                (o.addEventListener("load", e),
                  o.addEventListener("error", () =>
                    n(new Error(`Unable to preload CSS for ${t}`)),
                  ));
              })
            : void 0
        );
      })),
        (r = Promise.all(
          i.map((e) =>
            Promise.resolve(e).then(
              (e) => ({ status: "fulfilled", value: e }),
              (e) => ({ status: "rejected", reason: e }),
            ),
          ),
        )));
    }
    var i;
    function o(e) {
      const t = new Event("vite:preloadError", { cancelable: !0 });
      if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
        throw e;
    }
    return r.then((t) => {
      for (const e of t || []) "rejected" === e.status && o(e.reason);
      return e().catch(o);
    });
  },
  _ = e(r()),
  M = { expose: m, wrap: p, proxy: w };
function q(e) {
  return O(() => import(e), [], import.meta.url);
}
export { O as i, q as n, _ as r, M as t };
//# sourceMappingURL=shared.js.map
