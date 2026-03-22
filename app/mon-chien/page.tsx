export default function DogProfilePage() {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Profil de mon chien</h1>
      <form className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <label htmlFor="dogName" className="mb-1 block text-sm font-medium text-slate-700">
            Nom du chien
          </label>
          <input
            id="dogName"
            type="text"
            placeholder="ex: Rocky"
            className="w-full rounded-lg border px-3 py-2 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="md:col-span-1">
          <label htmlFor="breed" className="mb-1 block text-sm font-medium text-slate-700">
            Race
          </label>
          <input
            id="breed"
            type="text"
            placeholder="ex: Labrador"
            className="w-full rounded-lg border px-3 py-2 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="size" className="mb-1 block text-sm font-medium text-slate-700">
            Taille
          </label>
          <select
            id="size"
            className="w-full rounded-lg border px-3 py-2 outline-none ring-brand focus:ring-2"
          >
            <option>Petit</option>
            <option>Moyen</option>
            <option>Grand</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
            Notes speciales
          </label>
          <textarea
            id="notes"
            placeholder="Habitudes, sante, comportement..."
            rows={4}
            className="w-full rounded-lg border px-3 py-2 outline-none ring-brand focus:ring-2"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </section>
  );
}
