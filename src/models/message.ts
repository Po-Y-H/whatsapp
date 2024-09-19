export interface Message {
  phoneNumberId: string;
  from: string;
  body: string;
}

export interface OutgoingMessage {
  to: string;
  body: string;
}
