# Next.js + Tailwind theme toggle

A light/dark theme switcher for a Next.js App Router app. No extra packages —
not even `next-themes`. About 120 lines in total.

I built this while adding a light theme to a site that was already hardcoded
dark. The rule I set myself: **dark mode had to look exactly the same
afterwards.** That shaped most of the decisions below.

## How it works

The site had around 200 hardcoded colours like `text-white`, `bg-[#0B1120]`
and `border-white/10`, and no dark-mode variants at all.

I could have added a `dark:` version of every one of those classes. That
doubles the number of classes and spreads colour decisions across every file.

Instead I gave each colour a **name**, and let the name mean something
different in each theme:

```
text-white        →  text-content
border-white/10   →  border-ink/10
```

`content` is the text colour — white in dark mode, near-black in light.
`ink` is that same colour used faintly, for borders and subtle backgrounds.

Now the components never mention a colour. All the colours live in one file.

## Why the colours are written as `15 23 42`

The theme values are stored as plain red/green/blue numbers:

```css
:root { --content: 15 23 42; }
.dark { --content: 255 255 255; }
```

```ts
content: { DEFAULT: 'rgb(var(--content) / <alpha-value>)' }
```

Two reasons:

1. **Transparency still works.** Things like `text-content/85` and
   `border-ink/10` keep working. They break if you write the colour any other
   way.
2. **The numbers stay exact.** My first version converted the colours to HSL,
   and `#0B1120` came back as a *slightly* different shade. Too small to
   notice on its own, but it meant dark mode was no longer the original
   design. Plain RGB numbers have nothing to convert, so nothing shifts.

## No flash of the wrong theme

The server renders the page before it knows which theme you picked, so there
are two problems to avoid: a flash of the wrong colours, and React complaining
that the page doesn't match what it rendered.

The fix is three small pieces:

1. The page starts as dark — a fixed, predictable default.
2. A tiny script in `<head>` reads your saved choice and applies it **before
   anything is drawn**. It notes what it picked on `data-theme`.
3. The React provider starts at that same default, then reads `data-theme`
   after loading. It never works the answer out twice, and React never sees a
   mismatch.

## What it does

- Remembers your choice
- Uses your computer's light/dark setting on a first visit
- Keeps following your computer **until** you pick something yourself
- Native scrollbars and form controls follow the theme too
- Still works if the browser blocks storage (private mode)

## Colours that shouldn't change

Not everything should flip:

- **White text on blue buttons.** The blue is the same in both themes, so the
  white stays too.
- **Dark overlays on photos.** Their job is to keep text readable against an
  image, and the image doesn't change.

There's a trap here worth mentioning. If you pin the dark overlay but let the
text on top of it follow the theme, light mode gives you dark text on a dark
overlay — invisible. So the text has to be pinned along with it. That's what
the `content-on-media` colour is for.

## The files

```
src/providers/theme-provider.tsx   the React provider
src/lib/theme/storage.ts           reading and writing the saved choice
src/types/theme.ts                 types
src/components/theme-toggle.tsx    the button
src/theme-tokens.css               all the colour values
src/tailwind-tokens.ts             the matching Tailwind config
```

## How I checked nothing broke

Comparing screenshots didn't work — image compression noise drowned out the
real differences.

What did work: run the old version and the new version side by side on two
ports, then ask the browser for the **actual colour of every element on the
page** and compare the two lists.

```js
for (const el of document.querySelectorAll('body *')) {
  const s = getComputedStyle(el)
  tally.color[s.color]++
  tally.bg[s.backgroundColor]++
}
```

No screenshots, no guesswork — just the real values. That's what caught the
HSL rounding problem, and what proved dark mode was unchanged once it was
fixed.

## License

MIT — see [LICENSE](LICENSE).
