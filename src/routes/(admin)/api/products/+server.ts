import prisma from '$lib/server/prisma';
import path from 'path';
import fs from 'fs';
import type { RequestHandler } from '@sveltejs/kit';
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
  const name = data.get('name') as string;
  const description = data.get('description') as string;
  const price = Number(data.get('price') as string);

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

     // Customize the transformation settings here
     const optimizedUrl = cloudinary.url(result.public_id, {
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'webp' }
      ]
    });

    
  const newProduct = await prisma.products.create({
    data: { name, description, price, picture:optimizedUrl }

  });
  return new Response(JSON.stringify({ product: newProduct }), { status: 201 });
}else{
  return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
};


export const GET: RequestHandler = async ({request}) => {

  const products = await prisma.products.findMany();
  return new Response(JSON.stringify({ products }), { status: 200 });

};

// Handler para editar um produto
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const data = await request.formData();


    const id = Number(data.get('id') as string);
    const picture = data.get('picture') as File;
    const name = data.get('name') as string;
    const description = data.get('description') as string;
    const price = Number(data.get('price') as string);
    let filePath;

    const existingProduct = await prisma.products.findFirst({
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

         // Customize the transformation settings here
    const optimizedUrl = cloudinary.url(result.public_id, {
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'webp' }
      ]
    });


      filePath = optimizedUrl;
    }else{
      filePath = existingProduct?.picture;
    }

    const updatedProduct = await prisma.products.update({
      where: { id },
      data: { name, description, price, picture:filePath }
    });
    return new Response(JSON.stringify({ product: updatedProduct }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to update product' }), { status: 500 });
  }
};

// Handler para excluir um produto
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id } = await request.json();

    
    const existingProduct = await prisma.products.findFirst({
      where:{id},
    });

    deleteImage(existingProduct.picture, token);
    
    await prisma.products.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
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
