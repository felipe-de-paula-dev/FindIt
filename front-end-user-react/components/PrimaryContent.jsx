export function PrimaryContent({ onRolagem }) {
  return (
    <div className="mt-3 shadow shadow-black h-fit  relative flex justify-center items-center flex-col">
      <img
        src="/capa.jpg"
        alt=""
        className="w-screen h-[500px] object-cover opacity-20 z-10"
      />
      <div className="absolute bottom-0 left-0 w-full h-full bg-black -z-10"></div>
      <div className="flex z-10 absolute flex-col gap-3 text-center items-center">
        <h1 className="text-white text-5xl font-bold">
          Encontre Seus Itens Perdidos
        </h1>
        <p className="text-white text-[20px] font-light w-[80%]">
          Consulte a lista de achados e recupere seu item facilmente.
        </p>
        <button
          className="z-20 bg-red-700 text-white p-2 rounded-xl w-fit text-[20px] hover:scale-105 transition-all hover: cursor-pointer"
          onClick={onRolagem}
        >
          Ver Achados
        </button>
      </div>
    </div>
  );
}
