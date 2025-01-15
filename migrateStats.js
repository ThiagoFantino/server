// Este script recorre todos los usuarios y crea una entrada de estadísticas en UserStats
// con los valores actuales de `entrenamientos`, `calorias` y `tiempo`

const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();

async function migrateUserStats() {
  try {
    // Obtener todos los usuarios existentes
    const users = await prismaClient.user.findMany({
      where: {
        // Puedes filtrar por algún criterio si lo necesitas
      },
    });

    for (const user of users) {
      // Crear una entrada en UserStats con las estadísticas actuales del usuario
      await prismaClient.userStats.create({
        data: {
          userId: user.id,
          fecha: new Date(),  // O puedes establecer una fecha específica si tienes registros históricos
          entrenamientos: user.entrenamientos,
          calorias: user.calorias,
          tiempo: user.tiempo,
        },
      });

      console.log(`Estadísticas creadas para el usuario ${user.id}`);
    }

    console.log("Migración completada");

  } catch (error) {
    console.error("Error al migrar las estadísticas:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

migrateUserStats();
