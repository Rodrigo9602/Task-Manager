import { Task } from "./task"

export interface User {
    email: string,
    password: string,
    name: string,
    role: string,    
    id: number
}

export type userReg = Omit<User, 'id'> ;
export type userPriv = Omit<User, 'password'>;