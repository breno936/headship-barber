import { verifyToken } from '$lib/server/jwt';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

// export const POST: RequestHandler = async ({ request }) => {
//   const { active, monthDay, weekDay, hours, month, year } = await request.json();


//   // Verifica se já existe um registro para o dia específico
//   const existingSchedule = await prisma.schedules.findFirst({
//     where: {
//       active,
//       monthDay,
//       month,
//       year,
//       weekDay,
//     },
//     include: {
//       hours: true,
//     },
//   });

//   console.log(existingSchedule);


//   if (existingSchedule) {
//     let scheduleId = existingSchedule.id;

//     console.log("pega")
//     // Atualiza o registro existente adicionando as novas horas
//      // Adiciona as novas horas ao registro existente
//      let hoursArr = hours;
//      for (const hours of hoursArr) {
//       await prisma.hours.create({
//         data: {
//           hours,
//           active: true,
//           scheduleId,
//         },
//       });
//     }

//     const updatedSchedule = await prisma.schedules.findUnique({
//       where: {
//         id: scheduleId,
//       },
//       include: {
//         hours: true,
//       },
//     });


//     return new Response(JSON.stringify({ schedule: updatedSchedule }), { status: 200 });
//   } else {
//     let hoursArr = hours;

//     // Cria um novo registro
//     const newRegister = await prisma.schedules.create({
//       data: { 
//         active,
//         monthDay,
//         weekDay,
//         month,
//         year,
//        }
//     });

//     let scheduleId = newRegister.id;

//     for (const hours of hoursArr) {
//       await prisma.hours.create({
//         data: {
//           hours,
//           active: true,
//           scheduleId,
//         },
//       });
//     }

//     const newSchedule = await prisma.schedules.findUnique({
//       where: {
//         id: newRegister.id,
//       },
//       include: {
//         hours: true,
//       },
//     });
//     console.log(newSchedule);
//     return new Response(JSON.stringify({ schedule: newSchedule }), { status: 200 });



// };
// //return new Response(JSON.stringify({ schedules: existingSchedule }), { status: 201 });

// }

export const GET: RequestHandler = async ({request, url}) => {

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

    const { id, active, hours, scheduleId, specific } = await request.json();

    if(specific == true){

      const updatedSchedule = await prisma.hours.update({
        where: { id:id},
        data: {
           active
          }
      });
      console.log(updatedSchedule);
      return new Response(JSON.stringify({ schedule: updatedSchedule }), { status: 200 });
    }

    const firstSchedule = await prisma.schedules.findFirst({
      where:{id:scheduleId},
    })

    let weekDay = firstSchedule?.weekDay;

    const findAllWeekDay = await prisma.schedules.findMany({
      where:{weekDay:weekDay},
    })
    let updatedSchedule;
    let updatedScheduleArr:any = [];
    for (const dayWeek of findAllWeekDay) {
      updatedSchedule = await prisma.schedules.update({
        where: { id:dayWeek.id},
        data: {
           hours:{
          updateMany:{
            data:{
              active:active,
            },
            where:{
              AND:[
              {scheduleId:dayWeek.id},
              {hours:hours},
              ]
            }
          }
        } }
      });
      
      updatedScheduleArr = [...updatedScheduleArr, updatedSchedule];
      
    }
 

    return new Response(JSON.stringify({ schedule: updatedScheduleArr }), { status: 200 });
  }else{
    return new Response(JSON.stringify({ schedule: "Não autorizado" }), { status: 401 });

  }
  } catch (error) {
    console.error('Error updating schedule:', error);
    return new Response(JSON.stringify({ error: 'Failed to update schedule' }), { status: 500 });
  }
};

// Handler para excluir um produto
export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('Authorization');
    if(token && verifyToken(token)){

    const { id } = await request.json();
    await prisma.hours.delete({
      where: { id }
    });
    return new Response(JSON.stringify({ message: 'Hours deleted' }), { status: 200 });
    }else{
      return new Response(JSON.stringify({ message: 'Não autorizado' }), { status: 401 });

    }
  } catch (error) {
    console.error('Error deleting hours:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete hours' }), { status: 500 });
  }
};