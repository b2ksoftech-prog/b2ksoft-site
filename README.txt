B2Ksoftech site (Cloudflare Worker with static assets)
  public/index.html   the website        public/_headers   serves it as a web page
  src/worker.js       saves products to KV (/api/state)
  wrangler.jsonc      settings + KV binding B2K_KV
Add the secret ADMIN_PASSWORD in Cloudflare: project > Settings > Variables and Secrets.
