export interface Meal {
  id: number;
  title: string;
  date: string;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string | null;
}
