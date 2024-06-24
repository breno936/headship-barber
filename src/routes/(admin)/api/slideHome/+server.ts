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
  const linkButton = data.get('linkButton') as string;
  const textButton = data.get('textButton') as string;
  const title = data.get('title') as string;
  const subTitle = data.get('subTitle') as string;

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

    
  const newSlideHome = await prisma.slideHome.create({
    data: {  linkButton, picture:result.secure_url, subTitle, textButton, title}

  });

  console.log(newSlideHome);
  return new Response(JSON.stringify({ slides: newSlideHome }), { status: 201 });
}else{
  return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

}
};

export const GET: RequestHandler = async ({request}) => {

const token = request.headers.get('Authorization');
  
  const slides = await prisma.slideHome.findMany();
  return new Response(JSON.stringify({ slides }), { status: 200 });

};

// Handler para editar um produto
export const PUT: RequestHandler = async ({ request }) => {
  try {

    const token = request.headers.get('Authorization');
  
    if(token && verifyToken(token)){

    const data = await request.formData();

    const id = Number(data.get('id') as string);
    const picture = data.get('picture') as File;
    const linkButton = data.get('linkButton') as string;
    const textButton = data.get('textButton') as string;
    const title = data.get('title') as string;
    const subTitle = data.get('subTitle') as string;
    let filePath;

    const existingSlideHome = await prisma.slideHome.findFirst({
      where:{id},
    });


    if(typeof picture == 'object'){
      const buffer = Buffer.from(await picture.arrayBuffer());
      const uploadPath = path.join('static', 'uploads', `${Date.now()}-${picture.name}`);
    
        fs.writeFileSync(uploadPath, buffer);
    
        filePath = `/uploads/${path.basename(uploadPath)}`;
  
    
      deleteImage(existingSlideHome.picture, token);
    }else{
      filePath = existingSlideHome?.picture;
    }

 

    const updatedSlideHome = await prisma.slideHome.update({
      where: { id },
      data: {  linkButton, picture:filePath, subTitle, textButton, title}
    });
    return new Response(JSON.stringify({ slides: updatedSlideHome }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error updating slideHome:', error);
    return new Response(JSON.stringify({ error: 'Failed to update slideHome' }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
  const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id } = await request.json();
    
    const existingSlideHome = await prisma.slideHome.findFirst({
      where:{id},
    });

    deleteImage(existingSlideHome.picture, token);
    
    await prisma.slideHome.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ message: 'slide deleted' }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error deleting service:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete slide' }), { status: 500 });
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