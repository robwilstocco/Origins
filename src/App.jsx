import React from "react";
import ReactFlowChart from "./components/ReactFlowChart";

export default () => (
    // <ReactFlowChart />
    <div className="flex flex-col justify-center align-center gap-4 bg-gray-100 h-full w-full">
      <button className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 hover:text-white rounded-md mx-auto w-60 h-20">Nova Árvore</button>
      <button className="bg-gray-800 text-2xl text-gray-300 hover:bg-gray-700 hover:text-white rounded-md mx-auto w-60 h-20">Editar</button>
    </div>
);
