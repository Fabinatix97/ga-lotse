Ghostscript compiled to WASM using Emscripten to run in a web-worker.

# Updating
To update Ghostscript, adjust the version in the [build-script](./build.sh).
To update Emscripten, adjust the version in the [Dockerfile](./emscripten-autotools/Dockerfile).
Be sure to also bump the version in package.json as npm registries don't allow overwriting previously published packages. 
After updating either be sure to manually run the `publish-lib-gs-wasm` job in Gitlab. 

# Debugging
To debug the WASM module, follow these steps:
 1. Build with debug symbols: `./gradlew :pdf-converter-portal:runDev -Pwasm-debug=true`
 2. Serve debug symbols: `cd build/dist/ && python -m http.server 8000`
 3. Install Chromium debugging extension: https://chromewebstore.google.com/detail/cc++-devtools-support-dwa/pdcpmagijalfljmkmjngeonclgbbannb
 4. Open the PDF converter portal in Chromium and open the developer tools.

# Non dockerized build
During development, it may be desirable to build lib-gs-wasm without Docker to speed up rebuilds:
 1. Install build tools: (on Debian-based distributions: `apt install build-essential automake`)
 2. Install Emscripten:  
  2.1 Install emsdk: `git clone https://github.com/emscripten-core/emsdk.git`  
  2.2 Enter the emsdk directory: `cd emsdk`  
  2.3 Download and install the latest version of Emscripten: `./emsdk install latest`  
  2.4 Install tsc for Emscripten: `cd upstream/emscripten && npm installnpm install -g typescript && cd -`  
  2.5 Activate the latest version of Emscripten: `. ./emsdk_env.sh`
 3. Enter lib-gs-wasm build directory: `cd /path/to/ga-lotse-code/packages/lib-gs-wasm`
 4. Create directory for GhostPDL: `mkdir ghostpdl`
 5. Run the build script: `./build.sh`
 6. Start pdf converter portal: `./gradlew :pdf-converter-portal:runDev -x :lib-gs-wasm:buildInContainer`

To rebuild after changes:
 1. `cd ghostpdl && make -j && cp bin/gs.* ../build/dist/ && cd ..`
 2. Start pdf converter portal: `./gradlew :pdf-converter-portal:runDev -x :lib-gs-wasm:buildInContainer`
