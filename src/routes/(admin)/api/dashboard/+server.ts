import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({request}) => {
  const token = request.headers.get('Authorization');
  if(token && verifyToken(token)){
  const products = (await prisma.products.findMany()).length;
  const scheduling = (await prisma.scheduling.findMany()).length;
  const services = (await prisma.services.findMany()).length;
  const hoursClosed = (await prisma.hours.findMany({where:{active:false}})).length;
  const hoursOpen = (await prisma.hours.findMany({where:{active:true}})).length;

  return new Response(JSON.stringify({ products, scheduling, services, hoursClosed, hoursOpen }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ messsage:"Sem autorização" }), { status: 401 });
  }
};
