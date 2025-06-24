Ghostscript compiled to WASM using Emscripten to run in a web-worker.
To update Ghostscript, adjust the version in the [build-script](./build.sh).
To update Emscripten, adjust the version in the [Dockerfile](./emscripten-autotools/Dockerfile).
Be sure to also bump the version in package.json as npm registries don't allow overwriting previously published packages. 
After updating either be sure to manually run the `publish-lib-gs-wasm` job in Gitlab. 
