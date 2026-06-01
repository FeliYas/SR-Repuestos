# Entorno local con Docker

Docker se usa solo en local. El deploy del cliente sigue siendo por FTP.

## Arranque rapido

```bash
cp .env.docker.example .env.docker
docker compose up -d --build
```

## Base de datos

El dump ya se puede importar con:

```bash
docker compose exec -T db mysql -u sruser -psrpass srrepuestos < /home/fefu/Downloads/sr-db.sql
```

## Si bajaste FTP sin vendor

No hay problema. Regeneralo:

```bash
docker compose exec -T app composer install
```

## Levantar Laravel

```bash
docker compose exec -T app php artisan migrate --force
```

App: `http://localhost:8080`

## Frontend (hot reload)

Con el `docker compose up -d` ya se levanta `node` automaticamente.

Vite: `http://localhost:5173`
