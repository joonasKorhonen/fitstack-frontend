'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MealForm, { MealFormValues, emptyMealFormValues } from '../../components/MealForm';
import { useMeal, useUpdateMeal, MealInput } from '../../../../hooks/meals';

export default function EditMealPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: meal } = useMeal(id);
  const updateMeal = useUpdateMeal(id);
  const [values, setValues] = useState<MealFormValues>(emptyMealFormValues);

  useEffect(() => {
    if (!meal) return;
    setValues({
      title: meal.title,
      calories: String(meal.calories),
      date: meal.date ? new Date(meal.date).toISOString().split('T')[0] : '',
      protein: meal.protein != null ? String(meal.protein) : '',
      carbs: meal.carbs != null ? String(meal.carbs) : '',
      fat: meal.fat != null ? String(meal.fat) : '',
      notes: meal.notes || '',
    });
  }, [meal]);

  const handleSave = () => {
    const input: MealInput = {
      title: values.title,
      calories: Number(values.calories),
      ...(values.date && { date: values.date }),
      ...(values.protein && { protein: Number(values.protein) }),
      ...(values.carbs && { carbs: Number(values.carbs) }),
      ...(values.fat && { fat: Number(values.fat) }),
      notes: values.notes || null,
    };

    updateMeal.mutate(input, {
      onSuccess: () => router.push(`/meals/${id}`),
      onError: () => alert('Virhe aterian päivityksessä'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push(`/meals/${id}`)}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <h1 className="text-2xl font-bold mb-6">Muokkaa ateriaa</h1>

      <MealForm
        values={values}
        onChange={setValues}
        onSubmit={handleSave}
        onCancel={() => router.push(`/meals/${id}`)}
        submitLabel="Tallenna muutokset"
        submittingLabel="Tallennetaan..."
        loading={updateMeal.isPending}
      />
    </div>
  );
}
