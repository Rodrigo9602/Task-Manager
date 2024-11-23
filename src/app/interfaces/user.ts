import { Task } from "./task"

export interface User {
    email: string,
    password: string,
    name: string,
    role: string,
    tasks: Task[],
    id: number
}