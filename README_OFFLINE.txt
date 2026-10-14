Arnob D’Costa — Interactive offline portfolio preview

Open index.html in your browser, then choose Hire Me and launch either demo.
Works from extracted files: no server, no API credentials, no AI calls, no database.

DIRECT DEMOS
  demos/market58/index.html  — Recreated original Streamlit workflow with frozen figures from the supplied October 10 2026 PDF. Tabs, evidence filtering, charts, replay progress, funnel cards, PDF/CSV downloads.
  demos/audiencelab/index.html — Original AudienceLab HTML/CSS/animated SVG face with read-only replay of 4 genuine saved exchanges and existing VAD values.

REPORTS
  downloads/Market58_Ridgeway_Cargo_Report.pdf — actual 29-page generated report.
  downloads/Market58_Evidence.csv — separately supplied original evidence export.
  downloads/Market58_Classified.csv — separately supplied classification export. WARNING: classifications/relevance labels are not identical to PDF report's run.
  downloads/Market58_Pain_Taxonomy.json — separately supplied taxonomy export, not identical to report taxonomy.
  downloads/AudienceLab_Selected_Interview.json — 4 selected authentic Q&A pairs and synthetic persona metadata. Adversarial test exchanges were omitted from the public-facing demo.

ABOUT THE DEMOS
Market58 uses a recreation of the Streamlit frontend based on the supplied original app.py; full Streamlit runtime could not be launched in the available environment because the dependency was unavailable. AudienceLab original backend was started in demo mode and verified working, and the UI was preserved for the static replay. This preview is not the original live apps.

SAFETY
No secrets, key files, model credentials, private databases, or original server source code are included in this preview. The demos contain no fetch/XHR/WebSocket calls and don't send anything to a remote model. External portfolio links to LinkedIn or public evidence URLs will navigate online only if clicked. The old GA4 placeholder remains commented out (not active).

DEPLOYMENT
NOT deployed to Cloudflare/GitHub or arnob58.com. Test locally before any future publication.
