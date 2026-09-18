# ShopHub

Plataforma de comercio electrónico construida con Next.js (App Router), TypeScript y React Context API. Consume el catálogo de la API pública de DummyJSON y maneja un carrito global con flujo de checkout.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## Cómo correrlo

```bash
npm install
npm run dev
```

La aplicación queda en `http://localhost:3000`.

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Catálogo de productos |
| `/productos/[id]` | Detalle de un producto |
| `/checkout` | Resumen del carrito y formulario de compra |

## Estructura

## Endpoints consumidos

- Catálogo: `GET https://dummyjson.com/products?limit=8&select=id,title,price,category,thumbnail,stock`
- Detalle: `GET https://dummyjson.com/products/{id}`

---

## Decisiones de Arquitectura y Cambios del Parcial

### 1. Evolución del Contexto

En el preparcial el carrito era una lista plana de productos y el contexto solo exponía `addToCart` y el contador. El problema era obvio apenas uno agregaba dos veces lo mismo: quedaban dos entradas iguales en el arreglo.

Para el parcial cambié el modelo a una colección de `CartItem`, que es un objeto `{ product, quantity }`. Con eso cada producto aparece una sola vez y lo que cambia es el número de unidades.

El contexto ahora expone cinco operaciones: `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart` y `clearCart`.

En ninguna de las cinco modifico el arreglo ni los objetos que ya están guardados. Siempre uso métodos que devuelven estructuras nuevas:

- Cuando el producto ya está en el carrito uso `map`, que me devuelve un arreglo nuevo, y adentro hago spread del item (`{ ...item, quantity: item.quantity + 1 }`) para que ese objeto también sea nuevo. Si hiciera `item.quantity++` la referencia quedaría igual, React compararía lo mismo contra lo mismo y no habría re-render. El contador del header simplemente no se movería.
- Cuando el producto es nuevo hago spread del arreglo anterior: `[...prev, { product, quantity: 1 }]`.
- En `decreaseQuantity` encadeno `map` y después `filter`. El `map` baja la cantidad y el `filter` bota los que quedaron en 0. Así la eliminación automática sale del mismo flujo y no tuve que meter un `if` aparte.
- `removeFromCart` es un `filter` y `clearCart` asigna `[]`.

Todas usan la forma funcional de `setItems` (`setItems(prev => ...)`) en vez de leer `items` directamente. Si el usuario hace varios clics rápidos, leer `items` de la clausura me daría un valor viejo y se perderían actualizaciones.

### 2. Cálculo de Totales

No guardé ni el total de artículos ni el precio total en `useState`. Los dos salen completamente de `items`, que ya es la fuente de verdad del carrito.

Si los guardara aparte tendría dos cosas que mantener sincronizadas a mano. Cada vez que agregara una operación nueva al contexto tendría que acordarme de actualizar también los totales, y el día que se me olvide en una sola, el header va a mostrar un número y el carrito va a tener otro. Con un solo estado ese bug no puede pasar.

El cálculo es un `reduce` dentro de un `useMemo` que depende de `items`:

- `totalItems` suma los `quantity`.
- `totalPrice` suma `product.price * quantity`.

El `useMemo` está más por consistencia que por rendimiento. Con 8 productos el `reduce` no cuesta nada; lo que me da es que no se recalcule cuando el provider re-renderiza por algo que no tiene que ver con el carrito, y que la referencia del valor quede estable entre renders.

### 3. Arquitectura del Formulario

El formulario de `/checkout` es controlado de punta a punta. Cada campo tiene su `value` (o `checked` en el caso del checkbox) atado a un objeto de estado `form`, y todos apuntan al mismo `onChange`. El handler usa el atributo `name` del input como clave computada, así que con una sola función manejo los cuatro campos en vez de tener un handler por cada uno.

El checkbox tiene una rama aparte porque su valor no está en `e.target.value` sino en `e.target.checked`. Si lo leyera como los demás siempre me llegaría `"on"` y la validación de términos nunca funcionaría.

Hay dos tipos de información en juego y los traté distinto:

- **Los errores los calculo, no los guardo.** Se recalculan en cada render a partir de `form`: nombre de mínimo 5 caracteres y correo contra una expresión regular. Guardarlos en estado sería redundante porque ya se pueden deducir del valor actual del campo.
- **`touched` sí es estado.** Ahí guardo, por campo, si el usuario ya entró y salió. Eso no se puede deducir de `form`: un campo vacío al cargar la página y un campo vacío después de que el usuario lo visitó y lo dejó en blanco se ven exactamente igual. Necesitaba esa información aparte para que el error salga en el `onBlur` y no apenas abre el checkout, que era lo que pedía el enunciado.

El botón de confirmar se deshabilita con una bandera `isFormValid` que pide que no haya errores, que haya método de pago seleccionado, que los términos estén marcados y que el carrito no esté vacío.

En el submit hago `e.preventDefault()` para que no se recargue la página, y manejo un `isSubmitting` que deshabilita el botón y le cambia el texto mientras corre la promesa, que simulé con un `setTimeout` de 1.5 segundos. Además puse un `return` temprano en el handler si ya está enviando, porque el `disabled` bloquea el clic pero no bloquea un submit disparado con Enter.

Al terminar llamo a `clearCart()`, devuelvo el formulario a sus valores iniciales, limpio `touched` y muestro la pantalla de confirmación. El contador del header se va a 0 solo, porque consume el mismo contexto y el checkout no tiene que avisarle nada.

No usé librerías de formularios ni de validación. Todo está con hooks nativos (`useState`, `useMemo`) y TypeScript para tipar el modelo. Para cuatro campos, meter React Hook Form o Zod era agregar dependencias sin ganar nada.
