(function () {
  "use strict";
  class w {
    static read_bytes(e, r) {
      const s = new w();
      return (
        (s.buf = e.getUint32(r, !0)),
        (s.buf_len = e.getUint32(r + 4, !0)),
        s
      );
    }
    static read_bytes_array(e, r, s) {
      const o = [];
      for (let t = 0; t < s; t++) o.push(w.read_bytes(e, r + 8 * t));
      return o;
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
      const o = [];
      for (let t = 0; t < s; t++) o.push(S.read_bytes(e, r + 8 * t));
      return o;
    }
  }
  const q = 0,
    $ = 1,
    P = 2,
    V = 2,
    N = 3,
    D = 4;
  class A {
    head_length() {
      return 24;
    }
    name_length() {
      return this.dir_name.byteLength;
    }
    write_head_bytes(e, r) {
      (e.setBigUint64(r, this.d_next, !0),
        e.setBigUint64(r + 8, this.d_ino, !0),
        e.setUint32(r + 16, this.dir_name.length, !0),
        e.setUint8(r + 20, this.d_type));
    }
    write_name_bytes(e, r, s) {
      e.set(this.dir_name.slice(0, Math.min(this.dir_name.byteLength, s)), r);
    }
    constructor(e, r, s, o) {
      const t = new TextEncoder().encode(s);
      ((this.d_next = e),
        (this.d_ino = r),
        (this.d_namlen = t.byteLength),
        (this.d_type = o),
        (this.dir_name = t));
    }
  }
  const J = 1;
  class T {
    write_bytes(e, r) {
      (e.setUint8(r, this.fs_filetype),
        e.setUint16(r + 2, this.fs_flags, !0),
        e.setBigUint64(r + 8, this.fs_rights_base, !0),
        e.setBigUint64(r + 16, this.fs_rights_inherited, !0));
    }
    constructor(e, r, s, u) {
      this.fs_rights_base = 0x3FFFFFFFn;
      this.fs_rights_inherited = 0x3FFFFFFFn;
      this.fs_filetype = e;
      this.fs_flags = r;
    }
  }
  const B = 1,
    U = 2,
    z = 4,
    M = 8;
  class C {
    write_bytes(e, r) {
      (e.setBigUint64(r, this.dev, !0),
        e.setBigUint64(r + 8, this.ino, !0),
        e.setUint8(r + 16, this.filetype),
        e.setBigUint64(r + 24, this.nlink, !0),
        e.setBigUint64(r + 32, this.size, !0),
        e.setBigUint64(r + 38, this.atim, !0),
        e.setBigUint64(r + 46, this.mtim, !0),
        e.setBigUint64(r + 52, this.ctim, !0));
    }
    constructor(e, r, s) {
      ((this.dev = 0n),
        (this.nlink = 0n),
        (this.atim = 0n),
        (this.mtim = 0n),
        (this.ctim = 0n),
        (this.ino = e),
        (this.filetype = r),
        (this.size = s));
    }
  }
  const Q = 0;
  class Z {
    write_bytes(e, r) {
      e.setUint32(r, this.pr_name.byteLength, !0);
    }
    constructor(e) {
      this.pr_name = new TextEncoder().encode(e);
    }
  }
  class x {
    static dir(e) {
      const r = new x();
      return ((r.tag = Q), (r.inner = new Z(e)), r);
    }
    write_bytes(e, r) {
      (e.setUint32(r, this.tag, !0), this.inner.write_bytes(e, r + 4));
    }
  }
  let ee = class {
    enable(e) {
      this.log = te(e === void 0 ? !0 : e, this.prefix);
    }
    get enabled() {
      return this.isEnabled;
    }
    constructor(e) {
      ((this.isEnabled = e), (this.prefix = "wasi:"), this.enable(e));
    }
  };
  function te(h, e) {
    return h
      ? console.log.bind(console, "%c%s", "color: #265BA0", e)
      : () => {};
  }
  const E = new ee(!1);
  class j extends Error {
    constructor(e) {
      (super("exit with exit code " + e), (this.code = e));
    }
  }
  let re = class {
    start(e) {
      this.inst = e;
      try {
        return (e.exports._start(), 0);
      } catch (r) {
        if (r instanceof j) return r.code;
        throw r;
      }
    }
    initialize(e) {
      ((this.inst = e), e.exports._initialize && e.exports._initialize());
    }
    constructor(e, r, s, o = {}) {
      ((this.args = []),
        (this.env = []),
        (this.fds = []),
        E.enable(o.debug),
        (this.args = e),
        (this.env = r),
        (this.fds = s));
      const t = this;
      this.wasiImport = {
        args_sizes_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          f.setUint32(n, t.args.length, !0);
          let a = 0;
          for (const u of t.args) a += u.length + 1;
          return (
            f.setUint32(i, a, !0),
            E.log(f.getUint32(n, !0), f.getUint32(i, !0)),
            0
          );
        },
        args_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer),
            a = new Uint8Array(t.inst.exports.memory.buffer),
            u = i;
          for (let l = 0; l < t.args.length; l++) {
            (f.setUint32(n, i, !0), (n += 4));
            const d = new TextEncoder().encode(t.args[l]);
            (a.set(d, i), f.setUint8(i + d.length, 0), (i += d.length + 1));
          }
          return (
            E.enabled && E.log(new TextDecoder("utf-8").decode(a.slice(u, i))),
            0
          );
        },
        environ_sizes_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          f.setUint32(n, t.env.length, !0);
          let a = 0;
          for (const u of t.env) a += u.length + 1;
          return (
            f.setUint32(i, a, !0),
            E.log(f.getUint32(n, !0), f.getUint32(i, !0)),
            0
          );
        },
        environ_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer),
            a = new Uint8Array(t.inst.exports.memory.buffer),
            u = i;
          for (let l = 0; l < t.env.length; l++) {
            (f.setUint32(n, i, !0), (n += 4));
            const d = new TextEncoder().encode(t.env[l]);
            (a.set(d, i), f.setUint8(i + d.length, 0), (i += d.length + 1));
          }
          return (
            E.enabled && E.log(new TextDecoder("utf-8").decode(a.slice(u, i))),
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
            let u;
            try {
              u = BigInt(Math.round(performance.now() * 1e6));
            } catch {
              u = 0n;
            }
            a.setBigUint64(f, u, !0);
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
        fd_pread(n, i, f, a, u) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = w.read_bytes_array(l, i, f);
            let R = 0;
            for (const _ of c) {
              const { ret: p, data: y } = t.fds[n].fd_pread(_.buf_len, a);
              if (p != 0) return (l.setUint32(u, R, !0), p);
              if (
                (d.set(y, _.buf),
                (R += y.length),
                (a += BigInt(y.length)),
                y.length != _.buf_len)
              )
                break;
            }
            return (l.setUint32(u, R, !0), 0);
          } else return 8;
        },
        fd_prestat_get(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: a, prestat: u } = t.fds[n].fd_prestat_get();
            return (u != null && u.write_bytes(f, i), a);
          } else return 8;
        },
        fd_prestat_dir_name(n, i, f) {
          if (t.fds[n] != null) {
            const { ret: a, prestat: u } = t.fds[n].fd_prestat_get();
            if (u == null) return a;
            const l = u.inner.pr_name;
            return (
              new Uint8Array(t.inst.exports.memory.buffer).set(
                l.slice(0, f),
                i,
              ),
              l.byteLength > f ? 37 : 0
            );
          } else return 8;
        },
        fd_pwrite(n, i, f, a, u) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = S.read_bytes_array(l, i, f);
            let R = 0;
            for (const _ of c) {
              const p = d.slice(_.buf, _.buf + _.buf_len),
                { ret: y, nwritten: b } = t.fds[n].fd_pwrite(p, a);
              if (y != 0) return (l.setUint32(u, R, !0), y);
              if (((R += b), (a += BigInt(b)), b != p.byteLength)) break;
            }
            return (l.setUint32(u, R, !0), 0);
          } else return 8;
        },
        fd_read(n, i, f, a) {
          const u = new DataView(t.inst.exports.memory.buffer),
            l = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const d = w.read_bytes_array(u, i, f);
            let c = 0;
            for (const R of d) {
              const { ret: _, data: p } = t.fds[n].fd_read(R.buf_len);
              if (_ != 0) return (u.setUint32(a, c, !0), _);
              if ((l.set(p, R.buf), (c += p.length), p.length != R.buf_len))
                break;
            }
            return (u.setUint32(a, c, !0), 0);
          } else return 8;
        },
        fd_readdir(n, i, f, a, u) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            let c = 0;
            for (;;) {
              const { ret: R, dirent: _ } = t.fds[n].fd_readdir_single(a);
              if (R != 0) return (l.setUint32(u, c, !0), R);
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
            return (l.setUint32(u, c, !0), 0);
          } else return 8;
        },
        fd_renumber(n, i) {
          if (t.fds[n] != null && t.fds[i] != null) {
            const f = t.fds[i].fd_close();
            return f != 0 ? f : ((t.fds[i] = t.fds[n]), (t.fds[n] = void 0), 0);
          } else return 8;
        },
        fd_seek(n, i, f, a) {
          const u = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: l, offset: d } = t.fds[n].fd_seek(i, f);
            return (u.setBigInt64(a, d, !0), l);
          } else return 8;
        },
        fd_sync(n) {
          return t.fds[n] != null ? t.fds[n].fd_sync() : 8;
        },
        fd_tell(n, i) {
          const f = new DataView(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const { ret: a, offset: u } = t.fds[n].fd_tell();
            return (f.setBigUint64(i, u, !0), a);
          } else return 8;
        },
        fd_write(n, i, f, a) {
          const u = new DataView(t.inst.exports.memory.buffer),
            l = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const d = S.read_bytes_array(u, i, f);
            let c = 0;
            for (const R of d) {
              const _ = l.slice(R.buf, R.buf + R.buf_len),
                { ret: p, nwritten: y } = t.fds[n].fd_write(_);
              if (p != 0) return (u.setUint32(a, c, !0), p);
              if (((c += y), y != _.byteLength)) break;
            }
            return (u.setUint32(a, c, !0), 0);
          } else return 8;
        },
        path_create_directory(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const u = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_create_directory(u);
          } else return 8;
        },
        path_filestat_get(n, i, f, a, u) {
          const l = new DataView(t.inst.exports.memory.buffer),
            d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const c = new TextDecoder("utf-8").decode(d.slice(f, f + a)),
              { ret: R, filestat: _ } = t.fds[n].path_filestat_get(i, c);
            return (_ != null && _.write_bytes(l, u), R);
          } else return 8;
        },
        path_filestat_set_times(n, i, f, a, u, l, d) {
          const c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(f, f + a));
            return t.fds[n].path_filestat_set_times(i, R, u, l, d);
          } else return 8;
        },
        path_link(n, i, f, a, u, l, d) {
          const c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null && t.fds[u] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(f, f + a)),
              _ = new TextDecoder("utf-8").decode(c.slice(l, l + d)),
              { ret: p, inode_obj: y } = t.fds[n].path_lookup(R, i);
            return y == null ? p : t.fds[u].path_link(_, y, !1);
          } else return 8;
        },
        path_open(n, i, f, a, u, l, d, c, R) {
          const _ = new DataView(t.inst.exports.memory.buffer),
            p = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const y = new TextDecoder("utf-8").decode(p.slice(f, f + a));
            E.log(y);
            const { ret: b, fd_obj: ae } = t.fds[n].path_open(i, y, u, l, d, c);
            if (b != 0) return b;
            t.fds.push(ae);
            const ue = t.fds.length - 1;
            return (_.setUint32(R, ue, !0), 0);
          } else return 8;
        },
        path_readlink(n, i, f, a, u, l) {
          const d = new DataView(t.inst.exports.memory.buffer),
            c = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const R = new TextDecoder("utf-8").decode(c.slice(i, i + f));
            E.log(R);
            const { ret: _, data: p } = t.fds[n].path_readlink(R);
            if (p != null) {
              const y = new TextEncoder().encode(p);
              if (y.length > u) return (d.setUint32(l, 0, !0), 8);
              (c.set(y, a), d.setUint32(l, y.length, !0));
            }
            return _;
          } else return 8;
        },
        path_remove_directory(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const u = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_remove_directory(u);
          } else return 8;
        },
        path_rename(n, i, f, a, u, l) {
          const d = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null && t.fds[a] != null) {
            const c = new TextDecoder("utf-8").decode(d.slice(i, i + f)),
              R = new TextDecoder("utf-8").decode(d.slice(u, u + l));
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
        path_symlink(n, i, f, a, u) {
          const l = new Uint8Array(t.inst.exports.memory.buffer);
          return t.fds[f] != null
            ? (new TextDecoder("utf-8").decode(l.slice(n, n + i)),
              new TextDecoder("utf-8").decode(l.slice(a, a + u)),
              58)
            : 8;
        },
        path_unlink_file(n, i, f) {
          const a = new Uint8Array(t.inst.exports.memory.buffer);
          if (t.fds[n] != null) {
            const u = new TextDecoder("utf-8").decode(a.slice(i, i + f));
            return t.fds[n].path_unlink_file(u);
          } else return 8;
        },
        poll_oneoff(n, i, f) {
          throw "async io not supported";
        },
        proc_exit(n) {
          throw new j(n);
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
  class I {
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
    path_filestat_set_times(e, r, s, o, t) {
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
    path_open(e, r, s, o, t, n) {
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
  class g {
    static issue_ino() {
      return g.next_ino++;
    }
    static root_ino() {
      return 0n;
    }
    constructor() {
      this.ino = g.issue_ino();
    }
  }
  g.next_ino = 1n;
  class v extends I {
    fd_allocate(e, r) {
      if (!(this.file.size > e + r)) {
        const s = new Uint8Array(Number(e + r));
        (s.set(this.file.data, 0), (this.file.data = s));
      }
      return 0;
    }
    fd_fdstat_get() {
      return { ret: 0, fdstat: new T(D, 0) };
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
        case q:
          s = e;
          break;
        case $:
          s = this.file_pos + e;
          break;
        case P:
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
  class W extends I {
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
      const stat = new T(N, 0);
      stat.fs_rights_base = 0x3FFFFFFFn;
      stat.fs_rights_inherited = 0x3FFFFFFFn;
      return { ret: 0, fdstat: stat };
    }
    fd_readdir_single(e) {
      if (
        (E.enabled &&
          (E.log("readdir_single", e), E.log(e, this.dir.contents.keys())),
        e == 0n)
      )
        return { ret: 0, dirent: new A(1n, this.dir.ino, ".", N) };
      if (e == 1n)
        return { ret: 0, dirent: new A(2n, this.dir.parent_ino(), "..", N) };
      if (e >= BigInt(this.dir.contents.size) + 2n)
        return { ret: 0, dirent: null };
      const [r, s] = Array.from(this.dir.contents.entries())[Number(e - 2n)];
      return { ret: 0, dirent: new A(e + 1n, s.ino, r, s.stat().filetype) };
    }
    path_filestat_get(e, r) {
      const { ret: s, path: o } = O.from(r);
      if (o == null) return { ret: s, filestat: null };
      const { ret: t, entry: n } = this.dir.get_entry_for_path(o);
      return n == null
        ? { ret: t, filestat: null }
        : { ret: 0, filestat: n.stat() };
    }
    path_lookup(e, r) {
      const { ret: s, path: o } = O.from(e);
      if (o == null) return { ret: s, inode_obj: null };
      const { ret: t, entry: n } = this.dir.get_entry_for_path(o);
      return n == null ? { ret: t, inode_obj: null } : { ret: 0, inode_obj: n };
    }
    path_open(e, r, s, o, t, n) {
      const { ret: i, path: f } = O.from(r);
      if (f == null) return { ret: i, fd_obj: null };
      let { ret: a, entry: u } = this.dir.get_entry_for_path(f);
      if (u == null) {
        if (a != 44) return { ret: a, fd_obj: null };
        if ((s & B) == B) {
          const { ret: l, entry: d } = this.dir.create_entry_for_path(
            r,
            (s & U) == U,
          );
          if (d == null) return { ret: l, fd_obj: null };
          u = d;
        } else return { ret: 44, fd_obj: null };
      } else if ((s & z) == z) return { ret: 20, fd_obj: null };
      return (s & U) == U && u.stat().filetype !== N
        ? { ret: 54, fd_obj: null }
        : u.path_open(s, o, n);
    }
    path_create_directory(e) {
      return this.path_open(0, e, B | U, 0n, 0n, 0).ret;
    }
    path_link(e, r, s) {
      const { ret: o, path: t } = O.from(e);
      if (t == null) return o;
      if (t.is_dir) return 44;
      const {
        ret: n,
        parent_entry: i,
        filename: f,
        entry: a,
      } = this.dir.get_parent_dir_and_entry_for_path(t, !0);
      if (i == null || f == null) return n;
      if (a != null) {
        const u = r.stat().filetype == N,
          l = a.stat().filetype == N;
        if (u && l)
          if (s && a instanceof m) {
            if (a.contents.size != 0) return 55;
          } else return 20;
        else {
          if (u && !l) return 54;
          if (!u && l) return 31;
          if (!(r.stat().filetype == D && a.stat().filetype == D)) return 20;
        }
      }
      return !s && r.stat().filetype == N ? 63 : (i.contents.set(f, r), 0);
    }
    path_unlink(e) {
      const { ret: r, path: s } = O.from(e);
      if (s == null) return { ret: r, inode_obj: null };
      const {
        ret: o,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !0);
      return t == null || n == null
        ? { ret: o, inode_obj: null }
        : i == null
          ? { ret: 44, inode_obj: null }
          : (t.contents.delete(n), { ret: 0, inode_obj: i });
    }
    path_unlink_file(e) {
      const { ret: r, path: s } = O.from(e);
      if (s == null) return r;
      const {
        ret: o,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !1);
      return t == null || n == null || i == null
        ? o
        : i.stat().filetype === N
          ? 31
          : (t.contents.delete(n), 0);
    }
    path_remove_directory(e) {
      const { ret: r, path: s } = O.from(e);
      if (s == null) return r;
      const {
        ret: o,
        parent_entry: t,
        filename: n,
        entry: i,
      } = this.dir.get_parent_dir_and_entry_for_path(s, !1);
      return t == null || n == null || i == null
        ? o
        : !(i instanceof m) || i.stat().filetype !== N
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
  class ne extends W {
    fd_prestat_get() {
      return { ret: 0, prestat: x.dir(this.prestat_name) };
    }
    constructor(e, r) {
      (super(new m(r)), (this.prestat_name = e));
    }
  }
  class G extends g {
    path_open(e, r, s) {
      if (this.readonly && (r & BigInt(64)) == BigInt(64))
        return { ret: 63, fd_obj: null };
      if ((e & M) == M) {
        if (this.readonly) return { ret: 63, fd_obj: null };
        this.data = new Uint8Array([]);
      }
      const o = new v(this);
      return (s & J && o.fd_seek(0n, P), { ret: 0, fd_obj: o });
    }
    get size() {
      return BigInt(this.data.byteLength);
    }
    stat() {
      return new C(this.ino, D, this.size);
    }
    constructor(e, r) {
      (super(),
        (this.data = new Uint8Array(e)),
        (this.readonly = !!(r != null && r.readonly)));
    }
  }
  let O = class X {
    static from(e) {
      const r = new X();
      if (((r.is_dir = e.endsWith("/")), e.startsWith("/")))
        return { ret: 76, path: null };
      if (e.includes("\0")) return { ret: 28, path: null };
      for (const s of e.split("/"))
        if (!(s === "" || s === ".")) {
          if (s === "..") {
            if (r.parts.pop() == null) return { ret: 76, path: null };
            continue;
          }
          r.parts.push(s);
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
  class m extends g {
    parent_ino() {
      return this.parent == null ? g.root_ino() : this.parent.ino;
    }
    path_open(e, r, s) {
      return { ret: 0, fd_obj: new W(this) };
    }
    stat() {
      return new C(this.ino, N, 0n);
    }
    get_entry_for_path(e) {
      let r = this;
      for (const s of e.parts) {
        if (!(r instanceof m)) return { ret: 54, entry: null };
        const o = r.contents.get(s);
        if (o !== void 0) r = o;
        else return (E.log(s), { ret: 44, entry: null });
      }
      return e.is_dir && r.stat().filetype != N
        ? { ret: 54, entry: null }
        : { ret: 0, entry: r };
    }
    get_parent_dir_and_entry_for_path(e, r) {
      const s = e.parts.pop();
      if (s === void 0)
        return { ret: 28, parent_entry: null, filename: null, entry: null };
      const { ret: o, entry: t } = this.get_entry_for_path(e);
      if (t == null)
        return { ret: o, parent_entry: null, filename: null, entry: null };
      if (!(t instanceof m))
        return { ret: 54, parent_entry: null, filename: null, entry: null };
      const n = t.contents.get(s);
      return n === void 0
        ? r
          ? { ret: 0, parent_entry: t, filename: s, entry: null }
          : { ret: 44, parent_entry: null, filename: null, entry: null }
        : e.is_dir && n.stat().filetype != N
          ? { ret: 54, parent_entry: null, filename: null, entry: null }
          : { ret: 0, parent_entry: t, filename: s, entry: n };
    }
    create_entry_for_path(e, r) {
      const { ret: s, path: o } = O.from(e);
      if (o == null) return { ret: s, entry: null };
      let {
        ret: t,
        parent_entry: n,
        filename: i,
        entry: f,
      } = this.get_parent_dir_and_entry_for_path(o, !0);
      if (n == null || i == null) return { ret: t, entry: null };
      if (f != null) return { ret: 20, entry: null };
      E.log("create", o);
      let a;
      return (
        r ? (a = new m(new Map())) : (a = new G(new ArrayBuffer(0))),
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
        r instanceof m && (r.parent = this);
    }
  }
  class F extends I {
    fd_filestat_get() {
      return { ret: 0, filestat: new C(this.ino, V, BigInt(0)) };
    }
    fd_fdstat_get() {
      const e = new T(V, 0);
      return ((e.fs_rights_base = BigInt(64)), { ret: 0, fdstat: e });
    }
    fd_write(e) {
      return (this.write(e), { ret: 0, nwritten: e.byteLength });
    }
    static lineBuffered(e) {
      const r = new TextDecoder("utf-8", { fatal: !1 });
      let s = "";
      return new F((o) => {
        s += r.decode(o, { stream: !0 });
        const t = s.split(`
`);
        for (const [n, i] of t.entries()) n < t.length - 1 ? e(i) : (s = i);
      });
    }
    constructor(e) {
      (super(), (this.ino = g.issue_ino()), (this.write = e));
    }
  }
  var k = {},
    L,
    Y;
  function se() {
    if (Y) return L;
    Y = 1;
    const h = function (e, r, s) {
      var o = r || 0,
        t = s || e.byteLength;
      ((this.bytes = new Uint8Array(e, o, t)), (this.ptr = 0));
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
          o = s * 2;
        return (r >= s && (r -= o), r);
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
        for (var r = "", s = this.ptr, o = this.ptr + e; s < o; ++s)
          r += String.fromCharCode(this.bytes[s]);
        return r;
      }),
      (h.prototype.readString = function (e) {
        var r = this.peekString(e);
        return ((this.ptr += e), r);
      }),
      (L = h),
      L
    );
  }
  var H;
  function ie() {
    if (H) return k;
    H = 1;
    const h = se(),
      e = function (s, o) {
        const t = s.readString(o),
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
      const o = 512 - (s.ptr % 512);
      o > 0 && o < 512 && s.readBytes(o);
    }
    return (
      (k.untar = function (s) {
        const o = new h(s),
          t = [];
        for (; o.peekNumber(4) != 0; ) {
          const n = new r(o);
          n && n.isValid && t.push(n);
        }
        return t;
      }),
      k
    );
  }
  ie();
  function K() {
    const h = new TextDecoder("utf-8", { fatal: !1 }),
      e = new F((r) => {
        postMessage({ stderr: h.decode(r, { stream: !0 }) });
      });
    return ((e.fd_pwrite = (r, s) => ({ ret: 70, nwritten: 0 })), e);
  }
  async function fe(h) {
    let e = ["main.wasm"],
      r = [],
      s = [new v(new G([])), K(), K(), new ne(".", new Map([]))],
      o = new re(e, r, s),
      { instance: t } = await WebAssembly.instantiate(h, {
        wasi_snapshot_preview1: o.wasiImport,
      });
    try {
      const n = o.start(t);
      postMessage({
        stderr: `

---
exit with exit code ${n}
---
`,
      });
    } catch (n) {
      postMessage({ stderr: `${n}` });
    }
    postMessage({ done: !0 });
  }
  onmessage = (h) => {
    h.data.run && fe(h.data.run);
  };
})();
