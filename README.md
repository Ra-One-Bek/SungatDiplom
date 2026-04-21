# ⚽ SungatDiplom — Football Analytics Platform (Kazakhstan Clubs)

## 📌 О проекте

**SungatDiplom** — это fullstack-приложение для анализа футбольных клубов Казахстана с использованием внешнего API и собственной логики обработки данных.

Проект ориентирован на:

* визуализацию данных по клубам,
* анализ состава и игроков,
* статистику матчей,
* рекомендации (AI),
* и дальнейшее расширение через admin-панель.

---

## 🏟 Поддерживаемые клубы

* **Astana**
* **Kairat**
* **Kaisar**

---

## 🧠 Основная идея архитектуры

Проект строится как **hybrid data platform**:

```text
External API (API-Football)
        +
Local Database (PostgreSQL, admin data)
        ↓
Backend (NestJS merge layer)
        ↓
Frontend (React)
```

### Приоритет данных:

```
Admin overrides > External API > Mock fallback
```

---

## ⚙️ Технологии

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* External API: API-Football
* TypeScript

### Frontend

* React + Vite
* TypeScript
* TailwindCSS

---

## 📁 Структура проекта

```text
SungatDiplom/
  client/        # Frontend (React)
  server/        # Backend (NestJS)
```

---

## 🖥 Backend структура (`server/src`)

```text
src/
  database/        # Prisma (DB connection)
  users/           # Users logic
  auth/            # Authentication (JWT)
  admin/           # Admin functionality

  players/         # Players API + hybrid merge
  club/            # Club info
  matches/         # Matches
  injuries/        # Injuries
  analytics/       # Stats & analytics
  squad/           # Squad management
  ai/              # AI recommendations
  external-football/ # API-Football integration
  data/            # Mock & static data
```

---

## 🗄 База данных

Используется **PostgreSQL + Prisma**

### Основные сущности:

* `User`
* (планируется) `AdminPlayer`
* (планируется) `PlayerOverride`

---

## 🚀 Установка и запуск

### 1. Клонирование

```bash
git clone https://github.com/Ra-One-Bek/SungatDiplom.git
cd SungatDiplom
```

---

## 🔧 Backend

### Установка

```bash
cd server
npm install
```

### Настройка `.env`

```env
PORT=3000
CLIENT_URL=http://localhost:5173

API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
API_FOOTBALL_KEY=YOUR_API_KEY

DATABASE_URL="postgresql://postgres:password@localhost:5432/sungat_diplom?schema=public"
```

---

### Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### Запуск сервера

```bash
npm run start:dev
```

---

## 🎨 Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Планируемые возможности

### Авторизация

* JWT authentication
* Roles:

  * ADMIN
  * EDITOR
  * USER

---

### Admin Panel

* управление игроками
* редактирование данных API
* добавление локальных игроков
* скрытие игроков

---

### Hybrid Data System

* объединение API + локальных данных
* override данных игроков
* fallback на mock

---

## 📊 Возможности платформы

* просмотр игроков клуба
* детальная статистика
* матчи
* травмы
* рекомендации тренировок (AI)
* управление составом

---

## 🧩 Архитектурные принципы

* Separation of concerns
* Backend-driven data merging
* Scalable module structure (NestJS)
* Clean API layer
* Extendable admin system

---

## 📈 Статус проекта

🚧 В разработке:

* подключение PostgreSQL
* auth система
* admin панель
* hybrid data logic

---

## 👨‍💻 Автор

Rauanbek & Sungat

---

## 📄 Лицензия

MIT
