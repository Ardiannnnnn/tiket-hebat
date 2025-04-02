import { RiAnchorFill, RiShipFill, RiRouteFill, RiUserFill } from "react-icons/ri";

const data = [
  { title: "Pelabuhan", jumlah: 6, icon: RiAnchorFill, color: "bg-blue-100", textColor: "text-blue-700" },
  { title: "Kapal", jumlah: 4, icon: RiShipFill, color: "bg-purple-100", textColor: "text-purple-700" },
  { title: "Rute Perjalanan", jumlah: 6, icon: RiRouteFill, color: "bg-green-100", textColor: "text-green-700" },
  { title: "Petugas Loket", jumlah: 6, icon: RiUserFill, color: "bg-red-100", textColor: "text-red-700" },
];

export default function Beranda() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold mb-4">Beranda</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className={`p-4 rounded-lg shadow-md ${item.color}`}>
              <div className="flex items-center justify-between">
                <div className={`flex flex-col items-start ${item.textColor}`}>
                  <IconComponent className="text-3xl mb-2" />
                  <p className="text-lg font-semibold uppercase">{item.title}</p>
                </div>
                <div className="border bg-white p-5 rounded-lg">
                  <p className={`text-xl font-bold ${item.textColor}`}>{item.jumlah}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <hr />
      </div>
    </div>
  );
}
