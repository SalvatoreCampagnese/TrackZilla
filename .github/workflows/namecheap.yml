name: Deploy to GitHub Pages

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install

      - run: npm run build

      - name: Copy index.html to 404.html
        run: cp dist/index.html dist/404.html

      - name: Debug build output
        run: |
          echo "Listing contents of the root directory..."
          ls -la
          echo "Listing contents of the dist directory..."
          ls -R dist

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GH_PAT }}
          publish_dir: ./dist
          cname: mysimpledomain.com
          force_orphan: true
