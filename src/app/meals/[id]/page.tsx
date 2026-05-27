'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMeal, useDeleteMeal } from '../../../hooks/meals';

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: meal, isLoading } = useMeal(id);
  const deleteMeal = useDeleteMeal();

  const handleDelete = () => {
    if (!confirm('Poistetaanko tämä ateria?')) return;
    deleteMeal.mutate(id, {
      onSuccess: () => router.push('/meals'),
      onError: () => alert('Virhe aterian poistamisessa'),
    });
  };

  if (isLoading || !meal) return <p className="p-6">Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={() => router.push('/meals')}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{meal.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/meals/${id}/edit`)}
            className="text-blue-600 font-semibold border border-blue-600 px-3 py-1 rounded"
          >
            Muokkaa
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMeal.isPending}
            className="text-red-600 font-semibold border border-red-600 px-3 py-1 rounded disabled:opacity-50"
          >
            Poista
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {new Date(meal.date).toLocaleDateString('fi-FI')}
      </p>

      <div className="grid grid-cols-2 gap-4 border rounded p-4">
        <div>
          <p className="text-sm text-gray-500">Kalorit</p>
          <p className="text-xl font-bold">{meal.calories} kcal</p>
        </div>
        {meal.protein != null && (
          <div>
            <p className="text-sm text-gray-500">Proteiini</p>
            <p className="text-xl font-bold">{meal.protein} g</p>
          </div>
        )}
        {meal.carbs != null && (
          <div>
            <p className="text-sm text-gray-500">Hiilihydraatit</p>
            <p className="text-xl font-bold">{meal.carbs} g</p>
          </div>
        )}
        {meal.fat != null && (
          <div>
            <p className="text-sm text-gray-500">Rasva</p>
            <p className="text-xl font-bold">{meal.fat} g</p>
          </div>
        )}
      </div>

      {meal.notes && (
        <p className="text-gray-700 italic">{meal.notes}</p>
      )}
    </div>
  );
}
