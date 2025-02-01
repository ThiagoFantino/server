# Dailyfitz server

Este servidor provee una base de datos para la aplicación disponible en: https://github.com/ThiagoFantino/dailyfitz. Se usó Prisma CLI. Acá se guardan todos los datos de los usuarios, las rutinas, los ejercicios realizados, etc.

## Instalación y ejecución:
Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/ThiagoFantino/server
```

Instala las dependencias necesarias ejecutando el siguiente comando en la terminal dentro del directorio del proyecto:

```bash
npm install
```
Crear un archivo .env que tenga la siguiente linea:

```bash
DATABASE_URL="file:./dev.db"
```
Usar los siguientes comandos en la terminal para las migraciones y generación de cliente:

```bash
npx prisma migrate dev
```

```bash
npx prisma generate
```
Para encender el servidor, usar el comando:

```bash
npm run dev
```
Y, si se quiere modificar la base de datos, se puede usar la herramienta Prisma Studio, accesible mediante el comando:

```bash
npx prisma studio
```

El servidor se abre en el puerto local 3000, y Prisma Studio en el 5555.


### Endpoints de Usuarios (UserRoute)
+ Obtener todos los usuarios (GET /)
+ Devuelve una lista de todos los usuarios registrados.
+ Crear un usuario (POST /signup)
+ Crea un nuevo usuario con los campos: nombre, apellido, email y password (encriptado).
+ Verifica que el email no esté registrado previamente.
+ Obtener usuario por ID (GET /:id)
+ Devuelve la información del usuario correspondiente al ID proporcionado.
+ Actualizar usuario y registrar rutina (PUT /:id)
+ Actualiza los datos personales del usuario (nombre, apellido, email, etc.).
+ Registra estadísticas de rutina (si se proporcionan tiempo, entrenamientos o calorías).
+ Iniciar sesión (POST /login)
+ Verifica el email y la contraseña del usuario.
+ Devuelve el ID del usuario si las credenciales son correctas.
+ Obtener estadísticas del usuario (GET /:id/stats)
+ Devuelve las estadísticas agrupadas por fecha para un usuario específico.
+ Obtener estadísticas filtradas por fecha (GET /:id/statsByDate)
+ Devuelve estadísticas específicas para una fecha solicitada.
+ Obtener estadísticas por periodo (GET /:id/statsByPeriod)
+ Devuelve estadísticas según un período (today, week, month, year).
+ Obtener estadísticas totales (GET /:id/totalStats)
+ Calcula y devuelve el total de tiempo, entrenamientos y calorías acumulados.
### Endpoints de Rutinas (RoutineRoute)
+ Obtener todas las rutinas (GET /)
+ Devuelve rutinas predefinidas y personalizadas asociadas al userId (opcional).
+ Crear una rutina (POST /)
+ Crea una nueva rutina con name e imagen opcional.
+ Obtener ejercicios de una rutina específica (GET /:id/exercises)
+ Devuelve los ejercicios de una rutina específica, incluyendo detalles como sets, reps y calorías.
+ Obtener todos los ejercicios (GET /exercises)
+ Devuelve una lista completa de ejercicios y sus rutinas asociadas.
+ Crear una rutina personalizada (POST /create-custom-routine)
+ Crea una rutina personalizada asociada a un usuario con ejercicios específicos (sets, reps, etc.).
+ Eliminar una rutina personalizada (DELETE /:id)
+ Elimina una rutina personalizada (no predefinida) junto con sus ejercicios asociados.

