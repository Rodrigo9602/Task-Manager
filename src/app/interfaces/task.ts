type StateType = 'Pendiente' | 'En Proceso' | 'Completada';

export interface Task {
    name: string,
    description: string,
    start_date: Date,
    end_date: Date,
    state: StateType
}