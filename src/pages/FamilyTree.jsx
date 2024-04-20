import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  getViewportForBounds,
  getNodesBounds,
} from "reactflow";
import { toPng } from "html-to-image";
import dagre from "dagre";
import "reactflow/dist/style.css";
import Modal from "../components/Modal/Modal";
import ToolBox from "../components/ToolBox/ToolBox";

let id = 0;
const getId = () => `${id++}`;

//download
const imageWidth = screen.width;
const imageHeight = screen.height;
function downloadImage(dataUrl) {
  const a = document.createElement("a");
  a.setAttribute("download", "OriginsFamilyTree.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

//Organize
const nodeWidth = 170;
const nodeHeight = 140;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {
  console.log(nodes)
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "top";
    node.sourcePosition = "bottom";
    if (!node.id.includes('a') && !node.id.includes('b')){
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }
    return node;
  });
  return { nodes, edges };
};

const AddNodeOnEdgeDrop = () => {
  //ReactFlow variables
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getNodes } = useReactFlow();

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("children");
  const [name, setName] = useState("");
  const [filled, setFilled] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  

  //Load Initial Values
  useEffect(() => {
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");
    id = Number(localStorage.getItem("nextId"));
    setNodes(JSON.parse(savedNodes));
    setEdges(JSON.parse(savedEdges));
  }, []);

  //Updates localStorage when a new person is add
  useEffect(() => {
    if (lastEvent !== null && filled === true) {
      onConnectEnd(lastEvent, name);
      setFilled(false);
      localStorage.setItem("nodes", JSON.stringify(nodes));
      localStorage.setItem("edges", JSON.stringify(edges));

      if (modalType === "children")
        localStorage.setItem("nextId", id.toString());
    }
  }, [filled]);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event, name) => {
      if (!connectingNodeId.current) return;
      //if the node is a partner
      if (connectingNodeId.current.slice(-1) === "a") {
        setModalType("partner");
        const newNode = {
          id: connectingNodeId.current.slice(0, -1) + "b",
          data: { label: name },
          position: { x: 10, y: 90 },
          parentNode: connectingNodeId.current.slice(0, -1),
          extent: "parent",
          type: "output",
        };

        let isValid = true;

        setNodes((nds) => {
          nds.map((node) => {
            if (node.id === newNode.id) {
              isValid = false;
            }
          });
          return isValid ? nds.concat(newNode) : nds;
        });

        setEdges((eds) => {
          return isValid
            ? eds.concat({
                id:
                  connectingNodeId.current +
                  "-" +
                  connectingNodeId.current.slice(0, -1) +
                  "b",
                source: connectingNodeId.current,
                target: connectingNodeId.current.slice(0, -1) + "b",
                animated: true,
              })
            : eds;
        });
        return;
      }
      const targetIsPane = event.target.classList.contains("react-flow__pane");
      //if the node is a children
      if (targetIsPane) {
        const id = getId();
        const newGroup = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          className: "light",
          style: {
            backgroundColor: "rgba(15, 2, 65, 0.2)",
            width: 170,
            height: 140,
          },
        };
        const newNode = {
          id: id + "a",
          data: { label: name },
          position: { x: 10, y: 10 },
          parentNode: id,
          extent: "parent",
        };
        setNodes((nds) => nds.concat(newGroup, newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const changeModalType = (event) => {
    if (event.target.classList.contains("react-flow__pane")) {
      setModalType("children");
    } else {
      setModalType("partner");
    }
    setOpenModal(true);
    setLastEvent(event);
  };
  
  const handleDownload = () => {
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

  const handleOrganize = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, edges]);

  return (
    <div style={{ width: "100vw", height: "89vh" }} ref={reactFlowWrapper}>
      <ToolBox
        handleOrganize={handleOrganize}
        handleDownload={handleDownload}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnectEnd={changeModalType}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      {openModal && (
        <Modal
          visible={setOpenModal}
          type={modalType}
          handleFilled={setFilled}
          handleName={setName}
        />
      )}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
