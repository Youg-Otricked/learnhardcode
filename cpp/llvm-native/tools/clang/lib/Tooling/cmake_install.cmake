# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Tooling

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

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclangToolingx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/home/luca/learnhardcode/cpp/emception/build/llvm-native/lib/libclangTooling.a")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/Core/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/Inclusions/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/Refactoring/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/ASTDiff/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/DumpTool/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/Syntax/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/DependencyScanning/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm-native/tools/clang/lib/Tooling/Transformer/cmake_install.cmake")

endif()

