# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/llvm/unittests

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
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/ADT/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Analysis/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/AsmParser/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/BinaryFormat/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Bitcode/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Bitstream/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/CodeGen/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/DebugInfo/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Debuginfod/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Demangle/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/ExecutionEngine/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/FileCheck/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Frontend/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/FuzzMutate/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/InterfaceStub/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/IR/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/LineEditor/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Linker/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/MC/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/MI/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/MIR/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/ObjCopy/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Object/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/ObjectYAML/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Option/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Remarks/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Passes/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/ProfileData/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Support/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/TableGen/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Target/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Testing/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/TextAPI/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/Transforms/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/XRay/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/unittests/tools/cmake_install.cmake")

endif()

