import { User } from './User'
import { Message } from './Message'

export interface Room {
  roomId: string
  roomName: string,
  roomOwner: User,
  messages: Message[],
  onlineUsers: User[]
}