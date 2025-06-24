#!/bin/sh
# Copyright 2025 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: AGPL-3.0-only


# when updating ghostscript please check if 8a5c6c0909 is already included and doesn't need to be cherry-picked anymore (see below)
VERSION=ghostpdl-10.05.1
DEBUG="${DEBUG:-false}"

set -e

cd ghostpdl
if ! test -d .git; then
  git init
  git remote add origin https://github.com/ArtifexSoftware/ghostpdl.git # https://git.ghostscript.com/ghostpdl.git
fi

if ! git cat-file -e $VERSION; then
  echo fetching ghostpdl...
  git fetch
fi

git reset --hard $VERSION
git clean -fdx

# cherry-pick function pointer cast fix
git cherry-pick -n 8a5c6c0909

# fix alignment
patch -p1 <<'EOF'
diff --git a/base/gxfcache.h b/base/gxfcache.h
index 8678a160d..41a7248f7 100644
--- a/base/gxfcache.h
+++ b/base/gxfcache.h
@@ -186,7 +186,7 @@ struct cached_char_s {
 /*
  * Define the alignment and size of the cache structures.
  */
-#define align_cached_char_mod align_cached_bits_mod
+#define align_cached_char_mod 8
 #define sizeof_cached_char\
   ROUND_UP((int)sizeof(cached_char), align_cached_char_mod)
 #define cc_bits(cc) ((byte *)(cc) + sizeof_cached_char)
diff --git a/lcms2mt/src/lcms2_internal.h b/lcms2mt/src/lcms2_internal.h
index 97dcbc4d0..445df4ce9 100644
--- a/lcms2mt/src/lcms2_internal.h
+++ b/lcms2mt/src/lcms2_internal.h
@@ -61,8 +61,9 @@
 // (Ultra)SPARC with gcc requires ptr alignment of 8 bytes
 // even though sizeof(void *) is only four: for greatest flexibility
 // allow the build to specify ptr alignment.
+// Since we the pointer is used to store, among other things, doubles, 8-byte-align it on WASM.
 #ifndef CMS_PTR_ALIGNMENT
-# if defined(sparc) || defined(__sparc) || defined(__sparc__)
+# if defined(sparc) || defined(__sparc) || defined(__sparc__) || defined(__EMSCRIPTEN__)
 #  define CMS_PTR_ALIGNMENT 8
 # else
 #  define CMS_PTR_ALIGNMENT sizeof(void *)
diff --git a/psi/iref.h b/psi/iref.h
index 6d4ff88d3..19d58b776 100644
--- a/psi/iref.h
+++ b/psi/iref.h
@@ -604,9 +604,8 @@ struct ref_s {
 #define ARCH_SIZEOF_REF sizeof(ref)
 /* Define the required alignment for refs. */
 /* We assume all alignment values are powers of 2. */
-#define ARCH_ALIGN_REF_MOD\
- (((ARCH_ALIGN_LONG_MOD - 1) | (ARCH_ALIGN_FLOAT_MOD - 1) |\
-   (ARCH_ALIGN_PTR_MOD - 1)) + 1)
+// The struct contains a uint64_t, so let's 8-byte align it.
+#define ARCH_ALIGN_REF_MOD 8

 /* Select reasonable values for PDF interpreter */
 /* The maximum array size cannot exceed max_uint/ARCH_SIZEOF_REF */
EOF

# package.json in parent directory might confuse build
echo '{}' >package.json

LDFLAGS="-sALLOW_MEMORY_GROWTH=1\
  -sEXPORTED_RUNTIME_METHODS=FS\
  -sENVIRONMENT=worker\
  -sSTACK_SIZE=262144\
  -sEXPORT_ES6=1\
  -sIGNORE_MISSING_MAIN=0\
  -sAUTO_JS_LIBRARIES=0\
  -sAUTO_NATIVE_LIBRARIES=0\
  -sASSERTIONS=1\
  -sSTACK_OVERFLOW_CHECK=2\
  -sCHECK_NULL_WRITES=1\
  -sMALLOC=dlmalloc\
  -sSAFE_HEAP=2\
  -sDYNAMIC_EXECUTION=0\
  -sDEFAULT_TO_CXX=0\
  -sEXIT_RUNTIME=1\
  -sINCOMING_MODULE_JS_API=preRun,postRun,arguments,print,printErr,onAbort,onExit\
  --emit-tsd gs.d.ts"
CFLAGS="-O0 -g"

if [ $DEBUG = true ]; then
  echo debug build
  LDFLAGS="$LDFLAGS -O0 -g -gseparate-dwarf -sSEPARATE_DWARF_URL=http://localhost:8000/gs.wasm.debug.wasm"
  CFLAGS="-O0 -g"
else
  LDFLAGS="$LDFLAGS -O3"
  CFLAGS="-O3"
fi

emconfigure ./autogen.sh --host=wasm32-unknown-emscripten --with-exe-ext=.js --with-libtiff --disable-threading --disable-cups --disable-dbus --disable-gtk --with-drivers=PS --without-tesseract --without-x CFLAGS="$CFLAGS" LDFLAGS="$LDFLAGS"

emmake make -j

cp bin/gs.* ../build/dist/
chown --reference=../build/dist/build-info.txt ../build/dist/gs.*
