import { Lock, Search, User } from "lucide-react";
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

      sessionStorage.setItem("token", data.token);
      setAlertMessage("Login realizado com sucesso!");
      setAlertType("success");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        navigate("/dashboard", { state: data });
      }, 3000);
    } catch {
      setAlertMessage("Banco de Dados Não Conectado");
      setAlertType("error");
      setShowAlert(true);
    }
  };

  return (
    <div className="bg-gray-900 w-screen h-screen flex items-center justify-center overflow-hidden relative">
      <div className="absolute w-96 h-96 bg-red-500 opacity-10 blur-3xl animate-blur1" />
      <div className="absolute w-80 h-80 bg-red-400 opacity-10 blur-3xl animate-blur2" />
      <div className="absolute w-96 h-96 bg-red-600 opacity-10 blur-3xl animate-blur3" />

      <div className="flex flex-col items-center z-10">
        <div className="flex items-baseline gap-1 mb-4">
          <h1 className="text-white text-4xl font-bold">Find</h1>
          <h1 className="text-red-500 text-5xl font-bold">It</h1>
          <Search className="text-red-500" strokeWidth={3.5} size={36} />
        </div>

        <div className="bg-white shadow-lg rounded-xl flex flex-col items-center justify-center w-[400px] p-6">
          <h2 className="text-xl font-semibold self-start text-gray-800">
            Find<span className="text-red-500">It</span> Admin Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 self-start">
            Por favor, preencha os campos abaixo
          </p>

          <form className="w-full flex flex-col gap-5">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-b border-gray-400 focus:border-red-500 focus:bg-red-50 transition-all outline-none bg-transparent text-gray-800"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-b border-gray-400 focus:border-red-500 focus:bg-red-50 transition-all outline-none bg-transparent text-gray-800"
              />
            </div>

            <button
              type="button"
              onClick={goToDashboard}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 transition-all text-white font-medium py-2 rounded-md shadow"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

      {showAlert && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-lg transition-all duration-300 ${
            alertType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}
