# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/binaryen

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

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib" TYPE STATIC_LIBRARY FILES "/home/luca/learnhardcode/cpp/emception/build/binaryen/lib/libbinaryen.a")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/binaryen/src/binaryen-c.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/binaryen/src/wasm-delegations.def"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "/home/luca/learnhardcode/cpp/emception/build/binaryen/bin/binaryen_wasm.js")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_wasm.js" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_wasm.js")
    if(CMAKE_INSTALL_DO_STRIP)
      execute_process(COMMAND "/usr/bin/strip" "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_wasm.js")
    endif()
  endif()
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xUnspecifiedx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/bin" TYPE EXECUTABLE FILES "/home/luca/learnhardcode/cpp/emception/build/binaryen/bin/binaryen_js.js")
  if(EXISTS "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_js.js" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_js.js")
    if(CMAKE_INSTALL_DO_STRIP)
      execute_process(COMMAND "/usr/bin/strip" "$ENV{DESTDIR}${CMAKE_INSTALL_PREFIX}/bin/binaryen_js.js")
    endif()
  endif()
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/ir/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/asmjs/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/cfg/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/emscripten-optimizer/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/passes/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/support/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/wasm/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/src/tools/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/third_party/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/test/lit/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/binaryen/test/gtest/cmake_install.cmake")

endif()

if(CMAKE_INSTALL_COMPONENT)
  set(CMAKE_INSTALL_MANIFEST "install_manifest_${CMAKE_INSTALL_COMPONENT}.txt")
else()
  set(CMAKE_INSTALL_MANIFEST "install_manifest.txt")
endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
file(WRITE "/home/luca/learnhardcode/cpp/emception/build/binaryen/${CMAKE_INSTALL_MANIFEST}"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
