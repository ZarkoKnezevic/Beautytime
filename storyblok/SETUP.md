# Storyblok setup & connection

One-time steps to create the Storyblok space and connect it to this app.

## 1. Create the space

1. Sign up / log in at <https://app.storyblok.com>.
2. **Create a new space** → choose the **EU** region (data residency for Austria).
3. Name it e.g. `Beautytime`.

## 2. Get the Preview token

Space → **Settings → Access Tokens** → copy the **Preview** token
(not the Public token — we render draft content in dev).

## 3. Connect the app

Create `.env.local` in the project root (it is gitignored):

```bash
NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN=<your-preview-token>
STORYBLOK_VERSION=draft
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=http://localhost:3000
SB_WEBHOOK_REVALIDATE_SECRET=<any-random-string>
```

## 4. Create the components (schemas)

**Option A — CLI (fast, recommended):**

```bash
npx storyblok login
# Find your space ID: Settings → General (a number like 123456)
npx storyblok push-components ./storyblok/components.json --space <SPACE_ID>
```

This creates: `page`, `settings`, `nav_link`, `header`, `footer`.

**Option B — manual:** recreate the fields from `components.json` in
**Block Library → New block** for each component.

## 5. Add content

1. **Upload the logo** (Assets): use `design/site/assets/logo.png`.
2. **Create a `Settings` story** with slug **`settings`** (content type `settings`):
   - **header** → add a `header` block:
     - `logo` = uploaded logo, `logo_label` = `Startseite`, `home_link` → the `home` story
     - `nav_links` → two `nav_link` blocks: `Leistungen` → `/leistungen`, `Unser Team` → `/unser-team`
       (use the story picker once those pages exist, or a URL link for now)
     - `cta_label` = `Termin vereinbaren`, `cta_link` → `tel:+436603008300` (URL link)
   - **footer** → add a `footer` block:
     - `logo`, `ring_text` = `Die beste Zeit ist BeautyTime.`
     - `nav_links` → Startseite `/`, Leistungen `/leistungen`, Unser Team `/unser-team`
     - `contact_title` = `Kontakt`, `phone_label` = `0660 300 83 00`,
       `phone_link` = `tel:+436603008300`, `email` = the studio e-mail,
       `instagram_label` = `Instagram @beautytime_traun`,
       `instagram_link` = `https://www.instagram.com/beautytime_traun/`
     - `address` (textarea, line breaks kept):
       ```
       Bahnhofstraße 21
       4050 Traun, Österreich
       ```
     - `hours_title` = `Öffnungszeiten`, `hours` (textarea):
       ```
       Montag ab 8:30 Uhr
       [Dienstag–Samstag ergänzen]
       Sonntag geschlossen
       ```
     - `copyright` = `© 2026 Beautytime · Traun`
     - `legal_links` → `Impressum` → `/impressum`, `Datenschutz` → `/datenschutz`
3. **Create a `Home` story** with slug **`home`** (content type `page`). Leave `body` empty
   for now — we build content blocks next. **Publish** both stories (or keep as draft; dev
   reads draft).

## 6. Visual editor (optional but recommended)

Space → **Settings → Visual Editor** → set **Location (default environment)** to:

```
http://localhost:3000/
```

The live-preview route is available at `/live-preview/<slug>`.

## 7. Run

```bash
npm run dev
```

Open <http://localhost:3000> — the header and footer render from the `settings` story
around the (currently empty) home page.

## 8. Production revalidation (later)

Add a Storyblok webhook (Settings → Webhooks) pointing to
`https://<your-domain>/api/revalidate?secret=<SB_WEBHOOK_REVALIDATE_SECRET>` for story
publish events.
