/* eslint-disable react/prop-types */
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Swal from "sweetalert2";

export function Password({ password }) {
  const [visible, setVisible] = useState(false);
  const [passwordUser, setPasswordUser] = useState("");

  async function decryptPassword(encryptedPassword) {
    const data = {
      pass: encryptedPassword,
    };
    try {
      const responsePass = await fetch(
        "https://finditapi.felipedepauladev.site/decryptPass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const decrypted = await responsePass.json();
      console.log("Senha descriptografada:", decrypted);
      setPasswordUser(decrypted);
      return decrypted;
    } catch (error) {
      console.error("Erro ao descriptografar:", error);
      return "Erro na descriptografia";
    }
  }

  async function VerifyUser() {
    if (!visible) {
      const token = sessionStorage.getItem("token");
      const responseToken = await fetch(
        "https://finditapi.felipedepauladev.site/auth-enter",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const dataToken = await responseToken.json();
      if (dataToken.cargoId.cargoId == 1) {
        decryptPassword(password);
        setVisible(true);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Atenção",
          text: "Este usuário não possui permissão para acessar esta área. Por favor, entre em contato com o administrador.",
          confirmButtonText: "Entendi",
        });
      }
    } else setVisible(false);
  }

  return (
    <div className="text-gray-600 flex items-center gap-2">
      <b>Senha:</b>
      <p>{visible ? passwordUser : "******"}</p>
      <div className="hover:cursor-pointer" onClick={() => VerifyUser()}>
        {!visible ? <EyeClosed /> : <Eye />}
      </div>
    </div>
  );
}
