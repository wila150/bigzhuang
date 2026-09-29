# BigZhaung 大壯做網站

The official site for BigZhaung, built with Next.js 16 and Payload CMS 3. The front end and the admin (`/admin`) run in one app, and the database is Postgres.

## Local development

```bash
cp .env.example .env        # fill in DATABASE_URL and PAYLOAD_SECRET
createdb bigzhaung
npm install
npm run seed                # starting content: services, projects, FAQ, page text
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin (the first visit asks you to create the admin account)

In development, Payload syncs the database schema automatically. After changing a collection, run `npm run generate:types`.

## Where content lives

| Admin section | Controls |
| --- | --- |
| 服務項目 | Home page service cards, services list, each service page, nav dropdown |
| 作品案例 / 案例分類 | Marquee, works pages, case pages, nav dropdown (empty categories are hidden) |
| 常見問題 | FAQ page |
| 首頁文字 / 關於大壯 / 合作流程 | Page copy |
| 網站設定 | LINE / Email / IG, footer keywords, SEO title and description |
| 詢問單 | Contact form submissions and their status |
| 客戶與月費 | Clients, monthly fees, bills. Each client signs in to `/account` with Google (the 登入 Email) and sees only their own bills |

## Deploy (Render + Supabase)

1. **Supabase**: create a project.
   - Copy the Session pooler connection string. It becomes `DATABASE_URL`.
   - Create a public Storage bucket named `media`.
   - Under Storage → S3 Connection, create an access key.
2. **Render**: create the service from `render.yaml` (New → Blueprint) and fill in the env vars listed in `.env.example`:
   - `S3_ENDPOINT` = `https://<project-ref>.supabase.co/storage/v1/s3`
   - `S3_BUCKET` = `media`
3. Every start runs `payload migrate` before `next start`, so migrations in `src/migrations` are applied automatically.
4. After changing a collection, run `npm run payload migrate:create <name>` and commit the new migration.

## Customer portal and card payments

- `/account`: clients sign in with Google and see their bills. Bank details come from 網站設定 → 付款資訊.
- The 刷卡付款 button appears once `ECPAY_MERCHANT_ID`, `ECPAY_HASH_KEY` and `ECPAY_HASH_IV` are set.
- ECPay posts payment results to `/payments/ecpay/notify`, which verifies the signature and amount, then marks the bill 已繳.
- Try it in the sandbox with `ECPAY_ENV=stage` and the test merchant listed in `.env.example`.
