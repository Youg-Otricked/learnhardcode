/*===- TableGen'erated file -------------------------------------*- C++ -*-===*\
|*                                                                            *|
|* Option Parsing Definitions                                                 *|
|*                                                                            *|
|* Automatically generated file, do not edit!                                 *|
|*                                                                            *|
\*===----------------------------------------------------------------------===*/

/////////
// Prefixes

#ifdef PREFIX
#define COMMA ,
PREFIX(prefix_0, {nullptr})
PREFIX(prefix_3, {"-" COMMA nullptr})
PREFIX(prefix_1, {"--" COMMA nullptr})
PREFIX(prefix_2, {"--" COMMA "-" COMMA nullptr})
#undef COMMA
#endif // PREFIX

/////////
// Groups

#ifdef OPTION

//////////
// Options

OPTION(prefix_0, &"<input>"[0], INPUT, Input, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_0, &"<unknown>"[0], UNKNOWN, Unknown, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_1, &"--arch="[2], arch_EQ, Joined, INVALID, INVALID, nullptr, DeviceOnlyOption | HelpHidden, 0,
       "The device subarchitecture", "<arch>", nullptr)
OPTION(prefix_2, &"--as-needed"[2], as_needed, Flag, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_1, &"--bitcode-library="[2], bitcode_library_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Extra bitcode library to link", "<kind>-<triple>-<arch>=<path>", nullptr)
OPTION(prefix_1, &"--cuda-path="[2], cuda_path_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Set the system CUDA path", "<dir>", nullptr)
OPTION(prefix_1, &"--device-debug"[2], debug, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Use debugging", nullptr, nullptr)
OPTION(prefix_1, &"--device-linker="[2], device_linker_args_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Arguments to pass to the device linker invocation", "<value> or <triple>=<value>", nullptr)
OPTION(prefix_1, &"--dry-run"[2], dry_run, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Print program arguments without running", nullptr, nullptr)
OPTION(prefix_2, &"--dynamic-linker="[2], dynamic_linker_EQ, Joined, INVALID, dynamic_linker, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--dynamic-linker"[2], dynamic_linker, Separate, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_1, &"--embed-bitcode"[2], embed_bitcode, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Embed linked bitcode in the module", nullptr, nullptr)
OPTION(prefix_1, &"--help-hidden"[2], help_hidden, Flag, INVALID, INVALID, nullptr, 0, 0,
       "Display all available options", nullptr, nullptr)
OPTION(prefix_1, &"--help"[2], help, Flag, INVALID, INVALID, nullptr, 0, 0,
       "Display available options (--help-hidden for more)", nullptr, nullptr)
OPTION(prefix_1, &"--host-triple="[2], host_triple_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Triple to use for the host compilation", "<triple>", nullptr)
OPTION(prefix_2, &"--library-path="[2], library_path_EQ, Joined, INVALID, library_path, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--library-path"[2], library_path_S, Separate, INVALID, library_path, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--library="[2], library_EQ, Joined, INVALID, library_path, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--library"[2], library_S, Separate, INVALID, library_path, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_1, &"--linker-arg="[2], linker_arg_EQ, Joined, INVALID, INVALID, nullptr, DeviceOnlyOption | HelpHidden, 0,
       "An extra argument to be passed to the linker", nullptr, nullptr)
OPTION(prefix_1, &"--linker-path="[2], linker_path_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "The linker executable to invoke", "<path>", nullptr)
OPTION(prefix_3, &"-L"[1], library_path, JoinedOrSeparate, INVALID, INVALID, nullptr, 0, 0,
       "Add <dir> to the library search path", "<dir>", nullptr)
OPTION(prefix_3, &"-l"[1], library, JoinedOrSeparate, INVALID, INVALID, nullptr, 0, 0,
       "Search for library <libname>", "<libname>", nullptr)
OPTION(prefix_3, &"-mllvm"[1], mllvm, Separate, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Arguments passed to the LLVM invocation", "<arg>", nullptr)
OPTION(prefix_2, &"--no-as-needed"[2], no_as_needed, Flag, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--offload-opt=-"[2], offload_opt_eq_minus, Joined, INVALID, INVALID, nullptr, HelpHidden | WrapperOnlyOption, 0,
       "Options passed to LLVM", nullptr, nullptr)
OPTION(prefix_1, &"--opt-level="[2], opt_level, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Optimization level for LTO", "<O0, O1, O2, or O3>", nullptr)
OPTION(prefix_1, &"--output="[2], output_EQ, Joined, INVALID, o, nullptr, HelpHidden, 0,
       "Alias for -o", nullptr, nullptr)
OPTION(prefix_1, &"--output"[2], output, Separate, INVALID, o, nullptr, HelpHidden, 0,
       "Alias for -o", nullptr, nullptr)
OPTION(prefix_3, &"-o"[1], o, JoinedOrSeparate, INVALID, INVALID, nullptr, 0, 0,
       "Path to file to write output", "<path>", nullptr)
OPTION(prefix_1, &"--pass-remarks-analysis="[2], pass_remarks_analysis_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Pass remarks for LTO", nullptr, nullptr)
OPTION(prefix_1, &"--pass-remarks-missed="[2], pass_remarks_missed_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Pass remarks for LTO", nullptr, nullptr)
OPTION(prefix_1, &"--pass-remarks="[2], pass_remarks_EQ, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Pass remarks for LTO", nullptr, nullptr)
OPTION(prefix_1, &"--print-wrapped-module"[2], print_wrapped_module, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Print the wrapped module's IR for testing", nullptr, nullptr)
OPTION(prefix_1, &"--ptxas-arg="[2], ptxas_arg, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Argument to pass to the 'ptxas' invocation", nullptr, nullptr)
OPTION(prefix_2, &"--rpath="[2], rpath_EQ, Joined, INVALID, rpath, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--rpath"[2], rpath, Separate, INVALID, INVALID, nullptr, 0, 0, nullptr, nullptr, nullptr)
OPTION(prefix_1, &"--save-temps"[2], save_temps, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Save intermediate results", nullptr, nullptr)
OPTION(prefix_1, &"--sysroot"[2], sysroot_EQ, Joined, INVALID, INVALID, nullptr, 0, 0,
       "Set the system root", nullptr, nullptr)
OPTION(prefix_1, &"--triple="[2], triple_EQ, Joined, INVALID, INVALID, nullptr, DeviceOnlyOption | HelpHidden, 0,
       "The device target triple", "<triple>", nullptr)
OPTION(prefix_2, &"--version"[2], version, Flag, INVALID, v, nullptr, HelpHidden, 0, nullptr, nullptr, nullptr)
OPTION(prefix_2, &"--v"[2], v, Flag, INVALID, INVALID, nullptr, 0, 0,
       "Display the version number and exit", nullptr, nullptr)
OPTION(prefix_1, &"--whole-program"[2], whole_program, Flag, INVALID, INVALID, nullptr, DeviceOnlyOption | HelpHidden, 0,
       "LTO has visibility of all input files", nullptr, nullptr)
OPTION(prefix_1, &"--wrapper-time-trace-granularity="[2], wrapper_time_trace_granularity, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Set the granularity of time-trace updates", "<number>", nullptr)
OPTION(prefix_1, &"--wrapper-time-trace="[2], wrapper_time_trace_eq, Joined, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Enable time-trace and write the output to <file>", "<file>", nullptr)
OPTION(prefix_1, &"--wrapper-verbose"[2], verbose, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "Verbose output from tools", nullptr, nullptr)
OPTION(prefix_1, &"--"[2], separator, Flag, INVALID, INVALID, nullptr, WrapperOnlyOption, 0,
       "The separator for the wrapped linker arguments", nullptr, nullptr)
#endif // OPTION

#ifdef SIMPLE_ENUM_VALUE_TABLE

struct SimpleEnumValue {
  const char *Name;
  unsigned Value;
};

struct SimpleEnumValueTable {
  const SimpleEnumValue *Table;
  unsigned Size;
};
static const SimpleEnumValueTable SimpleEnumValueTables[] = {};
static const unsigned SimpleEnumValueTablesSize = sizeof(SimpleEnumValueTables) / sizeof(SimpleEnumValueTable);
#endif // SIMPLE_ENUM_VALUE_TABLE


#ifdef OPTTABLE_ARG_INIT
//////////
// Option Values


#endif // OPTTABLE_ARG_INIT
