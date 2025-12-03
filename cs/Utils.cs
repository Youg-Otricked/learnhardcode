using System.Text.RegularExpressions;

namespace WASM;

public static partial class Utils
{
    [GeneratedRegex(@"using\s([\w\.]+)\;", RegexOptions.IgnoreCase, "en-US")]
    private static partial Regex UsingStatementRegex();

    [GeneratedRegex(@"Main\([\s\S]*?\)\s*\{([\s\S]*?)^\s*\}", RegexOptions.Multiline)]
    private static partial Regex MainCodeRegex();

    [GeneratedRegex(@"namespace\s+\w+")]
    private static partial Regex NamespaceRegex();
    
    public static string ReplaceNamespace(string src)
		=> NamespaceRegex().Replace(src, AssemblyLoader.NameSpace);
    
    public static IEnumerable<string> ExtractUsings(string text) 
	    => UsingStatementRegex()
		    .Matches(text)
		    .Select(x => x.Groups[1].Value);

    public static HashSet<string> Combine(this HashSet<string> xs, IEnumerable<string> ys)
    {
        foreach (var s in ys) xs.Add(s);

        return xs;
    }

    public static string WrapInTryCatch(string src)
    {
	    try
	    {
		    // TODO - optimize with Regex.Replace directly
		    var main = MainCodeRegex().Match(src).Groups[1].Value;
		    var tryCatch = $@"
				try{{
					{main}
				}}
				catch(Exception e)
				{{
					foreach (var line in e.ToString().Split(Environment.NewLine))
		            {{
		                Console.WriteLine($""err: {{line}}"");
		            }}
				}}";
		    
		    return src.Replace(main, tryCatch);;
	    }
	    catch (Exception e)
	    {
		    Console.WriteLine("err: Failed to parse Main function with regex" + e);
		    return src;
	    }
    }
}