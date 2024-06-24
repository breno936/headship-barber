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

    
  const newProduct = await prisma.productsHome.create({
    data: { name, description, price, picture:result.secure_url }

  });
  return new Response(JSON.stringify({ product: newProduct }), { status: 201 });
}else{
  return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

}
};

export const GET: RequestHandler = async ({request}) => {
  
  const products = await prisma.productsHome.findMany();
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

    console.log(picture);

    const existingProduct = await prisma.productsHome.findFirst({
      where:{id},
    });


    if(typeof picture == 'object'){
      const buffer = Buffer.from(await picture.arrayBuffer());
      const uploadPath = path.join('static', 'uploads', `${Date.now()}-${picture.name}`);
    
        fs.writeFileSync(uploadPath, buffer);
    
        filePath = `/uploads/${path.basename(uploadPath)}`;
  
    
      deleteImage(existingProduct.picture, token);
    }else{
      filePath = existingProduct?.picture;
    }
  
    console.log(price);

    const updatedProduct = await prisma.productsHome.update({
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

    
    const existingProduct = await prisma.productsHome.findFirst({
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

function deleteImage(imagePath: string, token:string ) {
  try {

    if(token && verifyToken(token)){
    const fullPath = path.join('static', imagePath);
    fs.unlinkSync(fullPath);
    console.log('Image deleted successfully');
    }else{

    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}