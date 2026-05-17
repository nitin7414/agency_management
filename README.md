# Shri Shyam Gas Agency — Management System

A professional LPG agency management web app built with **Next.js 14**, **Prisma**, **Neon (PostgreSQL)**, and **UploadThing**.

---

## Features

- 📊 Dashboard with global filled/empty cylinder counts and due payments
- 👥 Customer management with document uploads (Aadhar, PAN, Food License, GST)
- 💬 Paytm-style transaction feed per customer
- 📦 Auto-calculated cylinder balance and pending payment tracking
- 📝 Google Notes-style task board
- 📋 Recent activity log with CSV export
- 🌙 Dark/light mode toggle
- 📱 Mobile-first responsive design with footer navigation
- 🖥️ Desktop sidebar layout

---

## Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Framework    | Next.js 14 (App Router)  |
| Database     | Neon (Serverless Postgres)|
| ORM          | Prisma 5                 |
| File Uploads | UploadThing              |
| Auth         | iron-session             |
| UI           | Custom CSS (no component lib) |

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Neon database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the **Connection String** (postgresql://...)

### 3. Set up UploadThing

1. Go to [uploadthing.com](https://uploadthing.com) and create an account
2. Create a new app
3. Copy your **Secret Key** and **App ID**

### 4. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
```env
DATABASE_URL="postgresql://..."
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
SESSION_SECRET="any-random-32-char-string-here"
```

### 5. Push database schema

```bash
npm run db:generate
npm run db:push
```

### 6. Seed the admin account

```bash
npm run db:seed
```

Default credentials:
- **Email:** admin@ssga.com
- **Password:** admin123
- ⚠️ Change this password after first login in Settings!

### 7. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How to Use

### Adding Customers
1. On the Home screen, tap the **+** button (bottom right)
2. Fill in Name and Mobile (required)
3. Optionally upload documents
4. Tap **Add Customer**

### Recording a Transaction
1. Tap a customer name from the list
2. Tap **New Transaction** at the bottom
3. Fill in any combination of:
   - Cylinders Delivered
   - Empty Cylinders Collected
   - Payment Received (₹)
4. Tap **Save Transaction**

### Viewing History
- Tap the **₹ Due** button to see all payment history
- Tap the **Empty** button to see all empty cylinder collections
- Tap the **Filled** button to see all deliveries

### Exporting Data
- Go to the **Activity** tab
- Tap **Export CSV** to download the full log

### Updating Agency Stock
- Go to **Settings**
- Under "Agency Cylinder Stock", enter current counts
- Tap **Update Stock**

---

## Folder Structure

```
shri-shyam-gas/
├── app/
│   ├── api/
│   │   ├── auth/login/         POST login
│   │   ├── auth/logout/        POST logout
│   │   ├── customers/          GET list, POST create
│   │   ├── customers/[id]/     GET detail, PATCH update
│   │   ├── customers/[id]/transactions/  POST new transaction
│   │   ├── dashboard/          GET stats
│   │   ├── tasks/              GET list, POST create
│   │   ├── tasks/[id]/         PATCH update, DELETE
│   │   ├── activity/           GET logs, ?format=csv
│   │   ├── stock/              GET/PATCH agency stock
│   │   ├── settings/           GET/PATCH admin profile
│   │   └── uploadthing/        UploadThing handler
│   ├── dashboard/page.tsx      Home screen
│   ├── customers/[id]/page.tsx Transaction feed
│   ├── tasks/page.tsx          Notes
│   ├── activity/page.tsx       Recent activity
│   ├── settings/page.tsx       Settings
│   ├── login/page.tsx          Login
│   ├── layout.tsx              Root layout
│   └── globals.css             All styles
├── components/
│   ├── AppShell.tsx            Sidebar + footer nav
│   ├── AddCustomerModal.tsx    Add customer form
│   ├── HistoryPopup.tsx        Scrollable history list
│   └── ThemeProvider.tsx       Dark/light mode
├── lib/
│   ├── prisma.ts               DB client
│   ├── session.ts              Auth session
│   └── uploadthing.ts          File upload config
├── prisma/
│   ├── schema.prisma           DB schema
│   └── seed.ts                 Initial data
└── README.md
```

---

## Deployment (Vercel)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy!

Neon and UploadThing both work seamlessly on Vercel serverless functions.