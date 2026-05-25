export interface WorkoutSet {
  id: number;
  movementId?: number;
  movement?: { id: number; name: string };
  exercise?: string;
  reps: number;
  weight?: number | null;
  intensity?: number | null;
  notes?: string | null;
}

export interface Workout {
  id: number;
  date: string;
  notes?: string | null;
  sets: WorkoutSet[];
}
