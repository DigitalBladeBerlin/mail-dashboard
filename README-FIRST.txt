HOW TO IMPORT INTO GITHUB

Option A: Web (easiest)
1) Go to your GitHub repo page.
2) Click "Add file" > "Upload files".
3) Drag-and-drop *all files* from this ZIP (including folders) into the page.
4) Commit directly to main.

Option B: Local
1) Unzip into your repo folder.
2) git add . && git commit -m "bootstrap scaffold" && git push

Then:
- pnpm i
- psql "$DATABASE_URL" -f sql/schema.sql
- pnpm dev
