import { type PrismaClient } from "@prisma/client";
import { Router } from "express";

const UserRoute = (prisma: PrismaClient) => {
  const router = Router();

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
  });

  // Crear un nuevo usuario
  router.post('/signup', async (req, res) => {
    const { nombre, apellido, calorias, entrenamientos, tiempo, email, password } = req.body;

    try {
      const result = await prisma.user.create({
        data: {
          nombre,
          apellido,
          calorias,
          entrenamientos,
          tiempo,
          email,
          password, // Guardar la contraseña tal cual
        },
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario.' });
    }
  });

  // Obtener un usuario por ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
  });

  // Actualizar los tiempo de un usuario por ID
  router.put('/:id', async (req, res) => {
    const { tiempo, entrenamientos, calorias } = req.body;
    const { id } = req.params;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          tiempo, // Actualizar los tiempo
          entrenamientos, // Actualizar los entrenamientos
          calorias,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar los tiempo y entrenamientos.' });
    }
  });

  // Ruta para login (sin bcrypt por ahora)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar al usuario por el email en la base de datos
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        // Comparar la contraseña recibida con la almacenada (texto plano)
        if (user.password === password) {
          // Si las contraseñas coinciden, enviar el ID del usuario
          console.log('Login exitoso');
          return res.json({ message: 'Login exitoso', userId: user.id });
        } else {
          console.log('Credenciales inválidas');
          return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
      } else {
        console.log('Credenciales inválidas');
        return res.status(401).json({ error: 'Email o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      return res.status(500).json({ error: 'Hubo un problema al verificar las credenciales' });
    }
  });

  return router;
};

export default UserRoute;

