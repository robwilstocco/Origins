import React from "react";
import { Link } from "react-router-dom";
import { useReactFlow, getViewportForBounds, getNodesBounds } from "reactflow";
import { toPng } from "html-to-image";

function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.setAttribute("download", "OriginsFamilyTree.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = screen.width;
const imageHeight = screen.height;

export default () => {
  const { getNodes } = useReactFlow();  
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      3,
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#fafafa",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };

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
            <button className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
              Organizar
            </button>
            <button
              className="text-gray-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
              onClick={onClick}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
