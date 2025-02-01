import Dexie, { type Table } from 'dexie'

export interface Exercise {
	id?: string
	name: string
	createdAt: string
	updatedAt: string
}

export interface WorkoutSet {
	id?: string
	exerciseId: number
	workoutId: number
	reps: number
	weight: number
	notes?: string
}

export interface Workout {
	id?: string
	name: string
	date: string
	notes?: string
	status: 'active' | 'completed' | 'cancelled'
	createdAt: string
	updatedAt: string
}

export interface Routine {
	id?: string
	name: string
	createdAt: string
	updatedAt: string
}

export interface RoutineExercise {
	id?: number
	routineId: number
	exerciseId: number
	order: number
}

class FitLogDB extends Dexie {
	exercises!: Table<Exercise>
	workouts!: Table<Workout>
	workoutSets!: Table<WorkoutSet>
	routines!: Table<Routine>
	routineExercises!: Table<RoutineExercise>

	constructor() {
		super('FitLogDB')
		this.version(1).stores({
			exercises: '++id, name, createdAt, updatedAt',
			workoutSets: '++id, exerciseId, workoutId, reps, weight, notes',
			workouts: '++id, name, date, status, createdAt, updatedAt, notes',
			routines: '++id, name, createdAt, updatedAt',
			routineExercises: '++id, routineId, exerciseId, order',
		})
	}
}

export const db = new FitLogDB()
