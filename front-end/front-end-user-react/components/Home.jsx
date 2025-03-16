import { CornerDownLeft, HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const Navigate = useNavigate();

  return (
    <div
      className="fixed bottom-4 right-4 text-white bg-red-600 p-4 rounded-full hover:scale-115 transition-all hover:cursor-pointer z-50"
      onClick={() => {
        Navigate("/");
      }}
    >
      <HomeIcon />
    </div>
  );
}
