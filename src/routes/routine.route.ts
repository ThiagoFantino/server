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
    })
    res.json(result)
  })

  return router;
}

export default RoutineRoute;

