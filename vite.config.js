import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})


    ```bash
    npm run build
    ```

    ```bash
    git add .
    git commit -m "Add vite config"
    git push origin main