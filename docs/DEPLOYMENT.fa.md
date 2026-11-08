# راهنمای دیپلوی

دو مسیر دارید. برای نمونه‌کار (پورتفولیو) مسیر ۱ ساده‌تر است و برای سایت واقعی شرکت مسیر ۲ بهتر.

| | مسیر ۱: Vercel + دیتابیس ابری | مسیر ۲: سرور (VPS) + Docker |
|---|---|---|
| پیچیدگی | کم | متوسط |
| هزینه | رایگان / کم | هزینه‌ی سرور |
| محدودیت امنیتی | محدودکننده‌ی نرخ درخواست (rate limit) بین instanceها مشترک نیست | هیچ؛ کنترل کامل |
| مناسب برای | دمو و پورتفولیو | سایت واقعی |

---

## قبل از هر چیز: آپلود در گیت‌هاب

```bash
unzip alum-cable-kaveh-demo.zip && cd alum-cable-kaveh-demo
git init -b main
git add .
git status          # مطمئن شوید فایل .env در لیست نیست
git commit -m "Initial commit"
git remote add origin git@github.com:<USER>/<REPO>.git
git push -u origin main
```

بعد از اولین `npm install` فایل `package-lock.json` ساخته می‌شود. آن را هم commit کنید:

```bash
npm install
git add package-lock.json && git commit -m "Add lockfile" && git push
```

> رمزهای فایل `.env` قدیمی (دیتابیس، SMTP و JWT) در آرشیو اولیه بود. اگر آن آرشیو را جایی منتشر کرده‌اید، **هر سه را عوض کنید**.

---

## مسیر ۲ (پیشنهادی برای سایت واقعی): VPS + Docker Compose

نیازمندی‌ها: سرور اوبونتو ۲۲.۰۴ یا بالاتر با دامنه‌ای که به IP آن اشاره می‌کند.

### ۱) نصب Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### ۲) دریافت پروژه و تنظیم `.env`

```bash
git clone https://github.com/<USER>/<REPO>.git app && cd app
cp .env.example .env
nano .env
```

مقادیر لازم:

```ini
POSTGRES_PASSWORD="<رمز قوی>"                 # openssl rand -base64 24
JWT_SECRET="<حداقل ۳۲ کاراکتر>"               # openssl rand -base64 48
NEXT_PUBLIC_SITE_URL="https://example.com"    # دامنه‌ی واقعی با https
# اختیاری (ایمیل اطلاع‌رسانی فرم تماس):
SMTP_HOST="" SMTP_USER="" SMTP_PASS="" CONTACT_RECIPIENT=""
```

اگر `CONTACT_RECIPIENT` خالی بماند ایمیلی ارسال نمی‌شود و پیام‌ها فقط در پنل ادمین ذخیره می‌شوند.

### ۳) ساخت و اجرا

```bash
docker compose up -d --build
docker compose --profile tools run --rm migrate    # ساخت جدول‌ها + داده‌ی محصولات
docker compose --profile tools run --rm admin      # ساخت کاربر ادمین (رمز حداقل ۱۲ کاراکتر)
curl -s http://127.0.0.1:3000/api/health           # باید {"ok":true} بدهد
```

### ۴) HTTPS با Caddy (ساده‌ترین روش)

```bash
sudo apt install -y caddy
sudo tee /etc/caddy/Caddyfile >/dev/null <<'CADDY'
example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3000
}
CADDY
sudo systemctl reload caddy
```

Caddy گواهی HTTPS را خودکار می‌گیرد و هدر `X-Forwarded-For` را درست تنظیم می‌کند؛ این برای محدودکننده‌ی نرخ درخواست لازم است.

اگر **nginx** دارید این خطوط را در `location /` بگذارید (به `$remote_addr` توجه کنید: مقدار قبلی **بازنویسی** می‌شود، نه اضافه):

```nginx
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
```

### ۵) فایروال

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw enable
```

پورت ۵۴۳۲ (دیتابیس) و ۳۰۰۰ عمداً به بیرون باز نیستند.

### به‌روزرسانی و پشتیبان‌گیری

```bash
git pull && docker compose up -d --build && docker compose --profile tools run --rm migrate
docker compose exec db pg_dump -U alum alum_cable | gzip > backup-$(date +%F).sql.gz
```

---

## مسیر ۱: Vercel + Neon (یا Supabase)

1. روی [neon.tech](https://neon.tech) یک دیتابیس PostgreSQL بسازید و connection string را بردارید.
2. از لپ‌تاپ خود یک بار جدول‌ها را بسازید:
   ```bash
   DATABASE_URL="<connection string>" npx prisma migrate deploy
   DATABASE_URL="<connection string>" npx prisma db seed
   DATABASE_URL="<connection string>" npm run admin:create
   ```
3. در [vercel.com](https://vercel.com) پروژه را از گیت‌هاب Import کنید و این متغیرها را در Settings → Environment Variables بگذارید: `DATABASE_URL`، `JWT_SECRET`، `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

نکته‌ها:
- در Vercel محدودکننده‌ی نرخ درخواست داخل حافظه‌ی هر instance است و بین instanceها مشترک نیست. برای سایت واقعی `lib/rate-limit.ts` را با Upstash Redis جایگزین کنید (امضای تابع یکی است).
- اگر شبکه‌ی شما دانلود Prisma engine را مسدود کرد، متغیر `PRISMA_ENGINES_MIRROR` را به یک mirror قابل‌دسترس تنظیم کنید.

---

## دمو عمومی در گیت‌هاب

- اطلاعات تماس واقعی را با متغیرهای `NEXT_PUBLIC_PHONE_1`، `NEXT_PUBLIC_PHONE_2` و `NEXT_PUBLIC_CONTACT_EMAIL` بازنویسی کنید تا دمو شماره‌ی واقعی شرکت را نشان ندهد.
- لوگوی مشتریان (`public/image/*.png`)، گواهینامه‌ها (`public/ISO*.jpg`, `ISIRI.png`) و `public/catalog.pdf` متعلق به شرکت و سازمان‌های دیگرند. قبل از public کردن مخزن از مدیریت شرکت اجازه بگیرید، یا آن‌ها را با تصویر نمونه عوض کنید.
- در GitHub → Settings → Code security گزینه‌های Secret scanning و Dependabot alerts را روشن کنید.

## عیب‌یابی

| مشکل | علت و راه‌حل |
|---|---|
| `JWT_SECRET is missing or shorter than 32 characters` | در حالت production باید حداقل ۳۲ کاراکتر باشد. |
| بعد از لاگین دوباره به صفحه‌ی ورود برمی‌گردید | سایت را با `http://` (بدون HTTPS) روی دامنه‌ی واقعی باز کرده‌اید. cookie امن فقط روی HTTPS ذخیره می‌شود. فقط برای تست محلی `ALLOW_INSECURE_COOKIES=true` بگذارید. |
| خطای 403 `bad_origin` در فرم‌ها | پروکسی هدر `Host` را عوض می‌کند. `proxy_set_header Host $host;` را بگذارید و `NEXT_PUBLIC_SITE_URL` را درست تنظیم کنید. |
| خطای 429 | محدودیت نرخ درخواست (۵ ارسال در ۱۰ دقیقه برای هر IP، ۸ تلاش ورود در ۱۵ دقیقه برای هر حساب). |
