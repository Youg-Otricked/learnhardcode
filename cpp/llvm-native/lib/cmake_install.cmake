# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/llvm/lib

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
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
  set(CMAKE_CROSSCOMPILING "FALSE")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/IR/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/FuzzMutate/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/FileCheck/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/InterfaceStub/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/IRReader/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/CodeGen/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/BinaryFormat/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Bitcode/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Bitstream/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/DWARFLinker/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Extensions/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Frontend/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Transforms/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Linker/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Analysis/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/LTO/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/MC/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/MCA/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/ObjCopy/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Object/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/ObjectYAML/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Option/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Remarks/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Debuginfod/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/DebugInfo/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/DWP/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/ExecutionEngine/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Target/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/AsmParser/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/LineEditor/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/ProfileData/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Passes/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/TextAPI/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/ToolDrivers/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/XRay/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/Testing/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/WindowsDriver/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/WindowsManifest/cmake_install.cmake")

endif()

