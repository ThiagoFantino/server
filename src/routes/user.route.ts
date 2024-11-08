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
  router.post('/', async (req, res) => {
    const { nombre, apellido, calorias, entrenamientos, minutos } = req.body;

    try {
      const result = await prisma.user.create({
        data: {
          nombre,
          apellido,
          calorias,
          entrenamientos,
          minutos,
        },
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario.' });
    }
  });

  // Obtener un usuario por ID
  router.get('/1', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: 1 },
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
  });

  // Actualizar los minutos de un usuario por ID
  router.put('/1', async (req, res) => {
    const { minutos, entrenamientos, calorias } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: 1 },
        data: {
          minutos, // Actualizar los minutos
          entrenamientos, // Actualizar los entrenamientos
          calorias,
        },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar los minutos y entrenamientos.' });
    }
  });

  return router;
};

export default UserRoute;


