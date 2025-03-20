import {
  SiGithub,
  SiInstagram,
  SiLinkerd,
} from "@icons-pack/react-simple-icons";

import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-[60px] w-full">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-lg font-semibold">
              Unicamp & Find<span className="text-red-500">It</span>
            </p>
            <p className="text-md text-gray-300">By Felipe de Paula</p>
          </div>

          <div className="flex justify-center sm:justify-end gap-6 text-gray-300">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-red-500 transition-transform duration-200 hover:scale-110"
            >
              <FaInstagram size={32} />
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-green-500 transition-transform duration-200 hover:scale-110"
            >
              <FaGithub size={32} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-blue-500 transition-transform duration-200 hover:scale-110"
            >
              <FaLinkedin size={32} />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-100">
          <p className="text-lg font-semibold">
            &copy; {new Date().getFullYear()} Powered By Find
            <span className="text-red-500">It</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
