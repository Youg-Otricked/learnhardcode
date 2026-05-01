# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang

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

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE DIRECTORY FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/include/clang"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/include/clang-c"
    FILES_MATCHING REGEX "/[^/]*\\.def$" REGEX "/[^/]*\\.h$" REGEX "/config\\.h$" EXCLUDE)
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/include" TYPE DIRECTORY FILES "/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/include/clang" FILES_MATCHING REGEX "/CMakeFiles$" EXCLUDE REGEX "/[^/]*\\.inc$" REGEX "/[^/]*\\.h$")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xbash-autocompletex" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/share/clang" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/utils/bash-autocomplete.sh")
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/utils/TableGen/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/include/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/lib/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/tools/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/runtime/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/docs/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/cmake/modules/cmake_install.cmake")
  include("/home/luca/learnhardcode/cpp/emception/build/llvm/tools/clang/utils/hmaptool/cmake_install.cmake")

endif()

