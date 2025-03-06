import SelectInput from "./selectInput";

const propsExample = [
  {
    title: "Pilih Asal",
    id: "countries",
    options: ["United States", "Canada", "France", "Germany"],
  },
  {
    title: "Pilih Tujuan",
    id: "countries",
    options: ["United States", "Canada", "France", "Germany"],
  },
  {
    title: "Pilih Jadwal",
    id: "countries",
    options: ["United States", "Canada", "France", "Germany"],
  },
  {
    title: "Pilih Kapal",
    id: "countries",
    options: ["United States", "Canada", "France", "Germany"],
  },
];

export function Form() {
  return (
    <div className="p-6 md:p-8 rounded-lg bg-amber-50 md:w-1/2">
      <form action="" className="flex flex-col justify-center space-y-2 md:space-y-10">
        <h2 className="text-2xl font-semibold text-Orange">
          Cari Jadwal Kapal
        </h2>
        <div className="grid md:grid-cols-2 md:gap-4">
          {propsExample.map((prop) => (
            <SelectInput
              key={prop.title}
              title={prop.title}
              id={prop.id}
              option={prop.options}
            />
          ))}
        </div>
        <button
          type="submit"
          className="bg-Blue text-white rounded-lg p-2.5 hover:bg-blue-600"
        >
          Cari
        </button>
      </form>
    </div>
  );
}
