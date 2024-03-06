import React from "react";
import { Link } from "react-router-dom";
export default () => {
  return (
    <nav className="bg-slate-100">
      <div className="mx-40 flex h-14">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex justify-center items-center">
            <Link
              to="/origins/"
              className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Voltar
            </Link>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <div className="relative flex space-x-4">
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
            <a
              href="#"
              className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Demo
            </a>
            <a
              href="#"
              className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Organizar
            </a>
            <a
              href="#"
              className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
