'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MealForm, { MealFormValues, emptyMealFormValues } from '../components/MealForm';
import { useCreateMeal, MealInput } from '../../../hooks/meals';

export default function CreateMealPage() {
  const router = useRouter();
  const [values, setValues] = useState<MealFormValues>(emptyMealFormValues);
  const createMeal = useCreateMeal();

  const handleSubmit = () => {
    const input: MealInput = {
      title: values.title,
      calories: Number(values.calories),
      ...(values.date && { date: values.date }),
      ...(values.protein && { protein: Number(values.protein) }),
      ...(values.carbs && { carbs: Number(values.carbs) }),
      ...(values.fat && { fat: Number(values.fat) }),
      ...(values.notes && { notes: values.notes }),
    };

    createMeal.mutate(input, {
      onSuccess: () => router.push('/meals'),
      onError: () => alert('Virhe aterian tallennuksessa'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push('/meals')}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <h1 className="text-2xl font-bold mb-6">Uusi ateria</h1>

      <MealForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        submitLabel="Tallenna ateria"
        submittingLabel="Tallennetaan..."
        loading={createMeal.isPending}
      />
    </div>
  );
}
