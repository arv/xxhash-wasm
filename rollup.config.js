import { readFileSync } from "fs";
import { resolve } from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";

const isNode = process.env.TARGET === "node";

const wasmBytes = Array.from(
  readFileSync(resolve(__dirname, "src/xxhash.wasm"))
);

const output = isNode
  ? {
      file: "cjs/xxhash-wasm.cjs",
      format: "cjs",
      sourcemap: true,
      exports: "default",
    }
  : [
      { file: "esm/xxhash-wasm.js", format: "es", sourcemap: true },
      {
        file: "umd/xxhash-wasm.js",
        format: "umd",
        name: "xxhash",
        sourcemap: true,
      },
    ];
const replacements = {
  WASM_PRECOMPILED_BYTES: JSON.stringify(wasmBytes),
};

export default {
  input: "src/index.js",
  output,
  plugins: [
    replace(replacements),
    babel({ exclude: "node_modules/**" }),
    nodeResolve(),
    terser({ toplevel: true }),
  ],
};
