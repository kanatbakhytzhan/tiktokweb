# Landing page для натяжных потолков (Next.js + Google Sheets)

Готовый mobile-first лендинг для трафика из TikTok Ads:
- быстрый первый экран с оффером и CTA
- модальная форма (имя + телефон)
- отправка лида в Google Sheets через Google Apps Script Web App
- UTM-метки и User Agent сохраняются
- после успешной отправки редирект в WhatsApp

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS
- API route `app/api/lead/route.ts`
- Google Apps Script + Google Sheets (бесплатно)

## Структура проекта

- `app/page.tsx`
- `app/api/lead/route.ts`
- `components/Header.tsx`
- `components/Hero.tsx`
- `components/LeadModal.tsx`
- `components/TrustedLogos.tsx`
- `components/Footer.tsx`
- `components/LandingPage.tsx`
- `lib/utils.ts`
- `lib/utm.ts`
- `lib/whatsapp.ts`
- `constants/site.ts`
- `public/logo.svg` (замените на свой логотип)
- `public/logos/*` (замените логотипы партнеров)

## Что заменить под себя

1) WhatsApp номер и текст:
- файл `constants/site.ts`
- поля `whatsappNumber` и `whatsappMessage`

2) URL Google Apps Script:
- файл `.env.local`
- переменная `GOOGLE_SCRIPT_URL`

3) Логотип компании:
- файл `public/logo.svg`

4) Логотипы компаний:
- файлы в `public/logos/`
- список в `constants/site.ts` (`trustedCompanies`)

## 1. Как создать Google Sheet

1. Откройте [Google Sheets](https://sheets.google.com) и создайте новую таблицу.
2. В первой строке сделайте заголовки колонок в таком порядке:
   - `Дата/время`
   - `Имя`
   - `Телефон`
   - `Источник`
   - `User Agent`
   - `UTM Source`
   - `UTM Medium`
   - `UTM Campaign`
   - `UTM Content`
   - `UTM Term`

## 2. Как создать Google Apps Script

1. В таблице: `Расширения -> Apps Script`.
2. Удалите шаблонный код.
3. Вставьте этот код:

```javascript
function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheets()[0];
    var data = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
      data.timestamp || "",
      data.name || "",
      data.phone || "",
      data.source || "",
      data.userAgent || "",
      data.utmSource || "",
      data.utmMedium || "",
      data.utmCampaign || "",
      data.utmContent || "",
      data.utmTerm || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Как опубликовать Apps Script как Web App

1. Нажмите `Deploy -> New deployment`.
2. Выберите тип: `Web app`.
3. В `Execute as`: `Me`.
4. В `Who has access`: `Anyone`.
5. Нажмите `Deploy`.
6. Скопируйте URL формата:
   - `https://script.google.com/macros/s/.../exec`

## 4. Как вставить URL в `.env.local`

1. Создайте файл `.env.local` в корне проекта.
2. Добавьте строку:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/ВАШ_ID/exec
```

## 5. Запуск локально

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## 6. Деплой на Vercel (бесплатно)

1. Залейте проект в GitHub.
2. Импортируйте репозиторий в [Vercel](https://vercel.com).
3. В настройках проекта (`Settings -> Environment Variables`) добавьте:
   - `GOOGLE_SCRIPT_URL` = ваш URL Apps Script
4. Нажмите Deploy.

## Как работает отправка формы

1. Пользователь заполняет имя и телефон.
2. Клиент отправляет `POST /api/lead`.
3. `app/api/lead/route.ts` добавляет timestamp, source, user agent и UTM.
4. API route пересылает данные в Google Apps Script Web App.
5. Если запись успешна, клиент делает редирект в WhatsApp `wa.me`.
6. Если ошибка, редиректа нет — показывается сообщение об ошибке.
