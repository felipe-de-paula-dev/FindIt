/* eslint-disable react/prop-types */
export function ReportOption({ id, isClicked, onClick, children }) {
  const handleClick = () => {
    onClick(id);
  };
  return (
    <li
      className={`space-y-6 font-normal text-[15px] flex items-center gap-2 w-full pl-4 p-2 hover:cursor-pointer ${
        isClicked ? "bg-blue-100" : "bg-transparent"
      }`}
      onClick={handleClick}
    >
      {children}
    </li>
  );
}
