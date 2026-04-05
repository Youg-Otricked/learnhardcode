(function () {
  "use strict";
  class b {
    static read_bytes(e, r) {
      const s = new b();
      return (
        (s.buf = e.getUint32(r, !0)),
        (s.buf_len = e.getUint32(r + 4, !0)),
        s
      );
    }
    static read_bytes_array(e, r, s) {
      const u = [];
      for (let t = 0; t < s; t++) u.push(b.read_bytes(e, r + 8 * t));
      return u;
    }
  }
  class S {
    static read_bytes(e, r) {
      const s = new S();
      return (
        (s.buf = e.getUint32(r, !0)),
        (s.buf_len = e.getUint32(r + 4, !0)),
        s
      );
    }
    static read_bytes_array(e, r, s) {
      const u = [];
      for (let t = 0; t < s; t++) u.push(S.read_bytes(e, r + 8 * t));
      return u;
    }
  }
  const J = 0n,
    Q = 1n,
    V = 2n,
    j = 2n,
    E = 3n,
    D = 4n;
  class T {
    head_length() {
      return 24;
    }
    name_length() {
      return this.dir_name.byteLength;
    }
    write_head_bytes(e, r) {
      e.setBigUint64(r, BigInt(this.d_next), !0);
      e.setBigUint64(r + 8, BigInt(this.d_ino), !0);
      e.setUint32(r + 16, this.dir_name.length, !0);
      e.setUint8(r + 20, Number(this.d_type));
    }
    write_name_bytes(e, r, s) {
      e.set(this.dir_name.slice(0, Math.min(this.dir_name.byteLength, s)), r);
    }
    constructor(e, r, s, u) {
      const t = new TextEncoder().encode(s);
      
      ((this.d_next = e),
        (this.d_ino = r),
        (this.d_namlen = t.byteLength),
        (this.d_type = u),
        (this.dir_name = t));
    }
  }
  const ee = 1n;
  class B {
    write_bytes(e, r) {
      (e.setUint8(r, this.fs_filetype),
        e.setUint16(r + 2, this.fs_flags, !0),
        e.setBigUint64(r + 8, this.fs_rights_base, !0),
        e.setBigUint64(r + 16, this.fs_rights_inherited, !0));
    }
    constructor(e, r) {
      this.fs_rights_base = 0x3FFFFFFFn;
      this.fs_rights_inherited = 0x3FFFFFFFn;
      this.fs_filetype = e;
      this.fs_flags = r;
    }
  }
  const C = 1n,
    U = 2n,
    v = 4n,
    W = 8n;
    class x {
    write_bytes(e, r) {
      e.setBigUint64(r, BigInt(this.dev), !0);
      e.setBigUint64(r + 8, BigInt(this.ino), !0);
      e.setUint8(r + 16, Number(this.filetype));
      
      e.setBigUint64(r + 24, BigInt(this.nlink), !0);
      e.setBigUint64(r + 32, BigInt(this.size), !0);
      e.setBigUint64(r + 38, BigInt(this.atim), !0);
      e.setBigUint64(r + 46, BigInt(this.mtim), !0);
      e.setBigUint64(r + 52, BigInt(this.ctim), !0);
    }

    constructor(e, r, s) {
      this.dev = 0n;
      this.nlink = 0n;
      this.atim = 0n;
      this.mtim = 0n;
      this.ctim = 0n;
      this.ino = BigInt(e);
      this.filetype = r;
      this.size = BigInt(s);
    }
  }
  const te = 0;
  class re {
    write_bytes(e, r) {
      e.setUint32(r, this.pr_name.byteLength, !0);
    }
    constructor(e) {
      this.pr_name = new TextEncoder().encode(e);
    }
  }
  class I {
    static dir(e) {
      const r = new I();
      return ((r.tag = te), (r.inner = new re(e)), r);
    }
    write_bytes(e, r) {
      (e.setUint32(r, this.tag, !0), this.inner.write_bytes(e, r + 4));
    }
  }
  let ne = class {
    enable(e) {
      this.log = se(e === void 0 ? !0 : e, this.prefix);
    }
    get enabled() {
      return this.isEnabled;
    }
    constructor(e) {
      ((this.isEnabled = e), (this.prefix = "wasi:"), this.enable(e));
    }
  };
  function se(h, e) {
    return h
      ? console.log.bind(console, "%c%s", "color: #265BA0", e)
      : () => {};
  }
  const g = new ne(!1);
  class G extends Error {
    constructor(e) {
      (super("exit with exit code " + e), (this.code = e));
    }
  }
  let ie = class {
    start(e) {
      this.inst = e;
      try {
        return (e.exports._start(), 0);
      } catch (r) {
        if (r instanceof G) return r.code;
        throw r;
      }
    }
    initialize(e) {
      ((this.inst = e), e.exports._initialize && e.exports._initialize());
    }
    constructor(e, r, s, u = {}) {
      ((this.args = []),
        (this.env = []),
        (this.fds = []),
        g.enable(u.debug),
        (this.args = e),
        (this.env = r),
        (this.fds = s));
      const t = this;
      this.wasiImport = {
        args_sizes_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          f.setUint32(n, t.args.length, !0);
          let a = 0;
          for (const o of t.args) a += o.length + 1;
          return (
            f.setUint32(i, a, !0),
            g.log(f.getUint32(n, !0), f.getUint32(i, !0)),
            0
          );
        },
        args_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer),
            a = new Uint8Array(t.inst.exports.memory.buffer),
            o = i;
          for (let l = 0; l < t.args.length; l++) {
            (f.setUint32(n, i, !0), (n += 4));
            const d = new TextEncoder().encode(t.args[l]);
            (a.set(d, i), f.setUint8(i + d.length, 0), (i += d.length + 1));
          }
          return (
            g.enabled && g.log(new TextDecoder("utf-8").decode(a.slice(o, i))),
            0
          );
        },
        environ_sizes_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          f.setUint32(n, t.env.length, !0);
          let a = 0;
          for (const o of t.env) a += o.length + 1;
          return (
            f.setUint32(i, a, !0),
            g.log(f.getUint32(n, !0), f.getUint32(i, !0)),
            0
          );
        },
        environ_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer),
            a = new Uint8Array(t.inst.exports.memory.buffer),
            o = i;
          for (let l = 0; l < t.env.length; l++) {
            (f.setUint32(n, i, !0), (n += 4));
            const d = new TextEncoder().encode(t.env[l]);
            (a.set(d, i), f.setUint8(i + d.length, 0), (i += d.length + 1));
          }
          return (
            g.enabled && g.log(new TextDecoder("utf-8").decode(a.slice(o, i))),
            0
          );
        },
        clock_res_get(n, i) {
          let f;
          switch (n) {
            case 1: {
              f = 5000n;
              break;
            }
            case 0: {
              f = 1000000n;
              break;
            }
            default:
              return 52;
          }
          return (
            new DataView(t.inst.exports.memory.buffer).setBigUint64(i, f, !0),
            0
          );
        },
        clock_time_get(n, i, f) {
          const a = new DataView(t.inst.exports.memory.buffer);
          if (n === 0)
            a.setBigUint64(f, BigInt(new Date().getTime()) * 1000000n, !0);
          else if (n == 1) {
            let o;
            try {
              o = BigInt(Math.round(performance.now() * 1e6));
            } catch {
              o = 0n;
            }
            a.setBigUint64(f, o, !0);
          } else a.setBigUint64(f, 0n, !0);
          return 0;
        },
        fd_advise(n, i, f, a) {
          return t.fds[n] != null ? 0 : 8;
        },
        fd_allocate(n, i, f) {
          return t.fds[n] != null ? t.fds[n].fd_allocate(i, f) : 8;
        },
        fd_close(n) {
          if (t.fds[n] != null) {
            const i = t.fds[n].fd_close();
            return ((t.fds[n] = void 0), i);
          } else return 8;
        },
        fd_datasync(n) {
          return t.fds[n] != null ? t.fds[n].fd_sync() : 8;
        },
        fd_fdstat_get(n, i) {
          if (t.fds[n] != null) {
            const { ret: f, fdstat: a } = t.fds[n].fd_fdstat_get();
            return (
              a != null &&
                a.write_bytes(new DataView(t.inst.exports.memory.buffer), i),
              f
            );
          } else return 8;
        },
        fd_fdstat_set_flags(n, i) {
          return t.fds[n] != null ? t.fds[n].fd_fdstat_set_flags(i) : 8;
        },
        fd_fdstat_set_rights(n, i, f) {
          return t.fds[n] != null ? t.fds[n].fd_fdstat_set_rights(i, f) : 8;
        },
        fd_filestat_get(n, i) {
          if (t.fds[n] != null) {
            const { ret: f, filestat: a } = t.fds[n].fd_filestat_get();
            return (
              a != null &&
                a.write_bytes(new DataView(t.inst.exports.memory.buffer), i),
              f
            );
          } else return 8;
        },
        fd_filestat_set_size(n, i) {
          return t.fds[n] != null ? t.fds[n].fd_filestat_set_size(i) : 8;
        },
        fd_filestat_set_times(n, i, f, a) {
          return t.fds[n] != null ? t.fds[n].fd_filestat_set_times(i, f, a) : 8;
        },
        fd_pread(n, i, f, a, o) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = b.read_bytes_array(l, i, f);
            let R = 0;
            for (const _ of c) {
              const { ret: p, data: y } = t.fds[n].fd_pread(_.buf_len, a);
              if (p != 0) return (l.setUint32(o, R, !0), p);
              if (
                (d.set(y, _.buf),
                (R += y.length),
                (a += BigInt(y.length)),
                y.length != _.buf_len)
              )
                break;
            }
            return (l.setUint32(o, R, !0), 0);
          } else return 8;
        },
        fd_prestat_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: a, prestat: o } = t.fds[n].fd_prestat_get();
            return (o != null && o.write_bytes(f, i), a);
          } else return 8;
        },
        fd_prestat_dir_name(n, i, f) {
          if (t.fds[n] != null) {
            const { ret: a, prestat: o } = t.fds[n].fd_prestat_get();
            if (o == null) return a;
            const l = o.inner.pr_name;
            return (
              new Uint8Array(t.inst.exports.memory.buffer).set(
                l.slice(0, f),
                i,
              ),
              l.byteLength > f ? 37 : 0
            );
          } else return 8;
        },
        fd_pwrite(n, i, f, a, o) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = S.read_bytes_array(l, i, f);
            let R = 0;
            for (const _ of c) {
              const p = d.slice(_.buf, _.buf + _.buf_len),
                { ret: y, nwritten: w } = t.fds[n].fd_pwrite(p, a);
              if (y != 0) return (l.setUint32(o, R, !0), y);
              if (((R += w), (a += BigInt(w)), w != p.byteLength)) break;
            }
            return (l.setUint32(o, R, !0), 0);
          } else return 8;
        },
        fd_read(n, i, f, a) {
          const o = new DataView(t.inst.exports.memory.buffer),
            l = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const d = b.read_bytes_array(o, i, f);
            let c = 0;
            for (const R of d) {
              const { ret: _, data: p } = t.fds[n].fd_read(R.buf_len);
              if (_ != 0) return (o.setUint32(a, c, !0), _);
              if ((l.set(p, R.buf), (c += p.length), p.length != R.buf_len))
                break;
            }
            return (o.setUint32(a, c, !0), 0);
          } else return 8;
        },
        fd_readdir(n, i, f, a, o) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            let c = 0;
            for (;;) {
              const { ret: R, dirent: _ } = t.fds[n].fd_readdir_single(a);
              if (R != 0) return (l.setUint32(o, c, !0), R);
              if (_ == null) break;
              if (f - c < _.head_length()) {
                c = f;
                break;
              }
              const p = new ArrayBuffer(_.head_length());
              if (
                (_.write_head_bytes(new DataView(p), 0),
                d.set(
                  new Uint8Array(p).slice(0, Math.min(p.byteLength, f - c)),
                  i,
                ),
                (i += _.head_length()),
                (c += _.head_length()),
                f - c < _.name_length())
              ) {
                c = f;
                break;
              }
              (_.write_name_bytes(d, i, f - c),
                (i += _.name_length()),
                (c += _.name_length()),
                (a = _.d_next));
            }
            return (l.setUint32(o, c, !0), 0);
          } else return 8;
        },
        fd_renumber(n, i) {
          if (t.fds[n] != null && t.fds[i] != null) {
            const f = t.fds[i].fd_close();
            return f != 0 ? f : ((t.fds[i] = t.fds[n]), (t.fds[n] = void 0), 0);
          } else return 8;
        },
        fd_seek(n, i, f, a) {
          const o = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: l, offset: d } = t.fds[n].fd_seek(i, f);
            return (o.setBigInt64(a, d, !0), l);
          } else return 8;
        },
        fd_sync(n) {
          return t.fds[n] != null ? t.fds[n].fd_sync() : 8;
        },
        fd_tell(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: a, offset: o } = t.fds[n].fd_tell();
            return (f.setBigUint64(i, o, !0), a);
          } else return 8;
        },
        fd_write(n, i, f, a) {
          const o = new DataView(t.inst.exports.memory.buffer),
            l = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const d = S.read_bytes_array(o, i, f);
            let c = 0;
            for (const R of d) {
              const _ = l.slice(R.buf, R.buf + R.buf_len),
                { ret: p, nwritten: y } = t.fds[n].fd_write(_);
              if (p != 0) return (o.setUint32(a, c, !0), p);
              if (((c += y), y != _.byteLength)) break;
            }
            return (o.setUint32(a, c, !0), 0);
          } else return 8;
        },
        path_create_directory(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const o = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_create_directory(o);
          } else return 8;
        },
        path_filestat_get(n, i, f, a, o) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = new TextDecoder("utf-8").decode(d.slice(f, f + a)),
              { ret: R, filestat: _ } = t.fds[n].path_filestat_get(i, c);
            return (_ != null && _.write_bytes(l, o), R);
          } else return 8;
        },
        path_filestat_set_times(n, i, f, a, o, l, d) {
          const c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(f, f + a));
            return t.fds[n].path_filestat_set_times(i, R, o, l, d);
          } else return 8;
        },
        path_link(n, i, f, a, o, l, d) {
          const c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null && t.fds[o] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(f, f + a)),
              _ = new TextDecoder("utf-8").decode(c.slice(l, l + d)),
              { ret: p, inode_obj: y } = t.fds[n].path_lookup(R, i);
            return y == null ? p : t.fds[o].path_link(_, y, !1);
          } else return 8;
        },
        path_open(n, i, f, a, o, l, d, c, R) {
          const _ = new DataView(t.inst.exports.memory.buffer),
            p = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const y = new TextDecoder("utf-8").decode(p.slice(f, f + a));
            console.log("DEBUG: Compiler requesting path:", y);
            g.log(y);
            const { ret: w, fd_obj: _e } = t.fds[n].path_open(i, y, o, 0x3FFFFFFFn, 0x3FFFFFFFn, c);
            if (w != 0) return w;
            t.fds.push(_e);
            const de = t.fds.length - 1;
            return (_.setUint32(R, de, !0), 0);
          } else return 8;
        },
        path_readlink(n, i, f, a, o, l) {
          const d = new DataView(t.inst.exports.memory.buffer),
            c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(i, i + f));
            g.log(R);
            const { ret: _, data: p } = t.fds[n].path_readlink(R);
            if (p != null) {
              const y = new TextEncoder().encode(p);
              if (y.length > o) return (d.setUint32(l, 0, !0), 8);
              (c.set(y, a), d.setUint32(l, y.length, !0));
            }
            return _;
          } else return 8;
        },
        path_remove_directory(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const o = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_remove_directory(o);
          } else return 8;
        },
        path_rename(n, i, f, a, o, l) {
          const d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null && t.fds[a] != null) {
            const c = new TextDecoder("utf-8").decode(d.slice(i, i + f)),
              R = new TextDecoder("utf-8").decode(d.slice(o, o + l));
            let { ret: _, inode_obj: p } = t.fds[n].path_unlink(c);
            if (p == null) return _;
            if (
              ((_ = t.fds[a].path_link(R, p, !0)),
              _ != 0 && t.fds[n].path_link(c, p, !0) != 0)
            )
              throw "path_link should always return success when relinking an inode back to the original place";
            return _;
          } else return 8;
        },
        path_symlink(n, i, f, a, o) {
          const l = new Uint8Array(t.inst.exports.memory.buffer);
          return t.fds[f] != null
            ? (new TextDecoder("utf-8").decode(l.slice(n, n + i)),
              new TextDecoder("utf-8").decode(l.slice(a, a + o)),
              58)
            : 8;
        },
        path_unlink_file(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const o = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_unlink_file(o);
          } else return 8;
        },
        poll_oneoff(n, i, f) {
          throw "async io not supported";
        },
        proc_exit(n) {
          throw new G(n);
        },
        proc_raise(n) {
          throw "raised signal " + n;
        },
        sched_yield() {},
        random_get(n, i) {
          const f = new Uint8Array(t.inst.exports.memory.buffer).subarray(
            n,
            n + i,
          );
          if (
            "crypto" in globalThis &&
            (typeof SharedArrayBuffer > "u" ||
              !(t.inst.exports.memory.buffer instanceof SharedArrayBuffer))
          )
            for (let a = 0; a < i; a += 65536)
              crypto.getRandomValues(f.subarray(a, a + 65536));
          else for (let a = 0; a < i; a++) f[a] = (Math.random() * 256) | 0;
        },
        sock_recv(n, i, f) {
          throw "sockets not supported";
        },
        sock_send(n, i, f) {
          throw "sockets not supported";
        },
        sock_shutdown(n, i) {
          throw "sockets not supported";
        },
        sock_accept(n, i) {
          throw "sockets not supported";
        },
      };
    }
  };
  class F {
    fd_allocate(e, r) {
      return 58;
    }
    fd_close() {
      return 0;
    }
    fd_fdstat_get() {
      return { ret: 58, fdstat: null };
    }
    fd_fdstat_set_flags(e) {
      return 58;
    }
    fd_fdstat_set_rights(e, r) {
      return 58;
    }
    fd_filestat_get() {
      return { ret: 58, filestat: null };
    }
    fd_filestat_set_size(e) {
      return 58;
    }
    fd_filestat_set_times(e, r, s) {
      return 58;
    }
    fd_pread(e, r) {
      return { ret: 58, data: new Uint8Array() };
    }
    fd_prestat_get() {
      return { ret: 58, prestat: null };
    }
    fd_pwrite(e, r) {
      return { ret: 58, nwritten: 0 };
    }
    fd_read(e) {
      return { ret: 58, data: new Uint8Array() };
    }
    fd_readdir_single(e) {
      return { ret: 58, dirent: null };
    }
    fd_seek(e, r) {
      return { ret: 58, offset: 0n };
    }
    fd_sync() {
      return 0;
    }
    fd_tell() {
      return { ret: 58, offset: 0n };
    }
    fd_write(e) {
      return { ret: 58, nwritten: 0 };
    }
    path_create_directory(e) {
      return 58;
    }
    path_filestat_get(e, r) {
      return { ret: 58, filestat: null };
    }
    path_filestat_set_times(e, r, s, u, t) {
      return 58;
    }
    path_link(e, r, s) {
      return 58;
    }
    path_unlink(e) {
      return { ret: 58, inode_obj: null };
    }
    path_lookup(e, r) {
      return { ret: 58, inode_obj: null };
    }
    path_open(e, r, s, u, t, n) {
      return { ret: 54, fd_obj: null };
    }
    path_readlink(e) {
      return { ret: 58, data: null };
    }
    path_remove_directory(e) {
      return 58;
    }
    path_rename(e, r, s) {
      return 58;
    }
    path_unlink_file(e) {
      return 58;
    }
  }
  class O {
    static issue_ino() {
      return O.next_ino++;
    }
    static root_ino() {
      return 0n;
    }
    constructor() {
      this.ino = O.issue_ino();
    }
  }
  O.next_ino = 1n;
  class Y extends F {
    fd_allocate(e, r) {
      if (!(this.file.size > e + r)) {
        const s = new Uint8Array(Number(e + r));
        (s.set(this.file.data, 0), (this.file.data = s));
      }
      return 0;
    }
    fd_fdstat_get() {
      return { ret: 0, fdstat: new B(D, 0) };
    }
    fd_filestat_set_size(e) {
      if (this.file.size > e)
        this.file.data = new Uint8Array(
          this.file.data.buffer.slice(0, Number(e)),
        );
      else {
        const r = new Uint8Array(Number(e));
        (r.set(this.file.data, 0), (this.file.data = r));
      }
      return 0;
    }
    fd_read(e) {
      const r = this.file.data.slice(
        Number(this.file_pos),
        Number(this.file_pos + BigInt(e)),
      );
      return ((this.file_pos += BigInt(r.length)), { ret: 0, data: r });
    }
    fd_pread(e, r) {
      return {
        ret: 0,
        data: this.file.data.slice(Number(r), Number(r + BigInt(e))),
      };
    }
    fd_seek(e, r) {
      let s;
      switch (r) {
        case J:
          s = e;
          break;
        case Q:
          s = this.file_pos + e;
          break;
        case V:
          s = BigInt(this.file.data.byteLength) + e;
          break;
        default:
          return { ret: 28, offset: 0n };
      }
      return s < 0
        ? { ret: 28, offset: 0n }
        : ((this.file_pos = s), { ret: 0, offset: this.file_pos });
    }
    fd_tell() {
      return { ret: 0, offset: this.file_pos };
    }
    fd_write(e) {
      if (this.file.readonly) return { ret: 8, nwritten: 0 };
      if (this.file_pos + BigInt(e.byteLength) > this.file.size) {
        const r = this.file.data;
        ((this.file.data = new Uint8Array(
          Number(this.file_pos + BigInt(e.byteLength)),
        )),
          this.file.data.set(r));
      }
      return (
        this.file.data.set(e, Number(this.file_pos)),
        (this.file_pos += BigInt(e.byteLength)),
        { ret: 0, nwritten: e.byteLength }
      );
    }
    fd_pwrite(e, r) {
      if (this.file.readonly) return { ret: 8, nwritten: 0 };
      if (r + BigInt(e.byteLength) > this.file.size) {
        const s = this.file.data;
        ((this.file.data = new Uint8Array(Number(r + BigInt(e.byteLength)))),
          this.file.data.set(s));
      }
      return (
        this.file.data.set(e, Number(r)),
        { ret: 0, nwritten: e.byteLength }
      );
    }
    fd_filestat_get() {
      return { ret: 0, filestat: this.file.stat() };
    }
    constructor(e) {
      (super(), (this.file_pos = 0n), (this.file = e));
    }
  }
  class H extends F {
    fd_seek(e, r) {
      return { ret: 8, offset: 0n };
    }
    fd_tell() {
      return { ret: 8, offset: 0n };
    }
    fd_allocate(e, r) {
      return 8;
    }
    fd_fdstat_get() {
      const stat = new B(E, 0);
      stat.fs_rights_base = 0x3FFFFFFFn;
      stat.fs_rights_inherited = 0x3FFFFFFFn;
      return { ret: 0, fdstat: stat };
    }
    fd_readdir_single(e) {
      if (
        (g.enabled &&
          (g.log("readdir_single", e), g.log(e, this.dir.contents.keys())),
        e == 0n)
      )
        return { ret: 0, dirent: new T(1n, this.dir.ino, ".", E) };
      if (e == 1n)
        return { ret: 0, dirent: new T(2n, this.dir.parent_ino(), "..", E) };
      if (e >= BigInt(this.dir.contents.size) + 2n)
        return { ret: 0, dirent: null };
      const [r, s] = Array.from(this.dir.contents.entries())[Number(e - 2n)];
      return { ret: 0, dirent: new T(e + 1n, s.ino, r, s.stat().filetype) };
    }
    path_filestat_get(e, r) {
      const { ret: s, path: u } = m.from(r);
      if (u == null) return { ret: s, filestat: null };
      const { ret: t, entry: n } = this.dir.get_entry_for_path(u);
      return n == null
        ? { ret: t, filestat: null }
        : { ret: 0, filestat: n.stat() };
    }
    path_lookup(e, r) {
      const { ret: s, path: u } = m.from(e);
      if (u == null) return { ret: s, inode_obj: null };
      const { ret: t, entry: n } = this.dir.get_entry_for_path(u);
      return n == null ? { ret: t, inode_obj: null } : { ret: 0, inode_obj: n };
    }
    path_open(e, r, s, u, t, n) {
      console.log("--- path_open CALLED with:", r); 
      const oflags = BigInt(s); 
      console.log("Available in this dir:", Array.from(this.dir.contents.keys()));
      const rights_base = BigInt(u);
      const rights_inher = BigInt(t);

      const { ret: i, path: f } = m.from(r);
      if (f == null) return { ret: i, fd_obj: null };
      
      let { ret: a, entry: o } = this.dir.get_entry_for_path(f);
      
      if (o == null) {
        if (a != 44) return { ret: a, fd_obj: null };
        if ((oflags & C) == C) { 
          const { ret: l, entry: d } = this.dir.create_entry_for_path(
            r,
            (oflags & U) == U, 
          );
          if (d == null) return { ret: l, fd_obj: null };
          o = d;
        } else return { ret: 44, fd_obj: null };
      } else if ((oflags & v) == v) {
        return { ret: 20, fd_obj: null };
      }
      console.log("Searching for path:", r, "resolved to entry:", o ? "Found" : "Null");
      return o.path_open(Number(oflags), rights_base, rights_inher); 
    }
    path_create_directory(e) {
      return this.path_open(0, e, C | U, 0n, 0n, 0).ret;
    }
    path_link(e, r, s) {
      const { ret: u, path: t } = m.from(e);
      if (t == null) return u;
      if (t.is_dir) return 44;
      const {
        ret: n,
        parent_entry: i,
        filename: f,
        entry: a,
      } = this.dir.get_parent_dir_and_entry_for_path(t, !0);
      if (i == null || f == null) return n;
      if (a != null) {
        const o = r.stat().filetype == E,
          l = a.stat().filetype == E;
        if (o && l)
          if (s && a instanceof N) {
            if (a.contents.size != 0) return 55;
          } else return 20;
        else {
          if (o && !l) return 54;
          if (!o && l) return 31;
          if (!(r.stat().filetype == D && a.stat().filetype == D)) return 20;
        }
      }
      return !s && r.stat().filetype == E ? 63 : (i.contents.set(f, r), 0);
    }
    path_unlink(e) {
      const { ret: r, path: s } = m.from(e);
      if (s == null) return { ret: r, inode_obj: null };
      const {
        ret: u,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !0);
      return t == null || n == null
        ? { ret: u, inode_obj: null }
        : i == null
          ? { ret: 44, inode_obj: null }
          : (t.contents.delete(n), { ret: 0, inode_obj: i });
    }
    path_unlink_file(e) {
      const { ret: r, path: s } = m.from(e);
      if (s == null) return r;
      const {
        ret: u,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !1);
      return t == null || n == null || i == null
        ? u
        : i.stat().filetype === E
          ? 31
          : (t.contents.delete(n), 0);
    }
    path_remove_directory(e) {
      const { ret: r, path: s } = m.from(e);
      if (s == null) return r;
      const {
        ret: u,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !1);
      return t == null || n == null || i == null
        ? u
        : !(i instanceof N) || i.stat().filetype !== E
          ? 54
          : i.contents.size !== 0
            ? 55
            : t.contents.delete(n)
              ? 0
              : 44;
    }
    fd_filestat_get() {
      return { ret: 0, filestat: this.dir.stat() };
    }
    fd_filestat_set_size(e) {
      return 8;
    }
    fd_read(e) {
      return { ret: 8, data: new Uint8Array() };
    }
    fd_pread(e, r) {
      return { ret: 8, data: new Uint8Array() };
    }
    fd_write(e) {
      return { ret: 8, nwritten: 0 };
    }
    fd_pwrite(e, r) {
      return { ret: 8, nwritten: 0 };
    }
    constructor(e) {
      (super(), (this.dir = e));
    }
  }
  class k extends H {
    fd_prestat_get() {
      return { ret: 0, prestat: I.dir(this.prestat_name) };
    }
    constructor(e, r) {
      (super(new N(r)), (this.prestat_name = e));
    }
  }
  class A extends O {
    path_open(e, r, s) {
      const rights_base = BigInt(e);
      const lookup_flags = BigInt(r);

      if (this.readonly && (lookup_flags & 64n) == 64n)
        return { ret: 63, fd_obj: null };
        
      if ((rights_base & 8n) == 8n) {
        if (this.readonly) return { ret: 63, fd_obj: null };
        this.data = new Uint8Array([]);
      }
      const u = new Y(this);
      return (BigInt(s) & 1n && u.fd_seek(0n, 2n), { ret: 0, fd_obj: u });
    }
    get size() {
      return BigInt(this.data.byteLength);
    }
    stat() {
      return new x(this.ino, D, this.size);
    }
    constructor(e, r) {
      (super(),
        (this.data = new Uint8Array(e)),
        (this.readonly = !!(r != null && r.readonly)));
    }
  }
  let m = class $ {
    static from(e) {
      const r = new $();
      if (e === "" || e === ".") return { ret: 0, path: r };
      r.is_dir = e.endsWith("/");
      let normalizedPath = e;
      if (normalizedPath.startsWith("/")) {
        normalizedPath = normalizedPath.slice(1);
      }

      if (normalizedPath.includes("\0")) return { ret: 28, path: null };
      
      for (const s of normalizedPath.split("/")) {
        if (!(s === "" || s === ".")) {
          if (s === "..") {
            if (r.parts.pop() == null) return { ret: 76, path: null };
            continue;
          }
          r.parts.push(s);
        }
      }
      return { ret: 0, path: r };
    }
    to_path_string() {
      let e = this.parts.join("/");
      return (this.is_dir && (e += "/"), e);
    }
    constructor() {
      ((this.parts = []), (this.is_dir = !1));
    }
  };
  class N extends O {
    parent_ino() {
      return this.parent == null ? O.root_ino() : this.parent.ino;
    }
    path_open(e, r, s) {
      return { ret: 0, fd_obj: new H(this) };
    }
    stat() {
      return new x(this.ino, E, 0n);
    }
    get_entry_for_path(e) {
      let r = this;
      for (const s of e.parts) {
        if (!(r instanceof N)) return { ret: 54, entry: null };
        const u = r.contents.get(s);
        if (u !== void 0) r = u;
        else return (g.log(s), { ret: 44, entry: null });
      }
      return e.is_dir && r.stat().filetype != E
        ? { ret: 54, entry: null }
        : { ret: 0, entry: r };
    }
    get_parent_dir_and_entry_for_path(e, r) {
      const s = e.parts.pop();
      if (s === void 0)
        return { ret: 28, parent_entry: null, filename: null, entry: null };
      const { ret: u, entry: t } = this.get_entry_for_path(e);
      if (t == null)
        return { ret: u, parent_entry: null, filename: null, entry: null };
      if (!(t instanceof N))
        return { ret: 54, parent_entry: null, filename: null, entry: null };
      const n = t.contents.get(s);
      return n === void 0
        ? r
          ? { ret: 0, parent_entry: t, filename: s, entry: null }
          : { ret: 44, parent_entry: null, filename: null, entry: null }
        : e.is_dir && n.stat().filetype != E
          ? { ret: 54, parent_entry: null, filename: null, entry: null }
          : { ret: 0, parent_entry: t, filename: s, entry: n };
    }
    create_entry_for_path(e, r) {
      const { ret: s, path: u } = m.from(e);
      if (u == null) return { ret: s, entry: null };
      let {
        ret: t,
        parent_entry: n,
        filename: i,
        entry: f,
      } = this.get_parent_dir_and_entry_for_path(u, !0);
      if (n == null || i == null) return { ret: t, entry: null };
      if (f != null) return { ret: 20, entry: null };
      g.log("create", u);
      let a;
      return (
        r ? (a = new N(new Map())) : (a = new A(new ArrayBuffer(0))),
        n.contents.set(i, a),
        (f = a),
        { ret: 0, entry: f }
      );
    }
    constructor(e) {
      (super(),
        (this.parent = null),
        e instanceof Array
          ? (this.contents = new Map(e))
          : (this.contents = e));
      for (const r of this.contents.values())
        r instanceof N && (r.parent = this);
    }
  }
  class L extends F {
    fd_filestat_get() {
      return { ret: 0, filestat: new x(this.ino, j, BigInt(0)) };
    }
    fd_fdstat_get() {
      const e = new B(j, 0);
      return ((e.fs_rights_base = BigInt(64)), { ret: 0, fdstat: e });
    }
    fd_write(e) {
      return (this.write(e), { ret: 0, nwritten: e.byteLength });
    }
    static lineBuffered(e) {
      const r = new TextDecoder("utf-8", { fatal: !1 });
      let s = "";
      return new L((u) => {
        s += r.decode(u, { stream: !0 });
        const t = s.split(`
`);
        for (const [n, i] of t.entries()) n < t.length - 1 ? e(i) : (s = i);
      });
    }
    constructor(e) {
      (super(), (this.ino = O.issue_ino()), (this.write = e));
    }
  }
  var P = {},
    z,
    K;
  function fe() {
    if (K) return z;
    K = 1;
    const h = function (e, r, s) {
      var u = r || 0,
        t = s || e.byteLength;
      ((this.bytes = new Uint8Array(e, u, t)), (this.ptr = 0));
    };
    return (
      (h.prototype.peekNumber = function (e) {
        if (e <= 0 || typeof e != "number") return -1;
        for (var r = 0, s = this.ptr + e - 1; s >= this.ptr; )
          ((r <<= 8), (r |= this.bytes[s]), --s);
        return r;
      }),
      (h.prototype.readNumber = function (e) {
        var r = this.peekNumber(e);
        return ((this.ptr += e), r);
      }),
      (h.prototype.peekSignedNumber = function (e) {
        var r = this.peekNumber(e),
          s = Math.pow(2, e * 8 - 1),
          u = s * 2;
        return (r >= s && (r -= u), r);
      }),
      (h.prototype.readSignedNumber = function (e) {
        var r = this.peekSignedNumber(e);
        return ((this.ptr += e), r);
      }),
      (h.prototype.peekBytes = function (e, r) {
        if (e <= 0 || typeof e != "number") return null;
        var s = this.bytes.subarray(this.ptr, this.ptr + e);
        return (r && (this.ptr += e), s);
      }),
      (h.prototype.readBytes = function (e) {
        return this.peekBytes(e, !0);
      }),
      (h.prototype.peekString = function (e) {
        if (e <= 0 || typeof e != "number") return "";
        for (var r = "", s = this.ptr, u = this.ptr + e; s < u; ++s)
          r += String.fromCharCode(this.bytes[s]);
        return r;
      }),
      (h.prototype.readString = function (e) {
        var r = this.peekString(e);
        return ((this.ptr += e), r);
      }),
      (z = h),
      z
    );
  }
  var X;
  function ae() {
    if (X) return P;
    X = 1;
    const h = fe(),
      e = function (s, u) {
        const t = s.readString(u),
          n = t.indexOf("\0");
        return n != -1 ? t.substring(0, n) : t;
      };
    function r(s) {
      ((this.isValid = !1),
        (this.name = e(s, 100)),
        (this.mode = e(s, 8)),
        (this.uid = e(s, 8)),
        (this.gid = e(s, 8)),
        (this.size = parseInt(e(s, 12), 8)),
        (this.mtime = e(s, 12)),
        (this.chksum = e(s, 8)),
        (this.typeflag = e(s, 1)),
        (this.linkname = e(s, 100)),
        (this.maybeMagic = e(s, 6)),
        this.maybeMagic == "ustar"
          ? ((this.version = e(s, 2)),
            (this.uname = e(s, 32)),
            (this.gname = e(s, 32)),
            (this.devmajor = e(s, 8)),
            (this.devminor = e(s, 8)),
            (this.prefix = e(s, 155)),
            this.prefix.length && (this.name = this.prefix + "/" + this.name),
            s.readBytes(12))
          : s.readBytes(249),
        (this.filename = this.name),
        (this.fileData = null),
        +this.typeflag == 0 &&
          ((this.fileData = new Uint8Array(s.bytes.buffer, s.ptr, this.size)),
          this.name.length > 0 &&
            this.fileData &&
            this.fileData.buffer &&
            (this.isValid = !0)),
        (s.ptr += this.size));
      const u = 512 - (s.ptr % 512);
      u > 0 && u < 512 && s.readBytes(u);
    }
    return (
      (P.untar = function (s) {
        const u = new h(s),
          t = [];
        for (; u.peekNumber(4) != 0; ) {
          const n = new r(u);
          n && n.isValid && t.push(n);
        }
        return t;
      }),
      P
    );
  }
  var oe = ae();
  async function ue() {
    let e = await (
      await fetch(new URL("./zig.tar-C4A1Y8ZT.gz", self.location.href))
    ).arrayBuffer();
    const r = new Uint8Array(e).slice(0, 2);
    if (r[0] == 31 && r[1] == 139) {
      const t = new DecompressionStream("gzip");
      e = await new Response(new Response(e).body.pipeThrough(t)).arrayBuffer();
    }
    const s = oe.untar(e);
    let u = new Map();
    for (const t of s) {
      if (!t.filename.startsWith("lib/")) continue;
      const i = t.filename.slice(4).split("/");
      let f = u;
      for (const a of i.slice(0, -1)) {
        if (!f.has(a)) f.set(a, new Map());
        f = f.get(a);
      }
      f.set(i[i.length - 1], t.fileData);
    }
    return q(u);
  }
  function q(h) {
    if (!(h instanceof Map)) {
      return h; 
    }

    return new N(
      [...h.entries()].map(([e, r]) => {
        if (r instanceof Uint8Array) {
          return [e, new A(r)];
        } else if (r instanceof A || r instanceof N) {
          return [e, r];
        } else {
          return [e, q(r)];
        }
      })
    );
  }
  function Z() {
    const h = new TextDecoder("utf-8", { fatal: !1 }),
      e = new L((r) => {
        postMessage({ stderr: h.decode(r, { stream: !0 }) });
      });
    return ((e.fd_pwrite = (r, s) => ({ ret: 70, nwritten: 0 })), e);
  }
  let M = !1;
  async function le(h) {
    if (M) return;
    M = !0;
    const e = await ue();
    const masterMap = new Map();
    masterMap.set("main.zig", new A(new TextEncoder().encode(h)));
    for (const [key, value] of e.contents.entries()) {
      masterMap.set(key, value);
    }
    masterMap.set("cache", new m(new Map()));
    masterMap.set("tmp", new m(new Map())); 
    let r = [
          "zig.wasm",
          "build-exe",
          "main.zig",
          "--zig-lib-dir", "/",
          "--cache-dir", "/cache",
          "-target", "wasm32-wasi",
          "-fno-llvm",
          "-fno-lld",
          "-fno-ubsan-rt",
          "-fno-entry",
          "-rdynamic",
      ],
      s = [],
      u = [
        new Y(new A([])),
        Z(),
        Z(),
        new k(".", masterMap),
      ],
      t = new ie(r, s, u, { debug: !1 });
    console.log(e.contents);
    function findFile(map, name, path = "") {
      for (const [key, value] of map.entries()) {
        const currentPath = path + "/" + key;
        if (key === name) console.log("Found " + name + " at: " + currentPath);
        if (value instanceof N) findFile(value.contents, name, currentPath);
      }
    }
    findFile(e.contents, "std.zig");
    function grepFiles(map, searchTerm, currentPath = "") {
      for (const [key, value] of map.entries()) {
        const fullPath = currentPath + "/" + key;
        if (key.includes(searchTerm)) {
          console.log("MATCH:", fullPath);
        }
        if (value instanceof N) {
          grepFiles(value.contents, searchTerm, fullPath);
        }
      }
    }
    console.log("--- GREP RESULTS ---");
    grepFiles(e.contents, "std."); 
    console.log("-------------------");
    const { instance: n } = await WebAssembly.instantiateStreaming(
      fetch(new URL("./zig-DycCsy1F.wasm", self.location.href)),
      { wasi_snapshot_preview1: t.wasiImport },
    );
    postMessage({
      stderr: `Compiling...
`,
    });
    try {
      const exitCode = t.start(n);
      if (exitCode == 0) {
        const a = t.fds[3].dir.contents.get("main.wasm");
        a && postMessage({ compiled: a.data });
      } else {
        postMessage({ stderr: `Compiler exited with code ${exitCode}` });
      }
    } catch (i) {
      console.error("JS Error during WASM execution:", i);
      postMessage({ stderr: `Internal JS Error: ${i.message}\n${i.stack}` });
      postMessage({ failed: !0 });
    }
    M = !1;
  }
  onmessage = (h) => {
    h.data.run && le(h.data.run);
  };
})();
