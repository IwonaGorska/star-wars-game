import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',  // Your Angular app's URL
    supportFile: false,
  },
});
