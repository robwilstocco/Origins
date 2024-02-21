import React from "react";
import ReactFlowChart from "./pages/FamilyTree";
import Modal from "./components/Modal/Modal";
// import Routes from './routes';

export default () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    // <ReactFlowChart />
    <div className="flex flex-col justify-center align-center gap-4 bg-gray-100 h-full w-full">
      <button
        className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 rounded-md mx-auto w-60 h-20"
        onClick={() => setShowModal(true)}
      >
        Nova Árvore
      </button>
      <button className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 rounded-md mx-auto w-60 h-20">
        Editar
      </button>
      {showModal ? <Modal visible={setShowModal}/> : null}
    </div>
  );
};
