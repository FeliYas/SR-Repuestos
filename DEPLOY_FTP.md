# Deploy a Hosting Legacy por FTP (FileZilla)

Este proyecto usa Docker solo en local. En el servidor del cliente no se ejecuta Docker.

## Regla principal

No subas archivos locales de desarrollo. El resto del codigo funciona normal en hosting viejo.

## Antes de subir

1. Asegura tener assets compilados (`public/build`):
```bash
npm install
npm run build
```
2. Si el servidor no corre `composer install`, subi tambien `vendor/`.
3. Verifica que `.env` de produccion se mantenga en el servidor (no pisarlo con uno local).

## Archivos/carpetas que NO deberias subir

- `.env`
- `.env.docker`
- `.env.docker.example`
- `docker/`
- `docker-compose.yml`
- `LOCAL_DOCKER.md`
- `node_modules/`
- `storage/logs/*`
- `.git/` y archivos de git

## Opcion A: Subida directa con FileZilla (recomendada)

1. Conecta al FTP y entra al `public_html` (o carpeta del sitio).
2. Sube los archivos del proyecto excluyendo la lista anterior.
3. Si el sitio usa carpeta publica separada, respeta la estructura actual del cliente.
4. Si cambiaste solo algunos archivos, sube solo esos para reducir riesgo.

## Opcion B: Subir un paquete comprimido

Si el panel del hosting permite descomprimir en servidor:

```bash
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='docker' \
    --exclude='.env' \
    --exclude='.env.docker' \
    --exclude='.env.docker.example' \
    --exclude='storage/logs/*' \
    -czf deploy-srrepuestos.tar.gz .
```

Despues subes `deploy-srrepuestos.tar.gz` y descomprimes desde el panel.

## Chequeo rapido post-deploy

1. Home carga sin error 500.
2. Formulario/contacto funciona.
3. Login/admin funciona.
4. Assets (`/build/...`) cargan sin 404.
5. Si falla algo de permisos, revisar `storage/` y `bootstrap/cache/`.
