import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '$lib/server/jwt';
import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const POST: RequestHandler = async ({ request }) => {
  const token = request.headers.get('Authorization');
  if(token && verifyToken(token)){
  const data = await request.formData();

  const picture = data.get('picture') as File;
  const price = Number(data.get('price') as string);
  const description = data.get('description') as string;
  const name = data.get('name') as string;

  if (!picture) {
    return new Response('No file uploaded', { status: 400 });
  }

  const buffer = Buffer.from(await picture.arrayBuffer());
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Send the buffer to Cloudinary
    uploadStream.end(buffer);
  });

    
  const newService = await prisma.services.create({
    data: {  description, name, picture:result.secure_url, price}

  });
  return new Response(JSON.stringify({ services: newService }), { status: 201 });
}else{
  return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

}
};

export const GET: RequestHandler = async ({request}) => {

  const services = await prisma.services.findMany();
  return new Response(JSON.stringify({ services }), { status: 200 });

};

// Handler para editar um produto
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const data = await request.formData();

    const id = Number(data.get('id') as string);
    const picture = data.get('picture') as File;
    const price = Number(data.get('price') as string);
    const description = data.get('description') as string;
    const name = data.get('name') as string;
    let filePath;

    const existingService = await prisma.services.findFirst({
      where:{id},
    });
    
    if(typeof picture == 'object'){
      const buffer = Buffer.from(await picture.arrayBuffer());
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
    
        // Send the buffer to Cloudinary
        uploadStream.end(buffer);
      });
  
    
      deleteImage(existingPortifolio.picture, token);
      filePath = result.secure_url;
    }else{
      filePath = existingService?.picture;
    }


    const updatedService = await prisma.services.update({
      where: { id },
      data: {  description, name, picture:filePath, price}
    });
    return new Response(JSON.stringify({ services: updatedService }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error updating service:', error);
    return new Response(JSON.stringify({ error: 'Failed to update service' }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id } = await request.json();

    
    const existingService = await prisma.services.findFirst({
      where:{id},
    });

    deleteImage(existingService.picture, token);
    
    await prisma.services.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ message: 'Service deleted' }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error deleting service:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete service' }), { status: 500 });
  }
};

function deleteImage(imagePath: string, token: string) {
  try {
    if (token && verifyToken(token)) {
      // Excluir do Cloudinary
      if (imagePath.startsWith('http')) {
        // Extrair o public_id do URL do Cloudinary
        const public_id = extractPublicIdFromUrl(imagePath);

        // Excluir do Cloudinary pelo public_id
        cloudinary.uploader.destroy(public_id, (error, result) => {
          if (error) {
            console.error('Error deleting image from Cloudinary:', error);
          } else {
            console.log('Image deleted from Cloudinary:', result);
          }
        });
      }

      // Excluir do sistema de arquivos local (opcional)
      const fullPath = path.join('static', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log('Image deleted from local file system:', fullPath);
      } else {
        console.log('Image file does not exist:', fullPath);
      }
    } else {
      console.log('Unauthorized access to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

// Função para extrair o public_id de um URL do Cloudinary
function extractPublicIdFromUrl(imageUrl: string): string | null {
  const matches = imageUrl.match(/\/upload\/([^/]+)/);
  return matches ? matches[1] : null;
}