import { type PrismaClient } from "@prisma/client"
import UserRoute from "./user.route"
import { type Express } from "express"

const addRoutes = (app: Express, prisma: PrismaClient) => {
    app.get('/', (req, res) => {
        res.send({
            message: "Hello world!"
        })
    })
    // Acá van tus custom routers
    app.use('/users/', UserRoute(prisma))
}

export default addRoutes