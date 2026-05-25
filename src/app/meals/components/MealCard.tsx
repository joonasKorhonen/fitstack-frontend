'use client';

import Link from 'next/link';
import { Meal } from '../../../types/meal';

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <Link href={`/meals/${meal.id}`}>
      <div className="border rounded p-4 hover:shadow transition cursor-pointer">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{meal.title}</h3>
          <span className="text-sm text-gray-500">
            {new Date(meal.date).toLocaleDateString('fi-FI')}
          </span>
        </div>
        <div className="mt-2 flex gap-4 text-sm text-gray-600">
          <span>{meal.calories} kcal</span>
          {meal.protein != null && <span>P: {meal.protein}g</span>}
          {meal.carbs != null && <span>H: {meal.carbs}g</span>}
          {meal.fat != null && <span>R: {meal.fat}g</span>}
        </div>
        {meal.notes && (
          <p className="mt-1 text-sm text-gray-500 italic">{meal.notes}</p>
        )}
      </div>
    </Link>
  );
}