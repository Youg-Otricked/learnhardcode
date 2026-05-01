# This file allows users to call find_package(LLD) and pick up our targets.



find_package(LLVM REQUIRED CONFIG
             HINTS "/home/luca/learnhardcode/cpp/emception/build/llvm/./lib/cmake/llvm")

set(LLD_EXPORTED_TARGETS "lldCommon;lld;lldCOFF;lldELF;lldMachO;lldMinGW;lldWasm")
set(LLD_CMAKE_DIR "/home/luca/learnhardcode/cpp/emception/build/llvm/lib/cmake/lld")
set(LLD_INCLUDE_DIRS "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/lld/include;/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/include")

# Provide all our library targets to users.
include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/cmake/lld/LLDTargets.cmake")
