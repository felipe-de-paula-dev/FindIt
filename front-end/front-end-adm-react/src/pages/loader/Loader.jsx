/* eslint-disable react-hooks/exhaustive-deps */
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "../dashboard/Dashboard";

export function Loader() {
  const [text, setText] = useState("Sincronizando Dados");
  const [verifyLogin, setVerifyLogin] = useState(false);
  const navigate = useNavigate();

  function isAuthenticated() {
    return document.cookie.includes("auth=true");
  }

  useEffect(() => {
    const handlePageLoad = () => {
      if (isAuthenticated) setVerifyLogin(true);
    };

    window.addEventListener("pageshow", handlePageLoad);

    return () => {
      window.removeEventListener("pageshow", handlePageLoad);
    };
  }, []);

  useEffect(() => {
    const verificarUsuario = () => {
      if (!isAuthenticated())
        setText("Dados Não Localizados No Banco Dados"),
          setTimeout(() => {
            navigate("/");
          }, 1500);
      else {
        setText("Dados Confirmados"),
          setTimeout(() => {
            setVerifyLogin(true);
          }, 1500);
      }
    };
    setTimeout(() => {
      setText("Verificando Dados Do Usuario");
      setTimeout(() => {
        verificarUsuario();
      }, 1500);
    }, 2000);
  }, []);

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
