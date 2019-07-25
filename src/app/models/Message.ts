import { User } from './User'

export interface Message {
  message: string,
  user: User,
  roomId: string
}

export interface ChatInfo {
  onlineUsers: number,
  totalMsgs: number
}