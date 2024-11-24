export type StateType = 'Pendiente' | 'En Proceso' | 'Completada';

export interface Task {
    id: number,
    name: string,
    description: string,
    start_date: Date,
    end_date: Date,
    state: StateType,
    userId?: number
}