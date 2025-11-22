# TikTok Video Info API - Vercel

API lấy thông tin video TikTok được viết bằng Node.js và deploy lên Vercel.

## 🚀 Deploy lên Vercel

### Cách 1: Deploy qua GitHub (Khuyên dùng)

1. **Tạo repository trên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/tiktok-api.git
   git push -u origin main
   ```

2. **Import vào Vercel**
   - Truy cập [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import repository GitHub của bạn
   - Click "Deploy"

### Cách 2: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login và Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Deploy production**
   ```bash
   vercel --prod
   ```

## 📖 Sử dụng API

### Endpoint
```
https://your-project.vercel.app/api/tiktok?url={TIKTOK_URL}
```

### Ví dụ

**1. URL đầy đủ:**
```
https://your-project.vercel.app/api/tiktok?url=https://www.tiktok.com/@pc.tns/video/7422250015885675783
```

**2. URL rút gọn vt.tiktok.com:**
```
https://your-project.vercel.app/api/tiktok?url=https://vt.tiktok.com/ZS23K2jtk/
```

**3. URL rút gọn vm.tiktok.com:**
```
https://your-project.vercel.app/api/tiktok?url=https://vm.tiktok.com/ZS23K2jtk/
```

**4. Chỉ ID video:**
```
https://your-project.vercel.app/api/tiktok?url=7422250015885675783
```

## 📦 Response Format

```json
{
    "status": "success",
    "processed_time": "0.8217",
    "data": {
        "id": "7422250015885675783",
        "region": "VN",
        "title": "Video title...",
        "cover": "https://...",
        "duration": 57,
        "play": {
            "DataSize": "11319848",
            "Width": 1080,
            "Height": 1920,
            "UrlList": ["https://..."],
            ...
        },
        "music_info": {...},
        "author": {...},
        "stats": {...},
        "contents": [...]
    }
}
```

## 🔧 Test local

```bash
# Cài đặt dependencies
npm install

# Chạy local với Vercel Dev
npm run dev

# Hoặc
vercel dev
```

Truy cập: `http://localhost:3000/api/tiktok?url=VIDEO_URL`

## 💡 Tính năng

✅ Hỗ trợ URL đầy đủ và rút gọn (vt.tiktok.com, vm.tiktok.com)  
✅ Tự động xử lý redirect  
✅ Lấy video không watermark (chất lượng cao nhất)  
✅ Thông tin đầy đủ: author, music, stats, hashtags  
✅ CORS enabled - có thể gọi từ frontend  
✅ Serverless - không cần server  

## 🛠 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Vercel Serverless Functions
- **Dependencies:**
  - `axios` - HTTP requests
  - `jsdom` - HTML parsing

## ⚙️ Environment

Không cần setup environment variables.

## 📝 Notes

- Free tier Vercel: 100GB bandwidth/tháng
- Timeout: 10 giây (có thể tăng với Pro plan)
- Rate limit: Theo Vercel limits

## 🐛 Troubleshooting

**Lỗi "Data not found":**
- URL không hợp lệ
- Video đã bị xóa hoặc private

**Lỗi timeout:**
- TikTok server chậm
- Thử lại sau vài giây

## 📄 License

MIT

---

Made with ❤️ for Vietnamese developers
