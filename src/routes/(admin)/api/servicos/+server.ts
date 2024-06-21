import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs';
import { verifyToken } from '$lib/server/jwt';


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
  const uploadPath = path.join('static', 'uploads', `${Date.now()}-${picture.name}`);

    fs.writeFileSync(uploadPath, buffer);

    const filePath = `/uploads/${path.basename(uploadPath)}`;

    
  const newService = await prisma.services.create({
    data: {  description, name, picture:filePath, price}

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
      const uploadPath = path.join('static', 'uploads', `${Date.now()}-${picture.name}`);
    
        fs.writeFileSync(uploadPath, buffer);
    
        filePath = `/uploads/${path.basename(uploadPath)}`;
  
    
      deleteImage(existingService.picture, token);
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