# SR Repuestos — Plan técnico de la segunda etapa

Este documento es la guía de trabajo para la segunda etapa. Debe actualizarse en cada sesión: marcar las tareas terminadas, anotar decisiones tomadas y registrar cualquier desvío del alcance.

## Estado general

- [x] 1. Catálogo de productos en la zona privada
- [x] 2. Buscador unificado y flexible
- [x] 3. Actualización de Instagram
- [x] 4. Tarjetas de producto responsive
- [x] 5. Detalle de novedades público y privado
- [x] 6. Sidebar en resultados de búsqueda pública
- [x] 7. Orden alfabético y por fecha
- [ ] 8. Pruebas integrales y revisión final

### División del trabajo en tres grupos

Esta división define el orden de ejecución. Las casillas de cada tarea en «Estado general» indican su avance; el sidebar privado de la tarea 6 se completó con el catálogo privado del grupo 2.

- [x] **Grupo 1/3 — Base del catálogo (completo, 2026-09-27):** buscador unificado y flexible (tarea 2), sidebar de categorías y marcas en los resultados públicos (tarea 6) y orden alfabético y por fecha, incluido el retiro de «Orden» del administrador (tarea 7). Se trabajaron juntos porque afectan las mismas consultas, filtros y pantallas de resultados.
- [x] **Grupo 2/3 — Experiencia visual y zona privada (completo, 2026-10-05):** catálogo de productos privado (tarea 1), tarjetas de producto responsive (tarea 4) y nuevo detalle de novedades públicas y privadas (tarea 5). Incluye el sidebar de búsqueda privada de la tarea 6.
- [ ] **Grupo 3/3 — Integración y cierre (en curso):** integración de Instagram y correcciones adicionales implementadas; queda el saneamiento global de TypeScript y el recorrido manual de las cuatro listas privadas y los detalles de novedades.

### Registro de avance

| Fecha | Tarea | Estado | Notas |
|---|---|---|---|
| — | Inicio de la segunda etapa | Pendiente | Base local actualizada con datos de producción y migraciones al día. |
| 2026-09-27 | 2. Buscador flexible | Completa | Lógica compartida para producto y subproducto; plural/singular, múltiples términos, códigos, medidas, datos descriptivos, categoría y marca. Paginación pública de 12 resultados. |
| 2026-09-27 | 6. Sidebar de búsqueda | Completa (alcance público) | `/busqueda` reutiliza el sidebar de categorías y marcas, marca filtros activos y conserva texto y filtro complementario. La variante privada se completó el 2026-10-05 con el grupo 2. |
| 2026-09-27 | 7. Ordenamientos | Completa | Catálogo en orden alfabético, novedades por fecha descendente y retiro de Orden en los cinco CRUD sin eliminar columnas físicas. Se preservaron imágenes, Calidad e Instagram. |
| 2026-09-27 | Seguridad de pruebas y base local | Completa | Tests aislados en SQLite desde `Tests\\TestCase`. Base local restaurada desde el dump y migrada: 690 productos, 5.223 subproductos, 35 categorías y 53 marcas. |
| 2026-10-04 | Corrección del administrador de novedades | Completa | Alta pública acepta texto enriquecido largo; públicas y privadas muestran errores de validación concretos para imagen y otros campos; edición pública precarga tipo y título. No corresponde aún al rediseño del detalle de la tarea 5. |
| 2026-10-04 | División en tres grupos | Definida | Grupo 1 completo; grupo 2: catálogo privado, tarjetas responsive y detalle de novedades; grupo 3: Instagram y cierre integral. |
| 2026-10-05 | Grupo 2/3: catálogo privado | Completa | Recorrido categoría → producto → subproducto, búsqueda y filtros privados, precio único según lista de cliente, carrito y «Consultar» para precios nulos o cero. Verificados los cuatro tipos de lista y los controles de cantidad/eliminación. |
| 2026-10-05 | Grupo 2/3: tarjetas y novedades | Completa | Tarjetas compartidas y adaptables; detalle compartido de novedades con imagen independiente y texto enriquecido. Verificación visual en móvil y escritorio. |
| 2026-10-05 | Ajustes visuales del grupo 2/3 | Completa | El detalle público de novedades usa navbar blanco desde el inicio; tarjetas de productos y novedades tienen alto uniforme y texto limitado; la tabla privada separa precio y compra, y «Agregar» confirma visualmente la acción. |
| 2026-10-05 | Ajuste de navegación del grupo 2/3 | Completa | Se retiraron los breadcrumbs de los listados y detalles de productos privados para que no se superpongan con los filtros; se redujo el espacio superior del detalle público de novedades. |
| 2026-10-13 | Grupo 2/3 en Git | Completa | Los cambios locales del grupo 2 quedaron registrados en el commit `2bdb1fc` antes de iniciar el grupo 3. |
| 2026-10-13 | 3. Instagram | Implementada y verificada localmente | Los endpoints JSON anteriores responden 401. El perfil HTML público entrega el feed actual; la sincronización real guardó 12 publicaciones y sus imágenes locales. Actualización por primera visita luego de una hora, botón manual con estado y retención del feed ante fallos. |
| 2026-10-13 | Ajustes adicionales solicitados | Implementados | Las tarjetas públicas y privadas estiran la imagen para ocupar toda el área disponible; los bordes que vengan dentro del archivo se muestran tal como fueron subidos; la importación de subproductos permite vaciar Medida, Componente y Características cuando la columna existe en el Excel. |
| 2026-10-14 | Ajuste final de tarjetas de novedades | Completa | La imagen subida se estira hasta ocupar toda la zona de la tarjeta, sin recortes ni fondos agregados. Los bordes incorporados en el archivo se conservan. |
| 2026-10-19 | Incidencia de Instagram en producción | Parcialmente resuelta | Diagnóstico remoto: los endpoints públicos responden 429; el servidor puede escribir imágenes de prueba, por lo que no se comprobó un límite de peso como causa. Se desplegó el respaldo manual para mostrar publicaciones nuevas sobre el feed antiguo. Se probó que los mirrors abiertos no entregan el feed al servidor. Se integró como alternativa un proveedor de datos públicos sin la API oficial de Meta, pendiente de su clave de acceso para verificarlo con el perfil real. |
| 2026-10-13 | 8. Verificación de cierre | Parcial | Suite PHP: 72 pruebas y 433 aserciones. Build Vite correcto en `/tmp` por permisos de `public/build`. Revisión visual de novedades públicas y privadas, sincronización real y botón de administración. Sin migraciones pendientes. Sigue pendiente `npm run types` por 466 errores heredados en 64 archivos y el recorrido manual de las cuatro listas privadas y los detalles de novedades. |

## Decisiones ya tomadas

- La zona privada debe conservar la experiencia del catálogo público: entrada por categorías, listado de productos y detalle con tabla de subproductos.
- La diferencia privada estará en el precio correspondiente al cliente, la cantidad y la acción para agregar al carrito.
- Los precios iguales a cero no se mostrarán; el subproducto ofrecerá «Consultar» y no podrá agregarse al carrito desde el catálogo.
- La búsqueda será tolerante con mayúsculas, minúsculas, acentos, separadores, singular/plural y coincidencias parciales. No se incluirá corrección de errores de tipeo.
- Los subproductos se ordenarán por descripción y, en caso de empate, por código.
- La API oficial de Meta queda excluida por decisión del cliente. Ante el bloqueo 429 del acceso público, se usa un proveedor de datos públicos sin login de Instagram cuando está configurada su clave; sin ella, queda el acceso público anterior con pausa automática de seis horas ante un 429. El administrador conserva la carga y consulta manual.
- En Novedades se rediseñará principalmente el detalle. La imagen dejará de ocupar el encabezado como banner.
- Las tarjetas de productos se corregirán en todos los listados. Las tarjetas de categorías del inicio no forman parte de este cambio.
- La columna `order` permanecerá físicamente en la base de datos, pero dejará de usarse para categorías, marcas, productos, subproductos y novedades.
- El orden independiente de imágenes de productos, archivos de Calidad e Instagram manual no debe modificarse.

## 1. Catálogo de productos en la zona privada

### Estado anterior

La ruta `/privada/productos` muestra directamente una tabla paginada de subproductos. No replica el recorrido público por categorías, tarjetas de productos y página de detalle.

Referencias del estado anterior:

- `routes/auth.php`: grupo autenticado de la zona privada.
- `app/Http/Controllers/SubProductoController.php`: método `indexPrivada`.
- `resources/js/pages/privada/productosPrivada.tsx`: listado privado actual.
- `resources/js/components/subproductosPrivadaRow.tsx`: precio por lista, cantidad y carrito.
- `app/Http/Controllers/ProductoController.php`: catálogo y detalle públicos que sirven como referencia.

### Implementación prevista

- [x] Mantener `/privada/productos` como puerta de entrada para no romper el menú ni los enlaces del carrito.
- [x] Agregar rutas autenticadas para categoría, producto y búsqueda privada.
- [x] Reutilizar componentes visuales entre la zona pública y la privada en lugar de mantener dos catálogos duplicados.
- [x] Adaptar todos los enlaces para que un usuario privado permanezca dentro de `/privada/...`; retirar los breadcrumbs privados de productos.
- [x] Mostrar en el detalle la información del producto, sus imágenes y la misma tabla de subproductos que en la zona pública.
- [x] Agregar a la tabla privada las columnas Precio, Cantidad y Acción.
- [x] Conservar los controles de cantidad y la integración con `react-use-cart`.
- [x] Ocultar los precios cero y mostrar «Consultar» sin acción de agregado al carrito.
- [x] Conservar paginación y filtros al volver desde un detalle.

### Regla de precios y seguridad

El servidor debe resolver el precio usando `auth.user.lista`:

- Lista `1` → `price_mayorista`.
- Lista `2` → `price_minorista`.
- Lista `3` → `price_dist`.
- Lista `4` → `price_lista_4`.

La respuesta privada debe exponer un único campo calculado, por ejemplo `price`, y no serializar las cuatro listas al navegador. Las rutas deben seguir dentro de los middleware `auth`, `verified` y `privada`. El valor agregado al carrito debe provenir de ese precio autorizado.

### Criterios de aceptación

- [x] Un visitante no autenticado no puede consultar rutas ni precios privados.
- [x] Un cliente puede navegar categoría → producto → subproducto sin salir de la zona privada.
- [x] Cada tipo de cliente ve exclusivamente su precio.
- [x] Un precio cero queda oculto y no se presenta como un precio válido.
- [x] Agregar, cambiar cantidad y eliminar del carrito sigue funcionando.

## 2. Buscador unificado y flexible

### Estado anterior

Antes del grupo 1, la búsqueda pública estaba en `ProductoController::SearchProducts` y la privada en `SubProductoController::indexPrivada`, con lógica duplicada. El grupo 1 agregó `ProductSearchService` y el grupo 2 conectó la nueva búsqueda privada al catálogo compartido.

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

### Estado anterior

`app/Services/InstagramFeedService.php` consultaba endpoints públicos de Instagram, descargaba imágenes y conservaba registros locales. La sincronización ocurría al cargar el inicio después de vencer el caché. Al bloquear Instagram esos endpoints, el contenido guardado quedaba desactualizado. No hay credenciales oficiales ni una ejecución programada independiente.

Otros puntos relacionados:

- `config/services.php`: configuración del usuario, App ID público y tiempo de caché.
- `routes/web.php`: consumo del feed desde el inicio.
- `app/Http/Controllers/InstagramController.php`: administración manual.
- `tests/Feature/InstagramFeedServiceTest.php`: cobertura inicial del servicio.

### Implementación prevista

- [x] Registrar con claridad el endpoint, estado HTTP y motivo de los fallos sin guardar tokens ni información sensible.
- [x] Revisar la estructura real de la respuesta pública y adaptar el extractor a publicaciones, reels y carruseles.
- [x] Mantener más de un endpoint público como alternativa.
- [x] Descargar las imágenes válidas al almacenamiento local y comprobar que el archivo exista antes de publicarlo.
- [x] No eliminar publicaciones sincronizadas válidas si la respuesta llega vacía, incompleta o falla.
- [x] Actualizar y depurar registros solamente después de una respuesta válida y completa.
- [x] Incorporar publicaciones de respuestas parciales y colaboraciones del perfil sin depurar registros anteriores.
- [x] Invalidar el caché cuando una sincronización termine correctamente.
- [x] Incorporar en el administrador una acción “Actualizar ahora” y mostrar el resultado o la fecha del último intento.
- [x] Conservar las publicaciones manuales como respaldo cuando no haya contenido automático utilizable.
- [x] Mostrar publicaciones manuales recientes antes del feed automático antiguo durante una falla.
- [x] Incorporar lectura por ScrapeCreators cuando exista su clave, sin consultar endpoints públicos de Instagram en ese caso.
- [x] Pausar seis horas las consultas automáticas después de un 429 y conservar el contenido guardado.
- [ ] Configurar `INSTAGRAM_SCRAPECREATORS_KEY` en producción y verificar una sincronización real con las publicaciones recientes. La clave se obtiene en una cuenta gratuita de ScrapeCreators, sin acceso a Meta.

### Restricción conocida

El acceso público de Instagram no es una API estable ni garantizada. La solución debe ser resistente a fallos y conservar el último contenido válido, pero puede requerir ajustes futuros si Instagram vuelve a modificar sus endpoints.

## 4. Tarjetas de producto responsive

### Estado anterior

Las tarjetas están repetidas en el catálogo, los resultados de búsqueda y los productos relacionados. Algunas usan anchos y alturas fijas; en celulares el código, la marca y el título pueden superponerse o desbordarse.

### Implementación prevista

- [x] Crear un componente compartido de tarjeta de producto.
- [x] Usarlo en el catálogo público, resultados, relacionados y nuevas pantallas privadas.
- [x] Mantener una zona de imagen con proporción estable y `object-contain`.
- [x] Separar código/marca y título en bloques que puedan crecer en altura.
- [x] Evitar alturas fijas en el bloque de texto.
- [x] Permitir quiebres de palabras largas sin ocultar información necesaria.
- [x] Mantener una cuadrícula de una columna en móvil, dos en tablet y tres o cuatro cuando el ancho lo permita.
- [x] Verificar que el área completa de la tarjeta siga siendo clickeable y tenga estado de foco visible.

### Criterios visuales

- [x] Sin superposición entre código, marca y nombre a 360 px y 390 px.
- [x] Imágenes completas, sin deformación.
- [x] Tarjetas de una misma fila visualmente consistentes aunque los títulos tengan longitudes distintas.
- [x] Sin scroll horizontal provocado por tarjetas o contenedores de ancho fijo.

## 5. Detalle de novedades público y privado

### Estado anterior

`resources/js/pages/novedadesShow.tsx` y `resources/js/pages/privada/novedadesShow.tsx` usan la imagen como banner de 400 px con título superpuesto. El contenido queda separado debajo. Los listados de tarjetas ya son responsive y no forman parte central de este cambio.

### Implementación prevista

- [x] Quitar la imagen de fondo del encabezado.
- [x] Colocar tipo, título y texto como contenido normal y legible.
- [x] Ubicar la imagen en un bloque propio, sin texto superpuesto.
- [x] En escritorio, distribuir imagen y contenido aprovechando el ancho disponible; en móvil, apilarlos.
- [x] Mantener el HTML enriquecido de la descripción dentro de un contenedor con estilos para párrafos, listas, enlaces e imágenes.
- [x] Aplicar el mismo patrón al detalle público y privado mediante un componente compartido.
- [x] Conservar las rutas y los listados actuales.

Sin referencia visual del cliente, se adoptó una composición limpia y concisa: imagen en un bloque propio y título con texto largo a su lado en escritorio, apilados en móvil.

## 6. Sidebar en resultados de búsqueda

### Estado anterior

El catálogo por categoría usa `resources/js/components/catalogSidebarSection.tsx`, pero `productoSearch.tsx` muestra solamente una grilla fija de resultados.

### Implementación prevista

- [x] Reutilizar `CatalogSidebarSection` en los resultados públicos.
- [x] Mostrar categorías y marcas en orden alfabético.
- [x] Marcar los filtros activos.
- [x] Al elegir una categoría o marca, conservar el texto buscado y el otro filtro.
- [x] Agregar el mismo sidebar a los resultados privados como parte de la unificación del catálogo (se completó junto con la tarea 1).
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
- [x] Probar que la zona privada exige autenticación.
- [x] Probar cada lista de precio y confirmar que la respuesta no contiene las otras listas.
- [x] Probar que los precios cero no se presentan como disponibles.
- [x] Extender `InstagramFeedServiceTest` con respuestas válidas, vacías, incompletas y fallidas.
- [x] Probar que un fallo de Instagram conserva el contenido almacenado.
- [x] Ejecutar la suite PHP completa dentro del contenedor (71 pruebas, 430 aserciones).
- [x] Sanear la suite global heredada: los tests genéricos de usuarios no completaban el `cuit` obligatorio y el entorno no activaba `testing`.
- [x] Ejecutar `npm run build -- --outDir /tmp/srrepuestos-stage3-build` (el directorio normal tiene permisos ajenos).
- [ ] Sanear el chequeo global `npm run types`: quedan 466 errores heredados en 64 archivos. Los archivos modificados para Instagram, tarjetas e importación no agregan errores de tipos.

### Revisión manual

- [x] Recorrer catálogo y búsqueda pública en escritorio y 360, 390 y 768 px.
- [ ] Recorrer catálogo, búsqueda, detalle y carrito con usuarios de las cuatro listas.
- [x] Verificar las tarjetas de novedades en 360, 390, 768 y 1200 px.
- [x] Confirmar que las novedades públicas y privadas no tengan scroll horizontal ni textos superpuestos en los anchos revisados.
- [ ] Revisar el detalle de una novedad corta y otra con texto largo en ambas zonas.
- [x] Forzar una actualización real de Instagram desde el administrador; fallback y retención comprobados con respuestas fallidas en tests.
- [x] Confirmar que `php artisan migrate --pretend --force` indique que no hay migraciones nuevas para este alcance.

## Ajustes adicionales del grupo 3

- [x] Tarjetas de novedades públicas y privadas: una sola imagen con `object-fill` ocupa toda el área de la tarjeta, aunque cambie su proporción. Los bordes incluidos en el archivo original se conservan.
- [x] Carga masiva de subproductos: un campo vacío en una columna presente de Medida, Componente o Características borra el valor anterior; una columna ausente lo conserva. Código, producto y descripción siguen siendo obligatorios; un precio vacío conserva el precio existente.
- [x] Registro público: se guarda pendiente de autorización y con lista predeterminada, sin aceptar que el visitante se autorice o cambie la lista.

## Notas para las próximas sesiones

- Antes de modificar un archivo, revisar `git status` y preservar los cambios locales existentes.
- Ejecutar Artisan mediante Docker: `docker compose exec app php artisan ...`. El `.env` del host apunta a producción.
- Actualizar este documento al terminar cada bloque, agregando fecha y resultado en “Registro de avance”.
- Si aparece una decisión nueva del cliente, anotarla primero en “Decisiones ya tomadas” y después ajustar las tareas afectadas.
