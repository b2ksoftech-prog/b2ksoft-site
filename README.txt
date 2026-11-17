B2Ksoftech site - files
  index.html              the website
  _headers                makes sure the page opens as a website
  functions/api/state.js  saves products to Cloudflare so "Publish to site" works instantly
Upload ALL of these (keeping the functions folder) to a GitHub repository, then connect it to Cloudflare Pages.
Setup needed in Cloudflare after the first deploy:
  1. Create a KV namespace (Storage & Databases > KV), e.g. b2k-store
  2. Pages project > Settings > Bindings > Add > KV namespace: variable name  B2K_KV  -> b2k-store
  3. Pages project > Settings > Variables and Secrets > Add secret: ADMIN_PASSWORD = your password
  4. Deployments > redeploy (Retry deployment) so the settings apply
