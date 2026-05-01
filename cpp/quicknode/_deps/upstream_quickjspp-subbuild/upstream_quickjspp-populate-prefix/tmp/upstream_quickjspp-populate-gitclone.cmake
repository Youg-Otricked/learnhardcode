
if(NOT "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitinfo.txt" IS_NEWER_THAN "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitclone-lastrun.txt")
  message(STATUS "Avoiding repeated git clone, stamp file is up to date: '/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitclone-lastrun.txt'")
  return()
endif()

execute_process(
  COMMAND ${CMAKE_COMMAND} -E remove_directory "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-src"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to remove directory: '/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-src'")
endif()

# try the clone 3 times in case there is an odd git clone issue
set(error_code 1)
set(number_of_tries 0)
while(error_code AND number_of_tries LESS 3)
  execute_process(
    COMMAND "/usr/bin/git"  clone --no-checkout "https://github.com/ftk/quickjspp.git" "upstream_quickjspp-src"
    WORKING_DIRECTORY "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps"
    RESULT_VARIABLE error_code
    )
  math(EXPR number_of_tries "${number_of_tries} + 1")
endwhile()
if(number_of_tries GREATER 1)
  message(STATUS "Had to git clone more than once:
          ${number_of_tries} times.")
endif()
if(error_code)
  message(FATAL_ERROR "Failed to clone repository: 'https://github.com/ftk/quickjspp.git'")
endif()

execute_process(
  COMMAND "/usr/bin/git"  checkout 9cee4b4d27271d54b95f6f42bfdc534ebeaaeb72 --
  WORKING_DIRECTORY "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-src"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to checkout tag: '9cee4b4d27271d54b95f6f42bfdc534ebeaaeb72'")
endif()

set(init_submodules TRUE)
if(init_submodules)
  execute_process(
    COMMAND "/usr/bin/git"  submodule update --recursive --init 
    WORKING_DIRECTORY "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-src"
    RESULT_VARIABLE error_code
    )
endif()
if(error_code)
  message(FATAL_ERROR "Failed to update submodules in: '/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-src'")
endif()

# Complete success, update the script-last-run stamp file:
#
execute_process(
  COMMAND ${CMAKE_COMMAND} -E copy
    "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitinfo.txt"
    "/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitclone-lastrun.txt"
  RESULT_VARIABLE error_code
  )
if(error_code)
  message(FATAL_ERROR "Failed to copy script-last-run stamp file: '/home/luca/learnhardcode/cpp/emception/build/quicknode/_deps/upstream_quickjspp-subbuild/upstream_quickjspp-populate-prefix/src/upstream_quickjspp-populate-stamp/upstream_quickjspp-populate-gitclone-lastrun.txt'")
endif()

