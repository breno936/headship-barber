import jwt from 'jsonwebtoken';

const secret_key = process.env.SECRET_KEY || 'your_secret_key';

export function generateToken(payload: object): string {
  return jwt.sign(payload, secret_key, { expiresIn: '1h' });
}

export function verifyToken(tokenParam: string){
  try {
    let token;
    const authHeader = tokenParam;

    if (!authHeader) {
      return null;

    }


    if(authHeader.startsWith("Bearer")){
    token = authHeader.split(' ')[1];
    }else{
        token = authHeader;

    }

    return jwt.verify(token, secret_key);
  } catch (err) {
    return null;
  }
}