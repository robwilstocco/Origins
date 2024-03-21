import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import Modal from "../components/Modal/Modal";
import ToolBox from "../components/ToolBox/ToolBox";

//ajustar id para acompanhar o localstorage
let id = 0;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  //ReactFlow variables
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("children");
  const [name, setName] = useState("");
  const [filled, setFilled] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);

  //Load Initial Values
  useEffect(() => {
    const savedNodes = localStorage.getItem("nodes");
    const savedEdges = localStorage.getItem("edges");
    id = Number(localStorage.getItem('nextId'));
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

      if(modalType === 'children') localStorage.setItem("nextId", id.toString());
    }
  }, [filled]);

  const onConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  }, []);

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

  return (
    <div style={{ width: "100vw", height: "89vh" }} ref={reactFlowWrapper}>
      <ToolBox />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
