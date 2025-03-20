import { MoveUp } from "lucide-react";

export function Top({ onRolagemTop }) {
  return (
    <div className="fixed bottom-4 right-4 text-white bg-red-600 p-4 rounded-full hover:scale-110 transition-all hover:cursor-pointer z-50">
      <MoveUp onClick={onRolagemTop} />
    </div>
  );
}
