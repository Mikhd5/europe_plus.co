# Пасажирські перевезення ЄВРОПА+

Адаптивний сайт для компанії ЄВРОПА+ (HTML, CSS, JavaScript).

## Перегляд локально

Відкрийте `index.html` у браузері або запустіть локальний сервер у цій папці:

```bash
python -m http.server 8080
```

Потім відкрийте `http://localhost:8080`.

## Структура сайту

- Верхня навігація та контактні телефони.
- Hero-блок: на мобільних пристроях — реальне вертикальне відео салону; на десктопі — фотографічний фон.
- Напрямки: Німеччина та Чехія.
- Графік рейсів з публікації на грудень 2026 року.
- Автопарк і перелік зручностей салону.
- Передача посилок.
- Про компанію: понад 20 років досвіду, 5 мікроавтобусів.
- Онлайн-форма для підготовки заявки.
- Покрокове пояснення бронювання, FAQ, контакти та соціальні мережі.

## Функціональність

- Адаптивна верстка для desktop і mobile, липка навігація та мобільне меню.
- Автовідтворення відео без звуку на мобільному Hero, циклічне відтворення та відеомодальне вікно.
- Кнопки напрямків заповнюють поле призначення.
- Дати з опублікованого графіка заповнюють дату у формі.
- Перемикач між пасажирською поїздкою та передачею посилки.
- Перевірка полів, підготовка тексту заявки та копіювання.
- Телефонні посилання для обох номерів компанії.
- FAQ на нативному `details/summary`.

## Важливі примітки перед публікацією

1. Форма поки що готує текст заявки в браузері. Вона **не надсилає** дані на сервер, у CRM, Telegram або Viber. Для повноцінного онлайн-приймання заявок потрібно підключити endpoint або інтеграцію.
2. Графік відображає лише надану Instagram-публікацію на грудень 2026 року. Його потрібно підтверджувати й оновлювати на кожен наступний місяць.
3. Не додані ціни, міста маршрутів, ліміти багажу, тарифи на посилки або оплата онлайн, оскільки цих даних не було надано.
4. Номер +380 (67) 934 16 00 взятий з профілю компанії; +380 (67) 729 61 60 — з публікацій про бронювання.

## Візуальні матеріали

- `logo-original.jpg` — оригінальний логотип, який надав замовник.
- `hero-interior.mp4` — оптимізована для швидкого завантаження версія реального вертикального відео салону, наданого замовником.
- `salon-generated.png` — окреме згенероване фото салону.
- `germany-berlin.webp` — окреме згенероване фото Берліна.
- `sprinter-front.webp` — окремо згенероване широкоформатне фото чорного пасажирського мікроавтобуса на трасі під час заходу сонця.
- `czechia-prague.webp` — окремо згенероване фото Праги для картки напрямку Чехія.
- `parcels.webp` — тимчасове фото з попереднього згенерованого концепту; його потрібно замінити окремою генерацією перед фінальним затвердженням фотоматеріалів.
- `favicon.png` — browser icon created from the supplied original logo.

The connected Runway workspace currently has no generation credits, so separate new generations for the remaining visual assets were not submitted. No paid generation or plan change was made.

## Desktop visual refresh (v8)
- Replaced the desktop hero background with `assets/hero-desktop.webp`, a standalone cinematic highway image with a Sprinter-style minibus and negative space for the hero copy.
- Added a desktop-only atmosphere layer in `styles.css`: unified deep graphite/navy gradients, subtle orange and blue ambient lighting, refined section surfaces, and richer card depth.
- The refresh is scoped to `min-width: 681px`; the mobile hero continues to use the supplied real interior video and existing mobile layout.
