# lib-employee-portal

## Registering theme types

We are using several extensions to the standard Joy UI theme, e.g. additional breakpoints.

To register the extended theme types in your package, add the following types to your package's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@eshg/lib-employee-portal/theme"]
  }
}
```
