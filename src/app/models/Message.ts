export interface Message {
  uid:string;
  userName:string;
  message:string;
  picUrl:string
}

export interface ChatInfo {
  onlineUsers:number,
  totalMsgs:number
}