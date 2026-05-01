# Install script for directory: /home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers

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

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-resource-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/builtins.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/float.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/inttypes.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/iso646.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/limits.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/module.modulemap"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdalign.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdarg.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdatomic.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdbool.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stddef.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__stddef_max_align_t.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdint.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdnoreturn.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tgmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/unwind.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/varargs.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm_acle.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm_cmse.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/armintr.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm64intr.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_builtin_vars.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_complex_builtins.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_device_functions.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_texture_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_libdevice_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_math_forward_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_runtime_wrapper.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_circ_brev_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_protos.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_types.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hvx_hexagon_protos.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_libdevice_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_runtime_wrapper.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/msa.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/opencl-c.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/opencl-c-base.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/altivec.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/htmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/htmxlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/s390intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vecintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin_gen.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin_approx.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/adxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ammintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/amxfp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/amxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bf16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bitalgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512cdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512dqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512erintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512fintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512fp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512ifmaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512ifmavlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512pfintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmivlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbf16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbitalgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlcdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vldqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlfp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvbmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvp2intersectintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vp2intersectintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vpopcntdqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vpopcntdqvlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avxvnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/bmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/bmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cetintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cldemoteintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clflushoptintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clwbintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clzerointrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cmpccxaddintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/crc32intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/emmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/enqcmdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/f16cintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fma4intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fmaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fxsrintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/gfniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hresetintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ia32intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/immintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/invpcidintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/keylockerintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/lwpintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/lzcntintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mm3dnow.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/movdirintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mwaitxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/nmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pconfigintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pkuintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/popcntintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/prfchiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/prfchwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ptwriteintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/raointintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rdpruintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rdseedintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rtmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/serializeintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/sgxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/shaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/smmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tbmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tsxldtrkintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/uintrintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vaesintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vpclmulqdqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/waitpkgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wbnoinvdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__wmmintrin_aes.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__wmmintrin_pclmul.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/x86gprintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/x86intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xopintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsavecintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsaveintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsaveoptintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsavesintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xtestintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cet.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cpuid.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wasm_simd128.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vadefs.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mm_malloc.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-resource-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/cuda_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/algorithm"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/complex"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/new"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-resource-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/ppc_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/mmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/xmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/mm_malloc.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/emmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/pmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/tmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/smmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/bmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/bmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/immintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/x86intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/x86gprintrin.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xclang-resource-headersx" OR NOT CMAKE_INSTALL_COMPONENT)
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/openmp_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/cmath"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/__clang_openmp_device_functions.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/new"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xcore-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/builtins.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/float.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/inttypes.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/iso646.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/limits.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/module.modulemap"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdalign.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdarg.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdatomic.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdbool.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stddef.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__stddef_max_align_t.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdint.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/stdnoreturn.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tgmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/unwind.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/varargs.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xarm-common-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm_acle.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xarm-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm_cmse.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/armintr.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xaarch64-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/arm64intr.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xcuda-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/cuda_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/algorithm"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/complex"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cuda_wrappers/new"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xcuda-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_builtin_vars.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_complex_builtins.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_device_functions.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_texture_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_libdevice_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_math_forward_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_cuda_runtime_wrapper.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xhexagon-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_circ_brev_intrinsics.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_protos.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hexagon_types.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hvx_hexagon_protos.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xhip-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_libdevice_declares.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__clang_hip_runtime_wrapper.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xmips-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/msa.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xppc-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/ppc_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/mmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/xmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/mm_malloc.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/emmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/pmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/tmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/smmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/bmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/bmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/immintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/x86intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ppc_wrappers/x86gprintrin.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xppc-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/altivec.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xppc-htm-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/htmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/htmxlintrin.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xsystemz-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/s390intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vecintrin.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xve-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin_gen.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/velintrin_approx.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xwebassembly-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wasm_simd128.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xx86-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/adxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ammintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/amxfp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/amxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bf16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bitalgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512bwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512cdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512dqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512erintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512fintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512fp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512ifmaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512ifmavlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512pfintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vbmivlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbf16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbitalgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlbwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlcdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vldqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlfp16intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvbmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vlvp2intersectintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vp2intersectintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vpopcntdqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avx512vpopcntdqvlintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/avxvnniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/bmi2intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/bmiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cetintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cldemoteintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clflushoptintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clwbintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/clzerointrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cmpccxaddintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/crc32intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/emmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/enqcmdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/f16cintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fma4intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fmaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/fxsrintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/gfniintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hresetintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ia32intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/immintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/invpcidintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/keylockerintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/lwpintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/lzcntintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mm3dnow.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/movdirintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mwaitxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/nmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pconfigintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pkuintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/pmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/popcntintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/prfchiintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/prfchwintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/ptwriteintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/raointintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rdpruintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rdseedintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/rtmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/serializeintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/sgxintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/shaintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/smmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tbmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/tsxldtrkintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/uintrintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vaesintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vpclmulqdqintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/waitpkgintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wbnoinvdintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__wmmintrin_aes.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/wmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/__wmmintrin_pclmul.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/x86gprintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/x86intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xmmintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xopintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsavecintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsaveintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsaveoptintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xsavesintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/xtestintrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cet.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/cpuid.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xhlsl-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hlsl.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xhlsl-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/hlsl" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hlsl/hlsl_basic_types.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/hlsl/hlsl_intrinsics.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xopencl-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/opencl-c.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/opencl-c-base.h"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xopenmp-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include/openmp_wrappers" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/math.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/cmath"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/__clang_openmp_device_functions.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/complex_cmath.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/openmp_wrappers/new"
    )
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xutility-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/mm_malloc.h")
endif()

if("x${CMAKE_INSTALL_COMPONENT}x" STREQUAL "xwindows-resource-headersx")
  file(INSTALL DESTINATION "${CMAKE_INSTALL_PREFIX}/lib/clang/16.0.0/include" TYPE FILE FILES
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/intrin.h"
    "/home/luca/learnhardcode/cpp/emception/upstream/llvm-project/clang/lib/Headers/vadefs.h"
    )
endif()

