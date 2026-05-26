'use client';

import MovementGroupEditor, { SetData } from './MovementGroupEditor';

export type WorkoutFormValues = {
  date: string;
  notes: string;
  sets: SetData[];
};

export const emptyWorkoutFormValues: WorkoutFormValues = {
  date: '',
  notes: '',
  sets: [],
};

type Props = {
  values: WorkoutFormValues;
  onChange: (values: WorkoutFormValues) => void;
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  onRemoveSet?: (set: SetData, index: number) => void;
  submitLabel: string;
  submittingLabel: string;
  loading: boolean;
  requireSets?: boolean;
};

export default function WorkoutForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  onRemoveSet,
  submitLabel,
  submittingLabel,
  loading,
  requireSets = false,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requireSets && values.sets.length === 0) {
      alert('Lisää vähintään yksi sarja ennen tallennusta');
      return;
    }

    const incompleteSets = values.sets.filter((s) => !s.reps);
    if (incompleteSets.length > 0) {
      alert('Täytä toistot kaikille sarjoille');
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Päivämäärä</label>
        <input
          type="date"
          value={values.date}
          onChange={(e) => onChange({ ...values, date: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Muistiinpanot</label>
        <textarea
          value={values.notes}
          onChange={(e) => onChange({ ...values, notes: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <MovementGroupEditor
        sets={values.sets}
        onChange={(sets) => onChange({ ...values, sets })}
        onRemove={onRemoveSet}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || (requireSets && values.sets.length === 0)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
