import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const goToDashboard = async () => {
    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAlertMessage(`Erro: ${data.message}`);
        setAlertType("error");
        setShowAlert(true);
        return;
      }

      if (response.ok) {
        document.cookie = "auth=true; path=/";
      }

      setAlertMessage("Login realizado com sucesso!");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/dashboard", { state: data });
      }, 2000);
    } catch {
      setAlertMessage("Banco de Dados Não Conectado");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  return (
    <div className="bg-slate-900 w-screen h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute w-96 h-96 bg-red-500 opacity-10 blur-3xl animate-blur1"></div>
      <div className="absolute w-80 h-80 bg-red-400 opacity-10 blur-3xl animate-blur2"></div>
      <div className="absolute w-96 h-96 bg-red-600 opacity-10 blur-3xl animate-blur3"></div>

      <div className="flex flex-col items-center z-10">
        <ul className="flex items-baseline mb-2">
          <li>
            <h1 className="text-white text-4xl font-Mulish font-bold">Find</h1>
          </li>
          <li>
            <h1 className="text-vermelhointenso text-5xl font-Mulish font-extrabold">
              It
            </h1>
          </li>
          <Search
            className="text-vermelhointenso ml-1"
            strokeWidth={3}
            size={32}
          />
        </ul>
        <div className="bg-white shadow rouded-[10px] flex items-center justify-center flex-col w-[400px] h-[350px] pt-4 pb-2">
          <h1 className="self-start ml-6 text-xl font-medium">
            Find<span className="text-vermelhointenso">It</span> Admin Login
          </h1>
          <p className="self-start ml-6 font-normal">
            Por Favor, Preencha Os Campos Abaixo
          </p>

          <form action="" className="flex flex-col m-2 gap-5 space-y-2">
            <input
              type="text"
              placeholder="User"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              className="p-2 w-[350px] bg-transparent border-b-1 border-black shadow focus:outline-none focus:ring focus:border-b-vermelhointenso focus:bg-red-50 ring-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="p-2 w-[350px] bg-transparent border-b-1 border-black shadow focus:outline-none focus:ring focus:border-b-vermelhointenso focus:bg-red-50 ring-transparent"
            />
            <input
              type="button"
              value="Login"
              onClick={goToDashboard}
              className="p-2 w-[350px] shadow mt-6 bg-linear-65 from-red-900 to-vermelhointenso text-white font-medium rounded-[5px] hover:cursor-pointer"
            />
          </form>
        </div>
      </div>

      {showAlert && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-lg ${
            alertType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}
