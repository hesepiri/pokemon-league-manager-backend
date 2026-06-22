# Pokémon League Manager - Back-end

Backend for Pokemon Team Builder and Dashboard

## Enlace al Servidor Público

El backend de esta aplicación se encuentra completamente desplegado y disponible en:

- **URL Pública:** https://api.pkmnleaguemngr-hspr.mooo.com

---

Este proyecto es el backend de la aplicación **Liga Pokémon**, diseñado para gestionar usuarios, autenticación segura mediante JWT y el almacenamiento de Pokémon favoritos/guardados obtenidos desde la PokéAPI.

---

## 🚀 Tecnologías y Dependencias

### Tecnologías Usadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express.js**: Framework web rápido y minimalista para la creación de la API RESTful.
- **MongoDB & Mongoose**: Base de datos NoSQL y ODM para el modelado de datos de usuarios y pokémones.

### Dependencias Principales (`dependencies`)

- `express`: Framework para el manejo de rutas y peticiones HTTP.
- `mongoose`: Conector y modelador de datos para MongoDB.
- `jsonwebtoken` (JWT): Generación y verificación de tokens para la autenticación segura.
- `bcryptjs`: Encriptación de contraseñas de usuarios.
- `dotenv`: Gestión de variables de entorno de forma segura.
- `cors`: Configuración de Intercambio de Recursos de Origen Cruzado.
- `validator`: Validación de cadenas de texto (como emails y URLs).

### Dependencias de Desarrollo (`devDependencies`)

- `nodemon`: Reinicio automático del servidor local durante el desarrollo.

---

## ⚙️ Variables de Entorno (`.env`)

Para que el servidor funcione correctamente, se debe crear un archivo `.env` en la raíz del proyecto. A continuación se muestra un ejemplo de la estructura requerida (**`.env.example`**):

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pokemon_league_db
```

## 🛣️ Endpoints Soportados (Rutas de la API)

La API cuenta con un manejo de seguridad basado en JWT. Los endpoints privados requieren que se envíe el token en el encabezado `Authorization: Bearer <JWT>`.

### Autenticación y Usuarios (Públicos)

- **`POST /signup`**: Registra un nuevo usuario en la base de datos.
  - _Body (JSON)_: `{ "email": "user@test.com", "password": "password123", "name": "Héctor" }`
- **`POST /signin`**: Autentica a un usuario existente y devuelve un token JWT.
  - _Body (JSON)_: `{ "email": "user@test.com", "password": "password123" }`

### Usuarios (Privados)

- **`GET /users/me`**: Obtiene el perfil del usuario autenticado actual a partir del token.

### Gestión de Pokémon (Privados)

- **`GET /pokemons`**: Recupera todos los pokémones guardados por el usuario autenticado.
- **`POST /pokemons`**: Guarda un pokémon en la lista de favoritos del usuario.
  - _Body (JSON)_:
    ```json
    {
      "keyword": "steel, rock",
      "title": "Iron-thorns",
      "text": "Quark Drive",
      "date": "21/6/2026",
      "source": "PokéAPI",
      "link": "[https://www.pokemon.com/es/pokedex/iron-thorns](https://www.pokemon.com/es/pokedex/iron-thorns)",
      "image": "[https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/995.png](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/995.png)"
    }
    ```
- **`DELETE /pokemons/:pokemonId`**: Elimina un pokémon guardado de la base de datos local usando su `_id`.

---

## 🧪 Pruebas de la API (Testing)

Puedes realizar pruebas en tus endpoints utilizando herramientas como **Postman** o directamente desde tu terminal mediante **cURL**.

### 1. Pruebas con cURL

**Registro de Usuario (`POST /signup`):**

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "hector@test.com", "password": "password123", "name": "Héctor"}'
```

**Inicio de Sesión (`POST /signin`) — _Obtener Token_:**

```bash
curl -X POST http://localhost:3000/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "hector@test.com", "password": "password123"}'
```

**Guardar un Pokémon (`POST /pokemons`) — _Requiere Token_:**

```bash
curl -X POST http://localhost:3000/pokemons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -d '{"keyword": "rock", "title": "Onix", "text": "Sturdy", "date": "21/6/2026", "source": "PokéAPI", "link": "[https://url.com](https://url.com)", "image": "[https://url.com/img.png](https://url.com/img.png)"}'
```

### 2. Pruebas con Postman

1. **Crear una nueva petición** eligiendo el método HTTP correspondiente (`GET`, `POST`, `DELETE`).
2. Introducir la URL completa (ej. `http://localhost:3000/signin`).
3. Para los métodos `POST`, ir a la pestaña **Body**, seleccionar la opción **raw** y cambiar el formato a **JSON**. Ingresa el objeto correspondiente.
4. Para los endpoints protegidos (`/users/me`, `/pokemons`), ve a la pestaña **Authorization**, selecciona **Bearer Token** en el menú desplegable y pega el string del token obtenido en el `/signin`. ¡Listo!

---

## 📁 Arquitectura y Escalabilidad

Siguiendo las sugerencias de la revisión del proyecto, la estructura de archivos se ha diseñado de forma modular. Las rutas han sido extraídas a un directorio independiente `/routes`, lo que aísla la lógica de enrutamiento de la inicialización del servidor de Express, permitiendo una lectura limpia y una escalabilidad inmediata para futuras fases de desarrollo.
