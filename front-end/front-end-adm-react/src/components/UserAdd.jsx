import { useState } from "react";
import Swal from "sweetalert2";

export function UserAdd() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [imgUserPhoto, setImgUserPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgUserPhoto(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("user", user);
    formData.append("senha", password);
    formData.append("cargo_id", cargoId);
    formData.append("folder", "user");
    formData.append("imgUserPhoto", imgUserPhoto);

    try {
      const response = await fetch(
        "https://findit-08qb.onrender.com/user/create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Adicionado!",
          text: "Usuário Criado Com Sucesso!",
          timer: 3000,
        });
        setTimeout(() => {
          setUser("");
          setPassword("");
          setCargoId("");
          setImgUserPhoto(null);
          setPreviewImage(null);
        }, 2000);
      } else {
        throw new Error("Erro ao criar usuário");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: error.message || "Erro desconhecido",
        timer: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-6 py-8">
      <div className="w-[95%]  border-b pb-4 border-gray-300 flex justify-center items-center px-6 ">
        <h2 className="text-3xl font-semibold text-gray-800">
          Adicionar Usuário
        </h2>
      </div>

      {alert &&
        (setTimeout(() => {
          setAlert(null);
        }, 2000),
        (
          <div
            className={`absolute top-0 left-[50%] translate-x-[-50%] mt-4 p-3 rounded-md text-white ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        ))}

      <div className="flex flex-col md:flex-row mt-6 w-full max-w-2xl bg-white p-6 rounded-xl shadow-md gap-6">
        <form
          id="signupForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full md:w-2/3"
        >
          <div>
            <label
              htmlFor="newUser"
              className="block text-sm font-medium text-gray-700"
            >
              Usuário:
            </label>
            <input
              type="text"
              id="newUser"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="newCargoId"
              className="block text-sm font-medium text-gray-700"
            >
              Cargo:
            </label>
            <select
              id="newCargoId"
              required
              value={cargoId}
              onChange={(e) => setCargoId(e.target.value)}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Selecione o cargo
              </option>
              <option value="1">Administrador</option>
              <option value="2">Funcionário</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="imgUserInput"
              className="block text-sm font-medium text-gray-700"
            >
              Foto do Usuário:
            </label>
            <input
              type="file"
              id="imgUserInput"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="border border-gray-300 p-2 rounded-md w-full  overflow-hidden object-cover focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all"
          >
            Cadastrar
          </button>
        </form>

        <div className="flex justify-center items-center w-full md:w-1/3">
          <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Nenhuma imagem</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
