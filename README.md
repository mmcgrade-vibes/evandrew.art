# evandrew.art

Evan Drew's site: private drawing lessons plus a portfolio. Built with Next.js (App Router), GSAP and Lenis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| What | Where |
|---|---|
| Copy, contact details and menu links | `src/content/site.ts` |
| Gallery pieces (title, year, medium, description, order) | `src/content/work.ts` |
| Artwork images | `public/work/<slug>.jpg` |
| Type and colour tokens (match the Figma variables) | `src/app/globals.css` |
| Smooth scroll (Lenis driven by the GSAP ticker) | `src/components/SmoothScroll.tsx` |
| Page transitions and scroll reveals | `src/components/Transition.tsx` |
| Pinned home page gallery | `src/components/Gallery.tsx` |
| Endless grid view (`/work`) | `src/components/InfiniteGrid.tsx` |
| Piece detail pages (`/work/<slug>`) | `src/components/PieceDetail.tsx` |
| Strip and grid toggle icons (Lottie JSON, play on hover) | `src/icons/*.json`, `src/components/LottieIcon.tsx` |
| Header and menu overlay | `src/components/Header.tsx` |

## How the motion works

- **Gallery:** the section is taller than the screen and its contents are sticky. Vertical scroll progress maps to a piece index. Each piece is a narrow blurred slice until it nears the centre, where it opens to full width. When scrolling stops, it settles on the nearest piece. Clicking a slice scrolls to it.
- **Grid view:** one block of tiles is repeated to cover the screen and shifted by the pan position, so it never ends in any direction. Pan with the wheel, trackpad, drag, touch or arrow keys. A click opens the piece.
- **Detail pages:** pieces stack down the left and scroll while the text on the right stays put and follows the piece in view. The thumbnail row is a map of the page: pieces already passed gather on the left.
- **Page transitions:** use `TLink` in place of `next/link`. The current page fades and lifts out, the route and colour theme change, then the new page settles in. The header sits outside `<main>` and never moves.
- **Reveals:** add `data-reveal="0.2"` (delay in seconds) to fade an element up when it enters the screen, or `data-parallax="-8"` to drift it while scrolling.
- **Reduced motion:** visitors who ask for reduced motion get native scrolling and no animation.

## To do before launch

- **Fonts:** the four files in `public/fonts` are trial versions for review. They have a reduced character set, so some punctuation shows in a fallback font. Replace them with licensed `.woff2` files (same file names, or update the `@font-face` rules in `globals.css`) before the site goes public.
- **Missing pieces:** "Portrait of Plonk" and "Portrait of Gus and Beans" have no image yet.
- **Photos:** the home hero uses a drawing as a stand-in and the About page has a placeholder block, both waiting on photos of Evan.
- **Contact details:** confirm the email in `src/content/site.ts` and add a phone number if wanted.
- **Booking:** the contact form opens the visitor's mail app. Swap it for a scheduling tool with deposits once one is chosen.

## Deploy

Push to GitHub and import the repo at vercel.com/new. No settings need changing.
