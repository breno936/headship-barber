import { json, type RequestHandler } from '@sveltejs/kit';
import dotenv from 'dotenv';
import pkg from 'twilio';

dotenv.config();

const { Twilio } = pkg;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not set in the environment variables.');
}

const client = new Twilio(accountSid, authToken);

export const POST: RequestHandler = async ({ request }) => {
    console.log(client);
    const { to, message } = await request.json();

    if (!to || !message) {
        return json({ error: 'Missing "to" or "message" in request body' }, { status: 400 });
    }
    let phoneTo = to.replace(/\D/g, ''); 
    phoneTo = "+55"+phoneTo

    try {
        const messageInstance = await client.messages.create({
            body: message,
            from: 'whatsapp:+14155238886', // Seu número Twilio
            to: 'whatsapp:'+phoneTo
        });

        return json({ success: true, sid: messageInstance.sid });
    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
};
