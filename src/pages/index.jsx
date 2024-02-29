import React from "react";
import Modal from "../components/Modal/Modal";
import { Link } from "react-router-dom";

export default () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div className="flex flex-col justify-center align-center gap-4 bg-gray-100 h-full w-full">
      <button
        className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 rounded-md mx-auto w-60 h-20"
        onClick={() => setShowModal(true)}
      >
        Nova Árvore
      </button>
      <Link to="/origins/tree" className="self-center">
        <button className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 rounded-md mx-auto w-60 h-20">
          Editar
        </button>
      </Link>
      {showModal ? <Modal visible={setShowModal} /> : null}
    </div>
  );
};
