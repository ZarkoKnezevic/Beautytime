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
STORYBLOK_ACCESS_TOKEN=<your-preview-token>   # production: use the Public token
STORYBLOK_PREVIEW_TOKEN=<your-preview-token>  # draft content for the visual editor only
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
http://localhost:3000/api/preview/
```

Storyblok appends the story slug and a signature to that URL. `/api/preview`
verifies the signature with the Preview token, starts a Next.js draft-mode
session and redirects to `/live-preview/<slug>`, which always renders draft
content. Unsigned requests to `/live-preview` get a 404, so drafts never leak
in production. For production add a second environment with
`https://<your-domain>/api/preview/`.

## 7. Run

```bash
npm run dev
```

Open <http://localhost:3000> — the header and footer render from the `settings` story
around the (currently empty) home page.

## 8. Production revalidation

Published content is cached by Next.js (Data Cache + static pages) and refreshed
by a Storyblok webhook. Add one under **Settings → Webhooks** for the
*Story published* and *Story unpublished* events:

```
https://<your-domain>/api/revalidate?secret=<SB_WEBHOOK_REVALIDATE_SECRET>
```

Alternatively enter `SB_WEBHOOK_REVALIDATE_SECRET` as the webhook's *Secret*
in Storyblok; the endpoint then verifies the `webhook-signature` header instead
of the query string. Either way, a publish refreshes the story's URL in both
locales, and publishing the `settings` story refreshes every page. Pages also
expire after 24 hours as a safety net.

## 9. Production environment

```bash
STORYBLOK_ACCESS_TOKEN=<public token>     # published content only
STORYBLOK_PREVIEW_TOKEN=<preview token>   # draft content for /api/preview + /live-preview
STORYBLOK_VERSION=published
NEXT_PUBLIC_APP_URL=https://<your-domain>
NEXT_PUBLIC_DOMAIN=https://<your-domain>
SB_WEBHOOK_REVALIDATE_SECRET=<random string>
```

With `STORYBLOK_VERSION=published` every page is prerendered at build time and
served statically; `draft` (development) renders on every request.
