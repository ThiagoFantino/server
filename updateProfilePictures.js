// updateProfilePictures.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateProfilePictures = async () => {
  try {
    const result = await prisma.user.updateMany({
      data: {
        profilePicture: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
      },
    });
    console.log(`${result.count} fotos de perfil actualizadas correctamente.`);
  } catch (error) {
    console.error('Error al actualizar las fotos de perfil:', error);
  } finally {
    await prisma.$disconnect(); // Importante desconectar al final
  }
};

updateProfilePictures();

