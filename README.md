# GrinBuds 🌱
**GrinBuds** adalah platform aplikasi edukatif gamifikasi (mirip Duolingo) yang dirancang khusus untuk membantu anak-anak belajar membaca dengan cara yang interaktif dan menyenangkan. Sistem ini juga memiliki kapabilitas deteksi dini disleksia melalui pola pembelajaran anak dan menyediakan **Dashboard Orang Tua** yang komprehensif.

## 🌟 Fitur Utama
- **Level Pembelajaran Gamifikasi:** Anak-anak dapat belajar huruf dan suku kata melalui mini-game interaktif.
- **Audio Feedback (Howler.js):** Pengalaman imersif dengan *background music* yang menenangkan, efek suara responsif saat bermain, dan *voice over*.
- **Deteksi Dini Disleksia:** Melacak kesalahan berulang secara spesifik (seperti tertukar b, d, p, q).
- **Mode Pilihan & Menulis:** Kombinasi *multiple choice* dan menggambar huruf langsung di layar (canvas).
- **Dashboard Orang Tua:** Analitik perkembangan belajar anak secara *real-time*.
- **UI/UX Ramah Anak:** Warna ceria, animasi lembut menggunakan Framer Motion, desain responsif, dan font ramah disleksia (*Fredoka, Baloo 2, Nunito*).

---

## 🛠️ Tech Stack
**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework)
- TypeScript
- Tailwind CSS
- Framer Motion (Animasi)
- Howler.js (Manajemen Audio)
- Lucide React (Ikon)

**Backend:**
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- Uvicorn (ASGI Server)

---

## 📁 Struktur Direktori
```text
GRINBUDSV2/
├── backend/          # Berisi sistem dan API backend (Python/FastAPI)
│   ├── main.py       # Entry point utama aplikasi backend
│   └── requirements.txt
│
└── frontend/         # Berisi interface website (Next.js)
    ├── public/       # Aset statis seperti audio (BGM/SFX) dan gambar
    ├── src/          # Source code React (app, components, lib, dll)
    ├── package.json  # Dependency NodeJS frontend
    └── tailwind.config.ts
```

---

## 🚀 Cara Menjalankan Project (Lokal)

### Prasyarat
Pastikan komputermu sudah ter-install:
1. **Node.js** (versi 18+) & **npm**
2. **Python** (versi 3.8+)

### 1. Menjalankan Backend (Python/FastAPI)
Buka terminal baru, lalu ikuti langkah-langkah ini:
```bash
# Masuk ke folder backend
cd backend

# (Opsional tapi disarankan) Buat dan aktifkan Virtual Environment
python -m venv venv
venv\Scripts\activate      # Untuk Windows
# source venv/bin/activate # Untuk Mac/Linux

# Install semua module yang dibutuhkan
pip install -r requirements.txt

# Jalankan server FastAPI
uvicorn main:app --reload
```
*Backend akan berjalan di: `http://localhost:8000`*

### 2. Menjalankan Frontend (Next.js)
Buka terminal/tab baru lainnya, lalu ikuti langkah-langkah ini:
```bash
# Masuk ke folder frontend
cd frontend

# Install semua package/module NodeJS
npm install

# Jalankan web server Next.js di mode development
npm run dev
```
*Frontend aplikasi akan bisa diakses melalui browser di: `http://localhost:3000`*

---

## 🎧 Setup Audio (SFX & BGM)
Saat mem-build secara lokal, pastikan file `.mp3` berikut ini benar-benar ada di dalam folder `frontend/public/audio/` dengan ukuran aslinya (bukan *dummy file* 0 bytes):
- `frontend/public/audio/bgm/minigame.mp3`
- `frontend/public/audio/sfx/click.mp3`
- `frontend/public/audio/sfx/success.mp3`
- `frontend/public/audio/sfx/wrong.mp3`

*(Harap gunakan file audio berformat `.mp3` murni untuk menghindari error decoding)*
