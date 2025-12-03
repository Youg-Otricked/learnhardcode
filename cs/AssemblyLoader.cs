using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;
#pragma warning disable IL2026
#pragma warning disable IL2072
#pragma warning disable IL2075

namespace WASM;

public static partial class AssemblyLoader
{
    private const string Namespace = "cloudIDE";
    public const string NameSpace = $"namespace {Namespace}";
    private static readonly HttpClient Client = new()
    {
        BaseAddress = new Uri(GetBaseUrl())
    };

    private static List<MetadataReference> _cachedReferences = [];
    private static HashSet<string> _cachedAssemblies = [];
    
    [JSImport("getBaseUrl", "CSharpMethodsJSImplementationsModule")]
    private static partial string GetBaseUrl();

    public static async Task<List<MetadataReference>> PreloadReferenceAssemblies()
    {
        if (_cachedReferences.Any()) return _cachedReferences;
        
        var references = new List<MetadataReference>();
        var appAssemblies = Assembly.GetExecutingAssembly()
            .GetReferencedAssemblies()
            .Select(Assembly.Load)
            .ToList();
        
        appAssemblies.Add(typeof(object).Assembly);
        
        foreach (var assembly in appAssemblies)
        {
            await GetReference(assembly.GetName().Name!, references);
        }
        
        //Needed for HttpClient
        var privateUri = await GetAssemblyMetadataReference("System.Private.Uri");

        if (privateUri is null)
            throw new Exception("Could not find System.Private.Uri");
        
        references.Add(privateUri);
        
        _cachedReferences = references;
        
        return references;
    }

    public static async Task<List<MetadataReference>> GetReferenceAssemblies(
        IEnumerable<string> additionalAssemblies)
    {
        var references = new List<MetadataReference>();
        var requiredAssemblies = additionalAssemblies.Where(x => !_cachedAssemblies.Contains(x)).ToArray();
        
        foreach (var assembly in requiredAssemblies)
        {
            await GetReference(assembly, references);
        }

        _cachedAssemblies.Combine(requiredAssemblies);
        _cachedReferences.AddRange(references);
        return _cachedReferences;
    }

    public static (EmitResult, MemoryStream) Emit(CSharpCompilation compilation)
    {
        var sw = Stopwatch.StartNew();
        var ms = new MemoryStream();
        var result = compilation.Emit(ms);
        var outcome = result.Success ? "Success" : "Error";
        
        Console.WriteLine($"dbg: Emitted IL: {outcome} in {sw.ElapsedMilliseconds} ms");

        return (result, ms);
    }
    
    public static void Run(EmitResult result, MemoryStream ms)
    {
        if (!result.Success)
        {
            var failures = result.Diagnostics.Where(diagnostic => 
                diagnostic.IsWarningAsError || 
                diagnostic.Severity == DiagnosticSeverity.Error);

            foreach (var diagnostic in failures)
            {
                Console.WriteLine("err: ({0}): {1}", diagnostic.Id, diagnostic.GetMessage());
            }
        }
        else
        {
            ms.Seek(0, SeekOrigin.Begin);
            var assembly = Assembly.Load(ms.ToArray());
                
            const string typeName = $"{Namespace}.Program";
            var type = assembly.GetType(typeName);

            if (type is null)
                throw new Exception($"Unable to get type {typeName}");
                
            var obj = Activator.CreateInstance(type);

            if (obj is null)
                throw new Exception($"Unable to instantiate type {typeName}");
                    
            Console.WriteLine($"dbg: Instantiated: {obj.GetType()}");

            const BindingFlags flags = BindingFlags.Default | BindingFlags.InvokeMethod; 
                    
            type.InvokeMember("Main", flags, null, obj, [new[] {""}]);
            ms.Dispose();
        }
    }
    
    private static async Task GetReference(string assembly, List<MetadataReference> references)
    {
        var metadataReference = await GetAssemblyMetadataReference(assembly);
        if (metadataReference == null)
        {
            Console.WriteLine($"dbg: {assembly} was null");
            return;
        }
        
        references.Add(metadataReference);
    }
    
    private static async Task<MetadataReference?> GetAssemblyMetadataReference(string assembly)
    {
        var sw = Stopwatch.StartNew();
        // Remove the extra "wwwroot" here:
        var assemblyUrl = $"./_framework/{assembly}.dll";

        try
        {
            var response = await Client.GetAsync(assemblyUrl);
            if (response.IsSuccessStatusCode)
            {
                var stream = await response.Content.ReadAsStreamAsync();
                Console.WriteLine("dbg: Downloaded {0} in {1} ms", assembly, sw.ElapsedMilliseconds);

                return MetadataReference.CreateFromStream(stream);
            }
            else
            {
                Console.WriteLine("dbg: Failed downloading {0} - status {1}", assembly, (int)response.StatusCode);
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("dbg: Failed downloading {0} - {1}", assembly, e.Message);
        }

        return null;
    }
}

