# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/lld

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

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE DIRECTORY FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/lld/include/" FILES_MATCHING REGEX "/[^/]*\\.h$")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/Common/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/tools/lld/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/docs/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/COFF/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/ELF/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/MachO/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/MinGW/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/wasm/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/lld/cmake/modules/cmake_install.cmake")

endif()

