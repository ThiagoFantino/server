import { type PrismaClient } from "@prisma/client"
import { Router } from "express"

const UserRoute = (prisma: PrismaClient) => {
  const router = Router()

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
  })

  // Crear un nuevo usuario
  router.post('/', async (req, res) => {
    const { nombre, apellido, calorias, entrenamientos, minutos } = req.body; // Incluir las nuevas propiedades

    const result = await prisma.user.create({
      data: {
        nombre,
        apellido,
        calorias,        // Agregar calorías
        entrenamientos,   // Agregar entrenamientos
        minutos,          // Agregar minutos
      },
    });
    
    res.json(result);
  })

  router.get('/1', async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: 1 }, 
    });
    res.json(user)
  });

  return router
}

export default UserRoute

