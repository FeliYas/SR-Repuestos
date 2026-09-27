# SR Repuestos — Plan técnico de la segunda etapa

Este documento es la guía de trabajo para la segunda etapa. Debe actualizarse en cada sesión: marcar las tareas terminadas, anotar decisiones tomadas y registrar cualquier desvío del alcance.

## Estado general

- [ ] 1. Catálogo de productos en la zona privada
- [x] 2. Buscador unificado y flexible
- [ ] 3. Actualización de Instagram
- [ ] 4. Tarjetas de producto responsive
- [ ] 5. Detalle de novedades público y privado
- [x] 6. Sidebar en resultados de búsqueda pública
- [x] 7. Orden alfabético y por fecha
- [ ] 8. Pruebas integrales y revisión final

### Registro de avance

| Fecha | Tarea | Estado | Notas |
|---|---|---|---|
| — | Inicio de la segunda etapa | Pendiente | Base local actualizada con datos de producción y migraciones al día. |
| 2026-09-27 | 2. Buscador flexible | Completa | Lógica compartida para producto y subproducto; plural/singular, múltiples términos, códigos, medidas, datos descriptivos, categoría y marca. Paginación pública de 12 resultados. |
| 2026-09-27 | 6. Sidebar de búsqueda | Completa (alcance público) | `/busqueda` reutiliza el sidebar de categorías y marcas, marca filtros activos y conserva texto y filtro complementario. La variante privada se hará con el nuevo catálogo de la tarea 1. |
| 2026-09-27 | 7. Ordenamientos | Completa | Catálogo en orden alfabético, novedades por fecha descendente y retiro de Orden en los cinco CRUD sin eliminar columnas físicas. Se preservaron imágenes, Calidad e Instagram. |
| 2026-09-27 | Seguridad de pruebas y base local | Completa | Tests aislados en SQLite desde `Tests\\TestCase`. Base local restaurada desde el dump y migrada: 690 productos, 5.223 subproductos, 35 categorías y 53 marcas. |

## Decisiones ya tomadas

- La zona privada debe conservar la experiencia del catálogo público: entrada por categorías, listado de productos y detalle con tabla de subproductos.
- La diferencia privada estará en el precio correspondiente al cliente, la cantidad y la acción para agregar al carrito.
- Los precios iguales a cero no se mostrarán.
- La búsqueda será tolerante con mayúsculas, minúsculas, acentos, separadores, singular/plural y coincidencias parciales. No se incluirá corrección de errores de tipeo.
- Los subproductos se ordenarán por descripción y, en caso de empate, por código.
- Instagram seguirá usando acceso público. La API oficial de Meta no forma parte del alcance.
- En Novedades se rediseñará principalmente el detalle. La imagen dejará de ocupar el encabezado como banner.
- Las tarjetas de productos se corregirán en todos los listados. Las tarjetas de categorías del inicio no forman parte de este cambio.
- La columna `order` permanecerá físicamente en la base de datos, pero dejará de usarse para categorías, marcas, productos, subproductos y novedades.
- El orden independiente de imágenes de productos, archivos de Calidad e Instagram manual no debe modificarse.

## 1. Catálogo de productos en la zona privada

### Estado actual

La ruta `/privada/productos` muestra directamente una tabla paginada de subproductos. No replica el recorrido público por categorías, tarjetas de productos y página de detalle.

Referencias actuales:

- `routes/auth.php`: grupo autenticado de la zona privada.
- `app/Http/Controllers/SubProductoController.php`: método `indexPrivada`.
- `resources/js/pages/privada/productosPrivada.tsx`: listado privado actual.
- `resources/js/components/subproductosPrivadaRow.tsx`: precio por lista, cantidad y carrito.
- `app/Http/Controllers/ProductoController.php`: catálogo y detalle públicos que sirven como referencia.

### Implementación prevista

- [ ] Mantener `/privada/productos` como puerta de entrada para no romper el menú ni los enlaces del carrito.
- [ ] Agregar rutas autenticadas para categoría, producto y búsqueda privada.
- [ ] Reutilizar componentes visuales entre la zona pública y la privada en lugar de mantener dos catálogos duplicados.
- [ ] Adaptar todos los enlaces y breadcrumbs para que un usuario privado permanezca dentro de `/privada/...`.
- [ ] Mostrar en el detalle la información del producto, sus imágenes y la misma tabla de subproductos que en la zona pública.
- [ ] Agregar a la tabla privada las columnas Precio, Cantidad y Acción.
- [ ] Conservar los controles de cantidad y la integración con `react-use-cart`.
- [ ] Mantener el comportamiento existente: si el precio correspondiente es cero, no se muestra como precio disponible.
- [ ] Conservar paginación y filtros al volver desde un detalle.

### Regla de precios y seguridad

El servidor debe resolver el precio usando `auth.user.lista`:

- Lista `1` → `price_mayorista`.
- Lista `2` → `price_minorista`.
- Lista `3` → `price_dist`.
- Lista `4` → `price_lista_4`.

La respuesta privada debe exponer un único campo calculado, por ejemplo `price`, y no serializar las cuatro listas al navegador. Las rutas deben seguir dentro de los middleware `auth`, `verified` y `privada`. El valor agregado al carrito debe provenir de ese precio autorizado.

### Criterios de aceptación

- [ ] Un visitante no autenticado no puede consultar rutas ni precios privados.
- [ ] Un cliente puede navegar categoría → producto → subproducto sin salir de la zona privada.
- [ ] Cada tipo de cliente ve exclusivamente su precio.
- [ ] Un precio cero queda oculto y no se presenta como un precio válido.
- [ ] Agregar, cambiar cantidad y eliminar del carrito sigue funcionando.

## 2. Buscador unificado y flexible

### Estado actual

La búsqueda pública está en `ProductoController::SearchProducts` y ya consulta código, nombre, marca, código de subproducto y medida. La privada está en `SubProductoController::indexPrivada` y solamente consulta código y descripción del subproducto. La lógica está duplicada y no resuelve plurales como `PERNO`/`PERNOS`.

Las interfaces se encuentran en:

- `resources/js/components/searchBar.tsx`.
- `resources/js/components/searchBarPrivate.tsx`.
- `resources/js/pages/productos/productoSearch.tsx`.

### Implementación prevista

- [x] Crear un servicio o scope compartido para aplicar la misma búsqueda al catálogo público y privado.
- [x] Validar el texto recibido como string opcional, recortado y con un máximo razonable de caracteres.
- [x] Normalizar espacios y separadores; aprovechar la intercalación de MariaDB para coincidencias sin distinción de mayúsculas y acentos.
- [x] Dividir búsquedas de varias palabras en términos independientes.
- [x] Generar variantes singular/plural seguras para cada término. Para finales en `s` o `es`, probar también variantes sin esas terminaciones, conservando siempre el término original.
- [x] Usar consultas parametrizadas mediante Eloquent/Query Builder.
- [x] Buscar sobre estos datos:
  - Producto: código, nombre, aplicación, año y número original.
  - Marca y categoría: nombre.
  - Subproducto: código, descripción, medida, largo total y características.
- [x] Combinar correctamente texto, categoría y marca sin que los `OR` anulen los filtros seleccionados.
- [x] Devolver productos sin duplicados aunque coincidan varios subproductos.
- [x] Ordenar los resultados finales alfabéticamente por nombre de producto y código.
- [x] Usar el mismo comportamiento en todos los buscadores públicos y privados actuales.

### Casos mínimos

- [x] `perno`, `PERNO` y `pernos` encuentran el mismo producto.
- [x] Una palabra con o sin acento obtiene los mismos resultados.
- [x] Una búsqueda por código parcial encuentra el producto esperado.
- [x] Medidas como `700x750`, `700 X 750` o fragmentos equivalentes encuentran el subproducto asociado.
- [x] Una marca devuelve sus productos.
- [x] Texto + categoría + marca respeta los tres criterios.
- [x] Una búsqueda vacía no genera errores y conserva el catálogo correspondiente.

## 3. Actualización de Instagram

### Estado actual

`app/Services/InstagramFeedService.php` consulta endpoints públicos de Instagram, descarga imágenes y conserva registros locales. La sincronización ocurre al cargar el inicio después de vencer el caché. Si Instagram cambia o bloquea esos endpoints, se devuelve el contenido guardado y el feed queda desactualizado. No hay credenciales oficiales ni una ejecución programada independiente.

Otros puntos relacionados:

- `config/services.php`: configuración del usuario, App ID público y tiempo de caché.
- `routes/web.php`: consumo del feed desde el inicio.
- `app/Http/Controllers/InstagramController.php`: administración manual.
- `tests/Feature/InstagramFeedServiceTest.php`: cobertura inicial del servicio.

### Implementación prevista

- [ ] Registrar con claridad el endpoint, estado HTTP y motivo de los fallos sin guardar tokens ni información sensible.
- [ ] Revisar la estructura real de la respuesta pública y adaptar el extractor a publicaciones, reels y carruseles.
- [ ] Mantener más de un endpoint público como alternativa.
- [ ] Descargar las imágenes válidas al almacenamiento local y comprobar que el archivo exista antes de publicarlo.
- [ ] No eliminar publicaciones sincronizadas válidas si la respuesta llega vacía, incompleta o falla.
- [ ] Actualizar y depurar registros solamente después de una respuesta válida y completa.
- [ ] Invalidar el caché cuando una sincronización termine correctamente.
- [ ] Incorporar en el administrador una acción “Actualizar ahora” y mostrar el resultado o la fecha del último intento.
- [ ] Conservar las publicaciones manuales como respaldo cuando no haya contenido automático utilizable.

### Restricción conocida

El acceso público de Instagram no es una API estable ni garantizada. La solución debe ser resistente a fallos y conservar el último contenido válido, pero puede requerir ajustes futuros si Instagram vuelve a modificar sus endpoints.

## 4. Tarjetas de producto responsive

### Estado actual

Las tarjetas están repetidas en el catálogo, los resultados de búsqueda y los productos relacionados. Algunas usan anchos y alturas fijas; en celulares el código, la marca y el título pueden superponerse o desbordarse.

### Implementación prevista

- [ ] Crear un componente compartido de tarjeta de producto.
- [ ] Usarlo en el catálogo público, resultados, relacionados y nuevas pantallas privadas.
- [ ] Mantener una zona de imagen con proporción estable y `object-contain`.
- [ ] Separar código/marca y título en bloques que puedan crecer en altura.
- [ ] Evitar alturas fijas en el bloque de texto.
- [ ] Permitir quiebres de palabras largas y aplicar truncado controlado únicamente cuando no oculte información necesaria.
- [ ] Mantener una cuadrícula de una columna en móvil, dos en tablet y tres o cuatro cuando el ancho lo permita.
- [ ] Verificar que el área completa de la tarjeta siga siendo clickeable y tenga estado de foco visible.

### Criterios visuales

- [ ] Sin superposición entre código, marca y nombre a 360 px y 390 px.
- [ ] Imágenes completas, sin deformación.
- [ ] Tarjetas de una misma fila visualmente consistentes aunque los títulos tengan longitudes distintas.
- [ ] Sin scroll horizontal provocado por tarjetas o contenedores de ancho fijo.

## 5. Detalle de novedades público y privado

### Estado actual

`resources/js/pages/novedadesShow.tsx` y `resources/js/pages/privada/novedadesShow.tsx` usan la imagen como banner de 400 px con título superpuesto. El contenido queda separado debajo. Los listados de tarjetas ya son responsive y no forman parte central de este cambio.

### Implementación prevista

- [ ] Quitar la imagen de fondo del encabezado.
- [ ] Colocar tipo, título y texto como contenido normal y legible.
- [ ] Ubicar la imagen en un bloque propio, sin texto superpuesto.
- [ ] En escritorio, distribuir imagen y contenido aprovechando el ancho disponible; en móvil, apilarlos.
- [ ] Mantener el HTML enriquecido de la descripción dentro de un contenedor con estilos para párrafos, listas, enlaces e imágenes.
- [ ] Aplicar el mismo patrón al detalle público y privado mediante un componente compartido.
- [ ] Conservar las rutas y los listados actuales.

El diseño visual fino se ajustará al comenzar esta tarea con la referencia que entregue el cliente. La condición fija es que la imagen deje de ser banner y que título y descripción tengan una distribución clara.

## 6. Sidebar en resultados de búsqueda

### Estado actual

El catálogo por categoría usa `resources/js/components/catalogSidebarSection.tsx`, pero `productoSearch.tsx` muestra solamente una grilla fija de resultados.

### Implementación prevista

- [x] Reutilizar `CatalogSidebarSection` en los resultados públicos.
- [x] Mostrar categorías y marcas en orden alfabético.
- [x] Marcar los filtros activos.
- [x] Al elegir una categoría o marca, conservar el texto buscado y el otro filtro.
- [ ] Agregar el mismo sidebar a los resultados privados como parte de la unificación del catálogo (se completa junto con la tarea 1).
- [x] Mantener la apertura/cierre responsive y el buscador interno de cada sección.
- [x] Usar URLs con filtros persistentes para permitir volver, compartir y paginar sin perder el estado.

## 7. Orden alfabético y por fecha

### Reglas definitivas

- Categorías: `name ASC`, desempate por `id ASC`.
- Marcas: `name ASC`, desempate por `id ASC`.
- Productos: `name ASC`, luego `code ASC`, luego `id ASC`.
- Subproductos: `description ASC`, luego `code ASC`, luego `id ASC`.
- Novedades públicas y privadas: `created_at DESC`, luego `id DESC`.

### Lugares a revisar

- [x] Inicio público: categorías, selector completo y marcas.
- [x] Catálogo público y privado: sidebars, filtros, tarjetas y tablas.
- [x] Resultados de búsqueda.
- [x] Productos relacionados: seleccionar por las reglas existentes y presentar el conjunto final alfabéticamente.
- [x] Panel administrador y sus selectores de relaciones.
- [x] Exportaciones de productos y subproductos.
- [x] Novedades del inicio, listados públicos/privados y paneles de administración.

### Retiro de “Orden” del administrador

- [x] Quitar la columna de las tablas de Categorías, Marcas, Productos, Subproductos y Novedades.
- [x] Quitar el campo de los formularios de alta y edición.
- [x] Eliminar `order` de las validaciones y datos aceptados por esos controladores.
- [x] Ignorar el campo si llega desde una interfaz antigua.
- [x] En Categorías, dejar de exigirlo y usar el valor heredado de la base.
- [x] En Marcas, Productos y Subproductos, permitir que la base use su valor predeterminado `zzz`.
- [x] No crear una migración y no eliminar la columna.
- [x] No retirar `order` de `imagen_productos`, archivos de Calidad ni publicaciones manuales de Instagram.

Referencias principales: `CategoriaController`, `MarcaProductoController`, `ProductoController`, `SubProductoController`, `NovedadesController`, `NovedadesPrivadasController`, `routes/web.php` y los componentes `*AdminRow.tsx` correspondientes.

## 8. Pruebas y cierre

### Pruebas automáticas

- [x] Agregar pruebas de feature para los ordenamientos cubiertos en este bloque.
- [x] Probar que las altas cubiertas funcionan sin persistir `order` legado.
- [x] Probar búsqueda flexible y combinaciones de filtros.
- [ ] Probar que la zona privada exige autenticación.
- [ ] Probar cada lista de precio y confirmar que la respuesta no contiene las otras listas.
- [ ] Probar que los precios cero no se presentan como disponibles.
- [ ] Extender `InstagramFeedServiceTest` con respuestas válidas, vacías, incompletas y fallidas.
- [ ] Probar que un fallo de Instagram conserva el contenido almacenado.
- [x] Ejecutar las suites relacionadas con Pest dentro del contenedor (14 pruebas, 131 aserciones).
- [ ] Sanear la suite global heredada: los tests genéricos de usuarios no completan el `cuit` obligatorio.
- [x] Ejecutar `npm run build`.
- [ ] Sanear el chequeo global `npm run types`: existen errores heredados en numerosos componentes no relacionados.

### Revisión manual

- [ ] Recorrer catálogo y búsqueda pública.
- [ ] Recorrer catálogo, búsqueda, detalle y carrito con usuarios de las cuatro listas.
- [ ] Verificar 360, 390, 768 y 1200 px.
- [ ] Confirmar que no haya scroll horizontal ni textos superpuestos.
- [ ] Revisar el detalle de una novedad corta y otra con texto largo en ambas zonas.
- [ ] Forzar una actualización de Instagram desde el administrador y revisar el fallback ante un fallo.
- [ ] Confirmar que `php artisan migrate --pretend --force` indique que no hay migraciones nuevas para este alcance.

## Notas para las próximas sesiones

- Antes de modificar un archivo, revisar `git status` y preservar los cambios locales existentes.
- Ejecutar Artisan mediante Docker: `docker compose exec app php artisan ...`. El `.env` del host apunta a producción.
- Actualizar este documento al terminar cada bloque, agregando fecha y resultado en “Registro de avance”.
- Si aparece una decisión nueva del cliente, anotarla primero en “Decisiones ya tomadas” y después ajustar las tareas afectadas.
