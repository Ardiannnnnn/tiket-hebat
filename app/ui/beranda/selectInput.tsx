

export default function SelectInput(props: {title: string, id: string, option: string[]}) {
    return (
        <div className="mb-5">
          <label
            htmlFor="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            {props.title}
          </label>
          <select
            id={props.id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5"
          >
            {props.option.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
    )
}