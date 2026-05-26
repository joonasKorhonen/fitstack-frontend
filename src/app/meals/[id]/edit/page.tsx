'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from '../../../../lib/authFetch';
import MealForm, { MealFormValues, emptyMealFormValues } from '../../components/MealForm';

export default function EditMealPage() {
  const { id } = useParams();
  const router = useRouter();
  const [values, setValues] = useState<MealFormValues>(emptyMealFormValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      const res = await authFetch(`/api/meals/${id}`, router);
      if (!res) return;

      if (res.ok) {
        const data = await res.json();
        setValues({
          title: data.title,
          calories: String(data.calories),
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          protein: data.protein != null ? String(data.protein) : '',
          carbs: data.carbs != null ? String(data.carbs) : '',
          fat: data.fat != null ? String(data.fat) : '',
          notes: data.notes || '',
        });
      }
    };
    fetchMeal();
  }, [id, router]);

  const handleSave = async () => {
    setLoading(true);

    const body = {
      title: values.title,
      calories: Number(values.calories),
      ...(values.date && { date: values.date }),
      ...(values.protein && { protein: Number(values.protein) }),
      ...(values.carbs && { carbs: Number(values.carbs) }),
      ...(values.fat && { fat: Number(values.fat) }),
      notes: values.notes || null,
    };

    const res = await authFetch(`/api/meals/${id}`, router, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res && res.ok) {
      router.push(`/meals/${id}`);
    } else {
      alert('Virhe aterian päivityksessä');
    }
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
        loading={loading}
      />
    </div>
  );
}
