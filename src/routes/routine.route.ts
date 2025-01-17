import { type PrismaClient } from "@prisma/client";
import { Router } from "express";

const RoutineRoute = (prisma: PrismaClient) => {
  const router = Router();

  // Obtener todas las rutinas
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query; // Recibimos el userId como parámetro de consulta
  
      // Filtramos las rutinas por 'isCustom' y 'userId' (si aplica)
      const routines = await prisma.routine.findMany({
        where: {
          OR: [
            { isCustom: false }, // Rutinas predefinidas
            { isCustom: true, userId: parseInt(userId) }, // Rutinas personalizadas de este usuario
          ],
        },
        include: {
          exercises: {
            include: {
              exercise: true, // Obtener detalles del ejercicio
            },
          },
        },
      });
  
      res.json(routines); // Enviar las rutinas al frontend
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Error fetching routines" });
    }
  });

  // Crear una nueva rutina
  router.post('/', async (req, res) => {
    const { name, image } = req.body;
    const result = await prisma.routine.create({
      data: {
        name,
        image, // Este campo es opcional, por lo que puede ser nulo.
      },
    });
    res.json(result);
  });

  // Obtener ejercicios de la rutina con ID específico
  router.get('/:id/exercises', async (req, res) => {
    const { id } = req.params; // Obtener el id de la rutina desde los parámetros de la URL
  
    try {
      // Obtener la rutina junto con los ejercicios asociados usando la relación
      const routine = await prisma.routine.findUnique({
        where: { id: Number(id) },
        include: {
          exercises: {
            include: {
              exercise: true, // Incluimos los detalles del ejercicio
            },
          },
        },
      });
  
      if (!routine) {
        return res.status(404).json({ message: 'Routine not found' });
      }
  
      // Formateamos los datos para enviar solo los necesarios
      const exercises = routine.exercises.map((routineExercise) => ({
        id: routineExercise.id,
        exerciseId: routineExercise.exercise.id,
        name: routineExercise.exercise.name,
        image: routineExercise.exercise.image,
        sets: routineExercise.sets,
        reps: routineExercise.reps,
        calories: routineExercise.exercise.calorias, // Incluimos el campo de calorías
      }));
  
      return res.json(exercises);
    } catch (error) {
      console.error("Error fetching routine exercises:", error);
      return res.status(500).json({ message: "Error fetching routine exercises" });
    }
  });
  

  // Endpoint para obtener todos los ejercicios
  router.get('/exercises', async (req, res) => {
    try {
      const exercises = await prisma.exercise.findMany({
        include: {
          routines: true, // Incluir las rutinas asociadas con los ejercicios
        },
      });
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Error al obtener los ejercicios" });
    }
  });

  // Crear una rutina personalizada
  router.post('/create-custom-routine', async (req, res) => {
    const { name, userId, exercises, image } = req.body; // Ejercicios incluye { id, sets, reps }
  
    try {
      // Crear la rutina personalizada con el userId
      const newRoutine = await prisma.routine.create({
        data: {
          name,
          isCustom: true,
          image, // La imagen es opcional, si no se pasa, se guardará como null
          userId, // Asociar la rutina con el userId del cuerpo de la petición
          exercises: {
            create: exercises.map((exercise) => ({
              exercise: { connect: { id: exercise.id } }, // Asociar el ejercicio por ID
              sets: exercise.sets, // Establecer sets
              reps: exercise.reps, // Establecer repeticiones
            })),
          },
        },
      });
  
      res.status(201).json(newRoutine); // Devolver la rutina recién creada
    } catch (error) {
      console.error("Error al crear rutina personalizada:", error);
      res.status(500).json({ error: 'Error creating custom routine', message: error.message });
    }
  });

  // Endpoint para eliminar una rutina personalizada
  router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el id de la rutina desde los parámetros de la URL
  
    try {
      // Buscar la rutina por ID
      const routine = await prisma.routine.findUnique({
        where: { id: Number(id) },
      });
  
      // Verificar si la rutina existe
      if (!routine) {
        return res.status(404).json({ message: 'Routine not found' });
      }
  
      // Verificar que la rutina sea personalizada antes de eliminarla
      if (!routine.isCustom) {
        return res.status(400).json({ message: 'Cannot delete predefined routine' });
      }
  
      // Eliminar los ejercicios asociados a la rutina (si los hay)
      await prisma.routineExercise.deleteMany({
        where: {
          routineId: Number(id),
        },
      });
  
      // Eliminar la rutina
      await prisma.routine.delete({
        where: { id: Number(id) },
      });
  
      // Enviar respuesta de éxito
      res.status(200).json({ message: 'Routine deleted successfully' });
    } catch (error) {
      console.error("Error deleting routine:", error);
      res.status(500).json({ message: "Error deleting routine" });
    }
  });
  

  

  return router;
};

export default RoutineRoute;
