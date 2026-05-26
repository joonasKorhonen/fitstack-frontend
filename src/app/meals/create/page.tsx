'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../../../lib/authFetch';
import MealForm, { MealFormValues, emptyMealFormValues } from '../components/MealForm';

export default function CreateMealPage() {
  const router = useRouter();
  const [values, setValues] = useState<MealFormValues>(emptyMealFormValues);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const body = {
      title: values.title,
      calories: Number(values.calories),
      ...(values.date && { date: values.date }),
      ...(values.protein && { protein: Number(values.protein) }),
      ...(values.carbs && { carbs: Number(values.carbs) }),
      ...(values.fat && { fat: Number(values.fat) }),
      ...(values.notes && { notes: values.notes }),
    };

    const res = await authFetch('/api/meals', router, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res && res.ok) {
      router.push('/meals');
    } else {
      alert('Virhe aterian tallennuksessa');
    }
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
        loading={loading}
      />
    </div>
  );
}
