import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "../dashboard/Dashboard";

export function Loader() {
  const [text, setText] = useState("Sincronizando Dados");
  const [verifyLogin, setVerifyLogin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    function isAuthenticated() {
      if (token) setVerifyLogin(true);
      else setVerifyLogin(false);
    }
    isAuthenticated();
  }, []);

  useEffect(() => {
    if (verifyLogin == null) return;

    console.log(verifyLogin);

    const verificarUsuario = () => {
      if (verifyLogin == true) {
        setText("Dados Confirmados");
      } else {
        setText("Dados Não Localizados No Banco de Dados");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    };

    setText("Verificando Dados Do Usuario");
    verificarUsuario();
  }, [verifyLogin, navigate]);

  return (
    <div className="w-screen h-screen bg-slate-900 flex justify-center items-center">
      {!verifyLogin && (
        <div className="w-screen h-screen">
          <div className="absolute w-96 h-96 bg-red-500 opacity-5 blur-3xl animate-blur1"></div>
          <div className="absolute w-80 h-80 bg-red-400 opacity-5 blur-3xl animate-blur2"></div>
          <div className="absolute w-96 h-96 bg-red-600 opacity-5 blur-3xl animate-blur3"></div>
          <div className="flex flex-col items-center">
            <p className="text-8xl font-semibold flex items-baseline text-white gap-1 absolute top-[45%] translate-y-[-50%]">
              <p>Find</p>
              <p className="text-red-600">It</p>
              <Search
                size={72}
                strokeWidth={3.3}
                className="text-red-600 animate-searchSvg"
              />
            </p>
            <LoaderCircle
              size={36}
              strokeWidth={3}
              className="text-white animate-loading absolute bottom-[13%] z-10"
            />
            <LoaderCircle
              size={36}
              strokeWidth={3}
              className="text-red-600 animate-loading-2 absolute bottom-[13%] z-[5]"
            />
            <p className="text-white absolute bottom-[8%] text-[20px] font-[400]">
              {text}
            </p>
          </div>
        </div>
      )}
      {verifyLogin && <Dashboard />}
    </div>
  );
}
