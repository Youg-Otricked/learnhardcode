# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/llvm/lib

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/emsdk/upstream/emscripten/cache/sysroot")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Install shared libraries without execute permission?
if(NOT DEFINED CMAKE_INSTALL_SO_NO_EXE)
  set(CMAKE_INSTALL_SO_NO_EXE "1")
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/IR/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/FuzzMutate/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/FileCheck/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/InterfaceStub/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/IRReader/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/CodeGen/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/BinaryFormat/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Bitcode/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Bitstream/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/DWARFLinker/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Extensions/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Frontend/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Transforms/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Linker/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Analysis/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/LTO/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/MC/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/MCA/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/ObjCopy/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Object/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/ObjectYAML/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Option/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Remarks/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Debuginfod/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/DebugInfo/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/DWP/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/ExecutionEngine/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Target/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/AsmParser/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/LineEditor/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/ProfileData/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/Passes/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/TextAPI/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/ToolDrivers/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/XRay/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/WindowsDriver/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/lib/WindowsManifest/cmake_install.cmake")

endif()

