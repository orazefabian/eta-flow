import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const dev = process.env.ROLLUP_WATCH;

export default {
  input: "src/eta-flow-card.ts",
  output: {
    file: "dist/eta-flow-card.js",
    format: "es",
    sourcemap: dev ? true : false,
  },
  plugins: [
    resolve(),
    json(),
    typescript({ tsconfig: "./tsconfig.json" }),
    !dev && terser({ format: { comments: false } }),
  ],
  // lit is bundled in; no externals so the single file is self-contained for HACS
};
