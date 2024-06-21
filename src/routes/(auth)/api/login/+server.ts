import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '$lib/server/jwt';
import { verifyToken } from '$lib/server/jwt';



const secret_key = process.env.SECRET_KEY || 'your_secret_key';

export const POST: RequestHandler = async ({request}) => {
  const data = await request.formData();

  const username = data.get('username') as string;
  const password = data.get('password') as string;

  // Crie o novo usuário no banco de dados
  const user = await prisma.user.findFirst({
    where: {
      username
    }
  });

  if (!user || !bcrypt.compare(password, user.password)) {
    return new Response(JSON.stringify({ user: "Inválido" }), { status: 401 });

  }

  const token = generateToken({userId: user.id});

  return new Response(JSON.stringify({ user:token }), { status: 200 });


};

