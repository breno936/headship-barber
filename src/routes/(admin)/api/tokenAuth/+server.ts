import prisma from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '$lib/server/jwt';
import { verifyToken } from '$lib/server/jwt';



const secret_key = process.env.SECRET_KEY || 'your_secret_key';

export const POST: RequestHandler = async ({request}) => {

  const authHeader = request.headers.get('Authorization');
  const token = authHeader.split(' ')[1];

  if(verifyToken(token) != null){
    console.log(token+"sdsadddadsad");

    return new Response(JSON.stringify({ token:token }), { status: 200 });

  }

  return new Response(JSON.stringify({ token:"Erro" }), { status: 401 });




};

