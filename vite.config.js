import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```
4.  กด **Save**

---

### 🚀 อัปเดตขึ้นเว็บอีกรอบ
เมื่อสร้างไฟล์เสร็จแล้ว ให้พิมพ์คำสั่งใน Terminal ตามนี้ครับ:

1.  **สร้าง Build ใหม่ (เพื่อความชัวร์):**
    ```bash
    npm run build
    ```
2.  **ส่งขึ้น GitHub:**
    ```bash
    git add .
    git commit -m "Add vite config"
    git push origin main