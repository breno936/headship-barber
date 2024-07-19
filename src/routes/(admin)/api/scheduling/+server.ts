import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
 
  const { clientNumber, hourId } = await request.json();  
    const existingNumber = await prisma.scheduling.findFirst({
      where:{
        clientNumber:clientNumber,
      },
    });

    const desactiveHours = await prisma.hours.findFirst({
      where:{
        id:hourId,
      },
    });

    if(!existingNumber && desactiveHours?.active == true){
    // Cria um novo registro
    const newRegister = await prisma.scheduling.create({
      data: { 
        clientNumber,
        hourId,
       }
    });

    const updatedHour = await prisma.hours.update({
      where:{
        id:hourId
      },
      data: { 
        active:false
       }
    });
    return new Response(JSON.stringify({ scheduling: newRegister }), { status: 200 });

  }
  return new Response(JSON.stringify({ scheduling: "Número já existe ou Horário indisponivel" }), { status: 200 });

//return new Response(JSON.stringify({ schedules: existingSchedule }), { status: 201 });

}

export const GET: RequestHandler = async ({request ,url}) => {
 
  let weekDay = url.searchParams.get('weekDay') || '';
  let monthDay = Number(url.searchParams.get('monthDay') || '');
  console.log(monthDay);
  if(weekDay){
  const schedules = await prisma.schedules.findMany({
    where:{
      weekDay:weekDay,
    },
    include:{
      hours:true,
    },
  });
  return new Response(JSON.stringify({ schedules }), { status: 200 });

}else{

  const schedules = await prisma.schedules.findMany({
    where:{
      monthDay:monthDay,
    },
    include:{
      hours:true,
    },
  });
  console.log(schedules);

  return new Response(JSON.stringify({ schedules }), { status: 200 });

}

};


// Handler para editar um produto
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){
    const { id, active, monthDay, weekDay, hours, month, year } = await request.json();
    const updatedSchedule = await prisma.schedules.update({
      where: { id },
      data: { active, monthDay, weekDay, hours, month, year }
    });
    return new Response(JSON.stringify({ schedule: updatedSchedule }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  }
  } catch (error) {
    console.error('Error updating schedule:', error);
    return new Response(JSON.stringify({ error: 'Failed to update schedule' }), { status: 500 });
  }
};

// Handler para excluir um produto
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    
    // const token = request.headers.get('Authorization');
    // if(token && verifyToken(token)){
    const { hourId } = await request.json();

    let hourIdNumber = Number(hourId)
    await prisma.scheduling.delete({
      where: {hourId:hourIdNumber}
    });
    return new Response(JSON.stringify({ message: 'Product deleted' }), { status: 200 });
  // }else{
  //   return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

  // }
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete schedule' }), { status: 500 });
  }
};