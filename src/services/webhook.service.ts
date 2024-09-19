import { Message } from '../models/message';

export const isValidWhatsAppMessage = (body: any): boolean => {
  return (
    body.object === 'whatsapp_business_account' &&
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  );
};

export const extractMessage = (body: any): Message => {
  const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
  const from = body.entry[0].changes[0].value.messages[0].from;
  const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

  return {
    phoneNumberId,
    from,
    body: msgBody,
  };
};

export const isValidVerification = (
  mode: any,
  token: any,
  verifyToken: string | undefined
): boolean => {
  return mode && token && mode === 'subscribe' && token === verifyToken;
};
