console.log('wasmRunner.js loaded');

import { dotnet } from "./wwwroot/_framework/dotnet.js"; // or "./wwwroot/_framework/dotnet.js" if needed

let exportsPromise = null;

async function initRuntime() {
  if (exportsPromise) return exportsPromise;

  try {
    const { getAssemblyExports, getConfig, setModuleImports } = await dotnet.create();

    setModuleImports("CSharpMethodsJSImplementationsModule", {
      getBaseUrl: () => window.location.href,
    });

    const config = getConfig();
    const exports = await getAssemblyExports(config.mainAssemblyName);
    exportsPromise = Promise.resolve(exports);
    return exports;
  } catch (e) {
    console.error("Failed to initialize .NET runtime:", e);
    throw e;
  }
}

export async function compileAndRun(src) {
  const exports = await initRuntime();
  await exports.WASM.Compiler.CompileAndRun(src);
}

export async function precompile(src) {
  const exports = await initRuntime();
  await exports.WASM.Compiler.PreCompile(src);
}

export async function preload() {
  const exports = await initRuntime();
  await exports.WASM.Compiler.PreloadReferences();
}