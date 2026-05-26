'use client';

export type MealFormValues = {
  title: string;
  calories: string;
  date: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
};

export const emptyMealFormValues: MealFormValues = {
  title: '',
  calories: '',
  date: '',
  protein: '',
  carbs: '',
  fat: '',
  notes: '',
};

type Props = {
  values: MealFormValues;
  onChange: (values: MealFormValues) => void;
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  loading: boolean;
};

export default function MealForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  loading,
}: Props) {
  const update = <K extends keyof MealFormValues>(key: K, v: MealFormValues[K]) =>
    onChange({ ...values, [key]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.title || !values.calories) {
      alert('Nimi ja kalorit ovat pakollisia');
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nimi *</label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Kalorit (kcal) *</label>
        <input
          type="number"
          value={values.calories}
          onChange={(e) => update('calories', e.target.value)}
          className="w-full border p-2 rounded"
          min={0}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Päivämäärä</label>
        <input
          type="date"
          value={values.date}
          onChange={(e) => update('date', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-medium">Proteiini (g)</label>
          <input
            type="number"
            value={values.protein}
            onChange={(e) => update('protein', e.target.value)}
            className="w-full border p-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-medium">Hiilihydraatit (g)</label>
          <input
            type="number"
            value={values.carbs}
            onChange={(e) => update('carbs', e.target.value)}
            className="w-full border p-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-medium">Rasva (g)</label>
          <input
            type="number"
            value={values.fat}
            onChange={(e) => update('fat', e.target.value)}
            className="w-full border p-2 rounded"
            min={0}
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Muistiinpanot</label>
        <textarea
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? submittingLabel : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Peruuta
          </button>
        )}
      </div>
    </form>
  );
}
