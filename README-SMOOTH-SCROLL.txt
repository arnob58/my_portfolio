ARNOB58 / ROBERT D'COSTA — OFFLINE ANIMATED PORTFOLIO
======================================================
This version is an offline preview only. It has NOT been deployed or pushed to GitHub.

WHAT CHANGED
------------
- Removed the entire “Start where you are / Two doors. Pick yours.” section from the homepage.
- Changed the homepage call-to-action buttons to scroll to work and Market58 on the same page.
- Replaced the split-path homepage navigation with sticky in-page section links.
- Added an animated scroll-progress bar and contextual back-to-top button.
- Added subtle scrolling entrances for headings, cards, timeline, gallery, project demos and testimonial.
- Added hover transitions and section dividers, plus a gentle first-load hero entrance.
- Added count-up animation for the real Market58 research totals.
- Kept responsive mobile navigation and full keyboard access.
- Followed reduced-motion OS preferences; animations automatically diminish for users who request it.
- Both existing Market58 and AudienceLab INTERACTIVE embedded demos are unchanged.
- Both original site pages are retained, including the dedicated /hire-me/ view.

LOCAL PREVIEW
-------------
Extract this ZIP. In arnob58-landing, open index.html in a browser.
For the most reliable results with the embedded demo iframes, run a simple local server:

    python -m http.server 8000

Then open http://localhost:8000/ and http://localhost:8000/hire-me/

No dependencies, AI calls, API keys, deploy configuration, or external JavaScript libraries were added by this update. The GA snippet present in the previous version remains commented out.

FILES ADDED
-----------
  motion.css   — animations, section navigation and responsive styling
  motion.js    — native scrolling progress, active section, reveal and count-up logic
