import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    eslintPlugin({
      overrideConfigFile: ".eslintrc.cjs",
      cache: false,
    }),
  ],
});
