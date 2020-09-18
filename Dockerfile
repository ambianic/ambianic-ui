FROM abiosoft/caddy
ADD ./dist ./app
ADD Caddyfile /etc/Caddyfile