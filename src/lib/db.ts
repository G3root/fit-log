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
	createdAt: string
	updatedAt: string
}

class FitLogDB extends Dexie {
	exercises!: Table<Exercise>
	workouts!: Table<Workout>
	workoutSets!: Table<WorkoutSet>

	constructor() {
		super('FitLogDB')
		this.version(1).stores({
			exercises: '++id, name, createdAt, updatedAt',
			workoutSets: '++id, exerciseId, workoutId, reps, weight, notes',
			workouts: '++id, name, date, createdAt, updatedAt, notes',
		})
	}
}

export const db = new FitLogDB()
