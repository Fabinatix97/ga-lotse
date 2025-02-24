# lib-vitest

## Using Custom Matchers in your subproject

### 1. Add `lib-vitest` as a dev dependency, e.g. using

`./gradlew :dental:addWorkspaceDependency -Pdev -Ppackage=lib-vitest`

### 2. Add `vitest-setup.ts` in your subproject, importing `extend-expect`

```ts
import "@eshg/lib-vitest/extend-expect";
```

### 3. Add `vitest-setup.ts` to your `tsconfig.json`

```json
{
  "include": [
    "vitest-setup.ts"
  ]
}
```

### 4. Add setup file to `vitest.config.ts`

```ts
export default mergeConfig(VITEST_BASE_CONFIG, {
  test: {
    setupFiles: ["vitest-setup.ts"],
  },
});
```
