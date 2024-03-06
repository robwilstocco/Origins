import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Modal({
  visible,
  type = "initial",
  handleFilled,
  handleName
}) {
  const [name, setName] = useState("");
  let message = "";
  switch (type) {
    case "partner":
      message = "Digite o nome do parceiro(a): ";
      break;
    case "children":
      message = "Digite o nome do filho(a): ";
      break;
    default:
      message = "Digite o nome do parente inicial: ";
      break;
  }
  const notify = () => {
    toast.error("Preencha o campo nome !", {
      position: "bottom-right",
      theme: "colored",
    });
  };

  function createTree(name) {
    if (name === "") return notify();
    let initialNode = [];
    switch (type) {
      case "partner":
        //cria parceiro
        handleFilled(true);
        handleName(name);
        visible(false);
        break;
      case "children":
        //cria filho
        handleFilled(true);
        handleName(name);
        visible(false)
        break;
      default:
        initialNode = [
          {
            id: "1",
            position: { x: 0, y: 0 },
            className: "light",
            style: {
              backgroundColor: "rgba(15, 2, 65, 0.2)",
              width: 170,
              height: 140,
            },
          },
          {
            id: "1a",
            data: { label: name },
            position: { x: 10, y: 10 },
            parentNode: "1",
            extent: "parent",
          },
        ];
        localStorage.setItem("nodes", JSON.stringify(initialNode));
        localStorage.setItem("edges", '[]');
        localStorage.setItem("lastId", '1');
        window.location.href = "/origins/tree";
        break;
    }
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50">
        <div className="relative w-1/2 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Nova Árvore</h3>
              <button
                className="p-1 bg-transparent text-black text-3xl font-semibold"
                onClick={() => visible(false)}
              >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-10 flex-auto">
              <label
                htmlFor="name"
                className="my-4 text-blueGray-500 text-lg leading-relaxed"
              >
                {message}
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full h-16 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  placeholder="Robert Wilson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-gray-800 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => visible(false)}
              >
                Fechar
              </button>
              <button
                className="bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => createTree(name)}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-35 fixed inset-0 z-40 bg-black"></div>
      <ToastContainer />
    </>
  );
}
