import { User } from "lucide-react";

export function Nav() {
  return (
    <div className="w-screen flex items-center justify-center mt-5 mx-auto max-w-4xl lg:justify-between">
      <img src="/unicamp.png" alt="" width={256} />
      <div className="hidden items-center gap-6 lg:flex">
        <p className="font-semibold">
          <span className="text-red-600">A</span>chados e{" "}
          <span className="text-red-600">P</span>erdidos
        </p>
        <div className="bg-slate-100 border border-slate-300 shadow  h-fit p-1 w-[60px] justify-center rounded-md flex items-center gap-2 hover:cursor-pointer">
          <p className="font-semibold">
            <span className="text-red-600">L</span>ogin
          </p>
        </div>
      </div>
    </div>
  );
}
