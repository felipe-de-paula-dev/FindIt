import {
  SiGithub,
  SiInstagram,
  SiLinkerd,
} from "@icons-pack/react-simple-icons";

import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <div className="bg-gray-800 text-white py-8 mt-15  h-fit w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-lg font-semibold">
              Unicamp & Find<span className="text-red-500">It</span>
            </p>
            <p className="text-[15px]"> By Felipe de Paula</p>
          </div>
          <div className="flex justify-center sm:justify-end gap-4 sm:mt-0">
            <a href="#" className="text-sm hover:text-red-600  transition-all">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-sm hover:text-green-600 transition-all">
              <FaGithub size={24} />
            </a>
            <a href="#" className="text-sm hover:text-blue-600 transition-all">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center flex items-center gap-2 w-full justify-center">
          <p className="text-[18px]">&copy;</p>
          <p className="text-[18px] justify-center font-semibold">
            {new Date().getFullYear()} Powered By Find
            <span className="text-red-500">It</span>
          </p>
        </div>
      </div>
    </div>
  );
}
