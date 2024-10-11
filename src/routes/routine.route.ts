import { type PrismaClient } from "@prisma/client";
import { Router } from "express";

const RoutineRoute = (prisma: PrismaClient) => {
  const router = Router();

  // Obtener todas las rutinas
  router.get('/', async (req, res) => {
    const routines = await prisma.routine.findMany();
    res.json(routines);
  });

  // Crear una nueva rutina
  router.post('/', async (req, res) => {
    const { name, image } = req.body;
    const result = await prisma.routine.create({
      data: {
        name,
        image
      },
    });
    res.json(result);
  });

  // Obtener ejercicios de la rutina con ID 1
  router.get('/:id/exercises', async (req, res) => {
    const { id } = req.params; // Obtener el id de la rutina desde los parámetros de la URL
    const exercises = await prisma.exercise.findMany({
      where: { routineId: Number(id) } // Asegúrate de convertir el id a número
    });
    res.json(exercises);
  });
  

  return router;
};

export default RoutineRoute;

