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
    const link = data.get('link') as string;

  if (!picture) {
    return new Response('No file uploaded', { status: 400 });
  }

  const buffer = Buffer.from(await picture.arrayBuffer());
  const uploadPath = "/static/uploads/"+Date.now()+"-"+picture.name;

    fs.writeFileSync(uploadPath, buffer);

    const filePath = `/uploads/${path.basename(uploadPath)}`;

    
  const newPortifolio = await prisma.portifolio.create({
    data: { link, picture:filePath }

  });
  return new Response(JSON.stringify({ portifolio: newPortifolio }), { status: 201 });
}else{
  return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

}
};

export const GET: RequestHandler = async ({request}) => {

  const portifolio = await prisma.portifolio.findMany();
  return new Response(JSON.stringify({ portifolio }), { status: 200 });

};

// Handler para editar um produto
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const data = await request.formData();


    const id = Number(data.get('id') as string);
    const picture = data.get('picture') as File;
    const link = data.get('link') as string;
    let filePath;

    const existingPortifolio = await prisma.portifolio.findFirst({
      where:{id},
    });


    if(typeof picture == 'object'){
      const buffer = Buffer.from(await picture.arrayBuffer());
      const uploadPath = path.join('static', 'uploads', `${Date.now()}-${picture.name}`);
    
        fs.writeFileSync(uploadPath, buffer);
    
        filePath = `/uploads/${path.basename(uploadPath)}`;
  
    
      deleteImage(existingPortifolio.picture, token);
    }else{
      filePath = existingPortifolio?.picture;
    }


    const updatedPortifolio = await prisma.portifolio.update({
      where: { id },
      data: { link, picture:filePath }
    });
    return new Response(JSON.stringify({ portifolio: updatedPortifolio }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 200 });

  }
  } catch (error) {
    console.error('Error updating portifolio:', error);
    return new Response(JSON.stringify({ error: 'Failed to update portifolio' }), { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id } = await request.json();

    
    const existingPortifolio = await prisma.portifolio.findFirst({
      where:{id},
    });

    deleteImage(existingPortifolio.picture, token);
    
    await prisma.portifolio.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ message: 'Portifolio deleted' }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error deleting portifolio:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete portifolio' }), { status: 500 });
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