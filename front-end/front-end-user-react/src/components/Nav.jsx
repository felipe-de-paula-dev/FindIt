import { User } from "lucide-react";

export function Nav() {
  return (
    <div className="w-screen flex items-center justify-center mt-5 mx-auto max-w-4xl lg:justify-between">
      <img src="/unicamp.png" alt="" width={256} />
      <div className="hidden lg:flex items-center gap-8 p-4">
        <div className="bg-red-600 py-2 px-4 flex items-center justify-center gap-3 rounded-full shadow-2xl transform hover:bg-red-700 hover:scale-110 transition-all duration-300">
          <p
            className="font-bold text-white text-xl hover:cursor-pointer"
            onClick={() =>
              window.open("https://find-it-adm.vercel.app/", "_blank")
            }
          >
            <span className="text-white">L</span>ogin
          </p>
        </div>
      </div>
    </div>
  );
}
