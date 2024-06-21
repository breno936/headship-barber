import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret_key = process.env.SECRET_KEY || 'your_secret_key';
export const POST: RequestHandler = async ({ request }) => {
    const { username, password } = await request.json();
  
    // Hash a senha antes de armazená-la
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Crie o novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });
  
    return new Response(JSON.stringify({ user }), { status: 201 });
  };



