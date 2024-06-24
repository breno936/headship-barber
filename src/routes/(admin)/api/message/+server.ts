import { json, type RequestHandler } from '@sveltejs/kit';
import dotenv from 'dotenv';
import pkg from 'twilio';

dotenv.config();

const { Twilio } = pkg;

const accountSid = process.env.TWILIO_ACCOUNT_SID || import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER || import.meta.env.VITE_TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not set in the environment variables.');
}

const client = new Twilio(accountSid, authToken);

export const POST: RequestHandler = async ({ request }) => {
    
    const { to, message } = await request.json();

    if (!to || !message) {
        return json({ error: 'Missing "to" or "message" in request body' }, { status: 400 });
    }
    let phoneTo = to.replace(/\D/g, ''); 
    phoneTo = "+55"+phoneTo

    try {
    //    return await client.messages.create({
    //         body: message,
    //         from: 'whatsapp:'+phoneNumber, // Seu número Twilio
    //         to: 'whatsapp:'+phoneTo
    //     })
    //     .then(message =>{
    //         console.log(phoneTo, message);
    //     });
    const result = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phoneTo}&text=${message}&apikey=1777851
`);
    console.log(result);
        return json({ success: true, sid: message.sid });  

    } catch (error) {
        return json({ error: error.message }, { status: 500 });
    }
};
