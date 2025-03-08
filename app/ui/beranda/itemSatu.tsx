export default function ScheduleTable() {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="md:w-[500px] bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse">
            {/* Header */}
            <thead>
              <tr className="border-b-2 border-Orange text-gray-900 text-left">
                <th className="p-3">Rute</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kapal</th>
              </tr>
            </thead>
            {/* Body */}
            <tbody>
              {[...Array(7)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-Blue text-gray-900"
                >
                  <td className="p-3">Sinabang - Calang</td>
                  <td className="p-3">10-12-2024</td>
                  <td className="p-3">Aceh Hebat 3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  