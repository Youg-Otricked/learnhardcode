using System.Diagnostics;
using System.Runtime.InteropServices.JavaScript;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;

namespace WASM;

public static partial class Compiler
{
    static CSharpCompilationOptions CompilationOptions(IEnumerable<string> additionalUsings)
        => new(
            OutputKind.DynamicallyLinkedLibrary,
            concurrentBuild: false,
            checkOverflow: true,
            optimizationLevel: OptimizationLevel.Release,
            usings: Constants.DefaultUsings.Combine(additionalUsings));
    
    [JSExport]
    [Obsolete("Precompile blocks the UI thread for too long on startup.")]
    private static async Task PreCompile(string src)
    {
        try
        {
            var sw = Stopwatch.StartNew();
            await CompileInternal(src);
            Console.WriteLine("dbg: Finished in {0} ms", sw.ElapsedMilliseconds);
        }
        catch (Exception e)
        {
            Console.WriteLine($"dbg: ERROR: {e.Message}");
        }
    }
    
    [JSExport]
    private static async Task<string> CompileAndRun(string src)
    {
        var writer = new StringWriter();
        var oldOut = Console.Out;

        try
        {
            Console.SetOut(writer);

            var sw = Stopwatch.StartNew();
            var (result, ms) = await CompileInternal(src);
            AssemblyLoader.Run(result, ms);
            Console.WriteLine("dbg: Finished in {0} ms", sw.ElapsedMilliseconds);
        }
        catch (Exception e)
        {
            Console.WriteLine($"err: ERROR: {e}");
        }
        finally
        {
            Console.SetOut(oldOut);
        }

        return writer.ToString();
    }

    [JSExport]
    private static async Task PreloadReferences()
    {
        try
        {
            await AssemblyLoader.PreloadReferenceAssemblies();
        }
        catch (Exception e)
        {
            Console.WriteLine($"dbg: ERROR: {e.Message}");
        }
    }
    
    private static async Task<(EmitResult, MemoryStream)> CompileInternal(string src)
    {
        var sw = Stopwatch.StartNew();
        src = Utils.ReplaceNamespace(src);
        //src = Utils.WrapInTryCatch(src);
        var syntaxTree = CSharpSyntaxTree.ParseText(src);
        var assemblyName = Path.GetRandomFileName();
        var usings = Utils.ExtractUsings(src);
        var additionalRefs = Constants.DefaultReferences.Where(x => usings.Any(x.Equals));
        var references = await AssemblyLoader.GetReferenceAssemblies(additionalRefs);
        
        var compilation = CSharpCompilation.Create(
            assemblyName,
            syntaxTrees: [syntaxTree],
            references: references,
            options: CompilationOptions(usings));

        Console.WriteLine($"dbg: Created compilation: {compilation.AssemblyName} in {sw.ElapsedMilliseconds} ms");

        return AssemblyLoader.Emit(compilation);
    }
}