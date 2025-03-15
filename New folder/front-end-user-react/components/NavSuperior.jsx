export function NavSuperior() {
  return (
    <div className="w-screen bg-red-700 text-white py-2 h-fit flex justify-evenly items-center ">
      <p className="font-light flex items-center gap-1">
        <span className="font-semibold text-[18px]">&copy;</span> By Find
        <span className="font-bold">It</span>
      </p>
      <img src="/brazil.svg" alt="" width={28} height={28} className="" />
    </div>
  );
}
