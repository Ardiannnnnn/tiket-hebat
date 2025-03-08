import SelectInput from "./selectInput";
import { RiShipFill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";
import { FaCalendarWeek } from "react-icons/fa";

const propsExample = [
  {
    title: "Pilih Asal",
    id: "countries",
    options: ["Sinabang", "Calang", "Meulaboh", "Labuhan Haji", "Pulau Banyak"],
    icon : <IoMdHome  className="w-5 h-5" />
  },
  {
    title: "Pilih Tujuan",
    id: "countries",
    options: ["Sinabang", "Calang", "Meulaboh", "Labuhan Haji", "Pulau Banyak"],
    icon : <IoMdHome  className="w-5 h-5" />
  },
  {
    title: "Pilih Jadwal",
    id: "countries",
    options: ["17-10-2021", "18-10-2021", "19-10-2021", "20-10-2021"],
    icon : <FaCalendarWeek className="w-4 h-4" />
  },
  {
    title: "Pilih Kapal",
    id: "countries",
    options: ["Aceh Hebat 1", "Teluk Sinabang", "Teluk Singkil"],
    icon : <RiShipFill className="w-5 h-5" />
  },
];

export function Form() {
  return (
    <div className="p-6 md:p-8 rounded-lg bg-amber-50 md:w-1/2">
      <form action="" className="flex flex-col justify-center space-y-2 md:space-y-10">
        <h2 className="text-2xl font-semibold text-Orange text-center">
          Cari Jadwal Kapal
        </h2>
        <div className="grid md:grid-cols-2 md:gap-4">
          {propsExample.map((prop) => (
            <SelectInput
              icon={prop.icon}
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
