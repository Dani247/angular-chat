import { User } from './User'
import { Message } from './Message'

export interface DirectRoom {
  roomId: string
  user1: User,
  user2: User,
  messages: Message[]
}