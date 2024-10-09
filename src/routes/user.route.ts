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
    const { nombre, apellido } = req.body
    const result = await prisma.user.create({
      data: {
        nombre,
        apellido
      },
    })
    res.json(result)
  })

  return router
}

export default UserRoute

