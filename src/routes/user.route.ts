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

  // Actualizar los datos de un usuario por ID
  router.put('/:id', async (req, res) => {
    const { tiempo, entrenamientos, calorias, nombre, apellido, email, profilePicture } = req.body;
    const { id } = req.params;
  
    try {
      // Verificar si el email ya está en uso por otro usuario
      if (email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== parseInt(id)) {
          return res.status(400).json({ error: 'El email ya está registrado.' });
        }
      }
  
      // Actualizar datos generales del usuario si son enviados
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          tiempo,
          entrenamientos,
          calorias,
          nombre,
          apellido,
          email,
          profilePicture,
        },
      });
  
      // Registrar la rutina actual en UserStats
      const currentDateTime = new Date(); // Fecha y hora del registro
      const newStats = await prisma.userStats.create({
        data: {
          userId: parseInt(id),
          fecha: currentDateTime, // Se registra con fecha completa incluyendo la hora
          tiempo,
          entrenamientos,
          calorias,
        },
      });
  
      res.json({
        message: 'Datos del usuario actualizados y rutina registrada correctamente.',
        updatedUser,
        newStats,
      });
  
    } catch (error) {
      console.error('Error al actualizar el usuario y registrar la rutina:', error);
      res.status(500).json({ error: 'Error al actualizar los datos del usuario o registrar la rutina.' });
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

  // Endpoint para obtener las estadísticas del usuario (sumadas por fecha)
  router.get('/:id/stats', async (req, res) => {
    const { id } = req.params;
  
    try {
      console.log(`Buscando usuario con ID: ${id}`);
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!user) {
        console.error(`Usuario con ID ${id} no encontrado`);
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
  
      // Obtener todas las estadísticas del usuario
      const stats = await prisma.userStats.findMany({
        where: {
          userId: parseInt(id),
        },
        orderBy: {
          fecha: 'asc',  // Ordenar por fecha
        },
      });
  
      // Agrupar las estadísticas por fecha (en formato local) y sumar los valores
      const groupedStats = stats.reduce((acc, stat) => {
        const statDate = new Date(stat.fecha).toLocaleDateString(); // Convertir la fecha a formato local
        if (!acc[statDate]) {
          acc[statDate] = {
            fecha: statDate,
            tiempo: 0,
            entrenamientos: 0,
            calorias: 0,
          };
        }
        acc[statDate].tiempo += stat.tiempo;
        acc[statDate].entrenamientos += stat.entrenamientos;
        acc[statDate].calorias += stat.calorias;
  
        return acc;
      }, {});
  
      // Convertir el objeto `groupedStats` a un array para enviar la respuesta
      const statsArray = Object.values(groupedStats);
  
      console.log(`Estadísticas agrupadas: ${JSON.stringify(statsArray)}`);
  
      res.json({ user, stats: statsArray });
    } catch (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
  });

  router.get('/:id/statsByDate', async (req, res) => {
    const { id } = req.params;
    const { fecha } = req.query;  // Utilizamos un query parameter para recibir la fecha
  
    try {
      console.log(`Buscando usuario con ID: ${id}`);
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!user) {
        console.error(`Usuario con ID ${id} no encontrado`);
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
  
      // Obtener todas las estadísticas del usuario
      const stats = await prisma.userStats.findMany({
        where: {
          userId: parseInt(id),
        },
        orderBy: {
          fecha: 'asc',  // Ordenar por fecha
        },
      });
  
      // Agrupar las estadísticas por fecha (en formato local) y sumar los valores
      const groupedStats = stats.reduce((acc, stat) => {
        const statDate = new Date(stat.fecha).toLocaleDateString(); // Convertir la fecha a formato local
        if (!acc[statDate]) {
          acc[statDate] = {
            fecha: statDate,
            tiempo: 0,
            entrenamientos: 0,
            calorias: 0,
          };
        }
        acc[statDate].tiempo += stat.tiempo;
        acc[statDate].entrenamientos += stat.entrenamientos;
        acc[statDate].calorias += stat.calorias;
  
        return acc;
      }, {});
  
      // Convertir el objeto `groupedStats` a un array
      const statsArray = Object.values(groupedStats);
  
      console.log(`Estadísticas agrupadas: ${JSON.stringify(statsArray)}`);
  
      // Si se pasa una fecha en los parámetros de la query, filtramos las estadísticas por fecha
      if (fecha) {
        // Filtrar las estadísticas por la fecha solicitada
        const filteredStats = statsArray.filter(stat => stat.fecha === fecha);
  
        if (filteredStats.length === 0) {
          return res.status(200).json({ message: `No se encontraron estadísticas para la fecha: ${fecha}.` });
        }
  
        // Devolver las estadísticas filtradas
        return res.json({ user, stats: filteredStats });
      }
  
      // Si no se pasa una fecha, devolver todas las estadísticas
      res.json({ user, stats: statsArray });
    } catch (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
  });

  router.get('/:id/statsByPeriod', async (req, res) => {
    const { id } = req.params;
    const { period } = req.query;  // Recibimos el periodo como parámetro de consulta (día, semana, mes, año)
    
    try {
      console.log(`Buscando estadísticas de usuario con ID: ${id} para el periodo: ${period}`);
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!user) {
        console.error(`Usuario con ID ${id} no encontrado`);
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
  
      const stats = await prisma.userStats.findMany({
        where: {
          userId: parseInt(id),
        },
      });
  
      let filteredStats;
      const today = new Date();
  
      switch (period) {
        case 'today':
          filteredStats = stats.filter(stat => new Date(stat.fecha).toLocaleDateString() === today.toLocaleDateString());
          break;
  
        case 'week':
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));  // Lunes de la semana
          filteredStats = stats.filter(stat => new Date(stat.fecha) >= weekStart);
          break;
  
        case 'month':
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          filteredStats = stats.filter(stat => new Date(stat.fecha).getMonth() === monthStart.getMonth());
          break;
  
        case 'year':
          const yearStart = new Date(today.getFullYear(), 0, 1);
          filteredStats = stats.filter(stat => new Date(stat.fecha).getFullYear() === yearStart.getFullYear());
          break;
  
        default:
          return res.status(400).json({ error: 'Periodo no válido. Usa "today", "week", "month" o "year".' });
      }
  
      // Agrupar las estadísticas por fecha y sumar los valores
      const groupedStats = filteredStats.reduce((acc, stat) => {
        const statDate = new Date(stat.fecha).toLocaleDateString();  // Convertir la fecha a formato local
        if (!acc[statDate]) {
          acc[statDate] = {
            fecha: statDate,
            tiempo: 0,
            entrenamientos: 0,
            calorias: 0,
          };
        }
        acc[statDate].tiempo += stat.tiempo;
        acc[statDate].entrenamientos += stat.entrenamientos;
        acc[statDate].calorias += stat.calorias;
  
        return acc;
      }, {});
  
      // Convertir el objeto groupedStats a un array
      const statsArray = Object.values(groupedStats);
  
      res.json({ user, stats: statsArray });
  
    } catch (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
  });
  
    // Endpoint para obtener estadísticas totales del usuario
    router.get('/:id/totalStats', async (req, res) => {
      const { id } = req.params;
  
      try {
        // Buscar al usuario por su ID
        const user = await prisma.user.findUnique({
          where: { id: parseInt(id) },
        });
  
        if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
  
        // Obtener la suma total de tiempo, entrenamientos y calorías
        const totalStats = await prisma.userStats.aggregate({
          _sum: {
            tiempo: true,
            entrenamientos: true,
            calorias: true,
          },
          where: {
            userId: parseInt(id),
          },
        });
  
        res.json({
          message: 'Estadísticas totales obtenidas correctamente.',
          totalStats: {
            tiempo: totalStats._sum.tiempo || 0,
            entrenamientos: totalStats._sum.entrenamientos || 0,
            calorias: totalStats._sum.calorias || 0,
          },
        });
  
      } catch (error) {
        console.error('Error al obtener las estadísticas totales:', error);
        res.status(500).json({ error: 'Error al obtener las estadísticas totales del usuario.' });
      }
    });

  return router;
};

export default UserRoute;
