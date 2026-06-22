# CartApp

Aplicación de carrito de compras desarrollada en Angular 17, utilizando **NgRx** para el manejo centralizado del estado, **componentes standalone** y **persistencia en `sessionStorage`** para mantener el carrito entre recargas.

El proyecto está pensado como la capa frontend de una arquitectura que más adelante puede conectarse a un backend en Spring Boot. Por ahora, el catálogo se sirve desde un origen en memoria a través de un `Observable`, de modo que migrar a un `HttpClient` requiere cambiar únicamente la implementación del servicio.

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | Angular 17 (standalone components) |
| Lenguaje | TypeScript 5.4 |
| Estado | NgRx (Store, Effects, Store DevTools) |
| Reactividad | RxJS 7 |
| Estilos | Bootstrap 5.3 |
| Alertas / confirmaciones | SweetAlert2 |
| Testing | Karma + Jasmine |

---

## Funcionalidades

- Catálogo de productos con tarjetas individuales.
- Agregar productos al carrito desde el catálogo (con notificación de éxito).
- Listado del carrito con cantidad, precio unitario, subtotal por producto y total general.
- Eliminar productos del carrito con confirmación previa.
- Persistencia automática del carrito en `sessionStorage` (sobrevive a recargas dentro de la misma pestaña).
- Recálculo del total como acción separada del *store*, evitando lógica duplicada en componentes.
- Navegación entre catálogo y carrito sin recargar la página (Angular Router).

---

## Cómo correr el proyecto

Requisitos: Node.js 18+ y Angular CLI 17 (`npm i -g @angular/cli@17`).

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd angular-spring-cart-app-master

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm start
```

La aplicación queda disponible en `http://localhost:4200/`. Cualquier cambio en el código recarga el navegador automáticamente.

### Otros scripts

```bash
npm run build      # Build de producción (sale en dist/)
npm run watch      # Build incremental en modo desarrollo
npm test           # Pruebas unitarias con Karma + Jasmine
```

---

## Estructura del proyecto

```
src/app/
├── app.component.*            # Componente raíz, monta <app-cart-app>
├── app.config.ts              # Configuración: rutas, Store, Effects, DevTools
├── app.routes.ts              # Rutas: /catalog y /cart
│
├── components/
│   ├── cart-app/              # Shell de la aplicación (navbar + router-outlet)
│   ├── catalog/               # Listado de productos
│   ├── product-card/          # Tarjeta individual de producto
│   ├── cart/                  # Vista del carrito
│   ├── modal-cart/            # Vista modal del carrito (alternativa)
│   └── navbar/                # Barra superior con contador de items
│
├── data/
│   └── product.data.ts        # Catálogo en memoria (provisional)
│
├── models/
│   ├── product.ts             # Modelo Product
│   └── itemCart.ts            # Modelo ItemCard (producto + cantidad)
│
├── services/
│   ├── product.service.ts     # Devuelve productos como Observable
│   └── sharing-data.service.ts# Bus de eventos entre componentes
│
└── store/
    ├── items.action.ts        # add, remove, total
    ├── items.reducer.ts       # Estado del carrito (+ hidratación de sessionStorage)
    ├── products.actions.ts    # load, findAll
    ├── prodcuts.reducer.ts    # Estado del catálogo
    └── effects/
        └── products.effects.ts# Effect que dispara findAll al recibir load
```

---

## Arquitectura y decisiones de diseño

### Estado con NgRx

El estado global se divide en dos *slices*:

- **`items`** — contiene los productos agregados al carrito y el total calculado. Las acciones son `add`, `remove` y `total`. El total se mantiene como una acción independiente que se despacha después de cada modificación, en lugar de calcularse dentro del propio reducer de `add`/`remove`. Esto separa responsabilidades y deja el cálculo en un solo lugar.
- **`products`** — contiene el catálogo. El `Effect` `loadProducts$` escucha la acción `load`, llama a `ProductService.findAll()` y despacha `findAll({ products })` con la respuesta. Este patrón deja preparada la transición a un backend real: basta con cambiar `of(products)` por una llamada HTTP.

Las NgRx Store DevTools están habilitadas (máx. 25 acciones) para inspeccionar el flujo de acciones desde la extensión de Redux DevTools del navegador.

### Comunicación entre componentes

Para evitar que componentes hijos despachen acciones directamente al *store* y se salten validaciones o confirmaciones, se utiliza un servicio intermedio (`SharingDataService`) que expone dos `EventEmitter`:

- `productEventEmitter` — se emite cuando el usuario presiona "Agregar al carrito" en una tarjeta.
- `idProductEventEmitter` — se emite cuando el usuario presiona "Eliminar" dentro del carrito.

El componente *shell* (`CartAppComponent`) se suscribe a ambos eventos en un único lugar, muestra el modal de confirmación con SweetAlert2 cuando corresponde, despacha las acciones al *store* y maneja la navegación. De esta forma, toda la lógica de orquestación vive en un solo componente.

### Persistencia del carrito

`items.reducer.ts` lee `sessionStorage['cardList']` al inicializar su estado, y `CartAppComponent` se suscribe al *store* para escribir de regreso en cada cambio. Esto permite recargar la página sin perder el carrito.

### Componentes standalone

El proyecto no usa `NgModule`. Cada componente declara sus propias dependencias en la propiedad `imports`, siguiendo el patrón recomendado a partir de Angular 14+.

---

## Posibles próximos pasos

- Conectar `ProductService` a un backend real (Spring Boot u otro) reemplazando `of(products)` por `HttpClient.get(...)`.
- Agregar autenticación de usuarios y persistir el carrito en base de datos en lugar de `sessionStorage`.
- Incrementar cobertura de pruebas unitarias para reducers, effects y componentes.
- Implementar lazy loading de rutas cuando el catálogo crezca.
- Tipar correctamente el *slice* de productos (actualmente usa `any` en el selector).

---

## Autor

**Bryan Acosta** — bacosta@premier.pr
