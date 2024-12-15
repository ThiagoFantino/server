import { type PrismaClient } from "@prisma/client";
import { Router } from "express";
import bcrypt from "bcryptjs";  // Importar bcrypt

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

  // Crear un nuevo usuario (con encriptación de la contraseña)
  router.post('/signup', async (req, res) => {
    const { nombre, apellido, calorias, entrenamientos, tiempo, email, password } = req.body;
  
    try {
      // Verificar si el email ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado.' });
      }
  
      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de rondas de encriptación
  
      // Crear el usuario con la contraseña encriptada
      const result = await prisma.user.create({
        data: {
          nombre,
          apellido,
          calorias,
          entrenamientos,
          tiempo,
          email,
          password: hashedPassword, // Guardar la contraseña encriptada
        },
      });
  
      res.status(201).json(result);
    } catch (error) {
      console.error('Error al crear el usuario:', error);
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
          tiempo,
          entrenamientos,
          calorias,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar los tiempo y entrenamientos.' });
    }
  });

  // Ruta para login (con verificación de contraseña)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar al usuario por el email en la base de datos
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (user) {
        // Comparar la contraseña proporcionada con la almacenada (encriptada)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
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
