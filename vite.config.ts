import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// IMPORTANT: set `base` to '/<REPO_NAME>/' if deploying to
//   https://<USERNAME>.github.io/<REPO_NAME>/
// For username.github.io or a custom domain, set base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/tintagel-terminology-challenge/'


})
