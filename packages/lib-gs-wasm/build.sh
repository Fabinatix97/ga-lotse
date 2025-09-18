#!/bin/sh
# Copyright 2025 SCOOP Software GmbH, cronn GmbH
# SPDX-License-Identifier: AGPL-3.0-only


VERSION=ghostpdl-10.06.0
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

# Create invalid package.json so we cannot run javascript. Otherwise autotools won't realize we're cross-compiling.
echo '{:}' >package.json

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
