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

let id = 2;
const getId = () => `${id++}`;

const initialEdges = [
  { id: "1a-1b", source: "1a", target: "1b", animated: true },
];

const AddNodeOnEdgeDrop = () => {

  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [initialNodes,setInitialNode] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('children')
  const { screenToFlowPosition } = useReactFlow();

  useEffect(()=>{
    const saved = localStorage.getItem('initialNode')
    setInitialNode(JSON.parse(saved))
    setNodes(JSON.parse(saved))
  },[])

  const onConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
    console.log('teste')
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd =  useCallback(
    (event) => {
      if (!connectingNodeId.current) return;
      setOpenModal(true);
      
      //caso seja um parceiro
      if (connectingNodeId.current.slice(-1) === "a") {
        setModalType('partner');
        const newNode = {
          id: connectingNodeId.current.slice(0, -1) + "b",
          data: { label: "teste 2" },
          position: { x: 10, y: 90 },
          parentNode: connectingNodeId.current.slice(0, -1),
          extent: "parent",
          type: "output",
        };

        let isValid = true;

        setNodes((nds) => {
          nds.map((node) => {
            if (node.id === newNode.id) {
              console.log("existe");
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
      }

      const targetIsPane = event.target.classList.contains("react-flow__pane");

      //caso seja um nó de Filho
      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        setModalType('children')
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
          data: { label: "teste" },
          position: { x: 10, y: 10 },
          parentNode: id,
          extent: "parent",
        };

        setNodes((nds) => {
          return nds.concat(newGroup, newNode);
        });
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id }),
        );
      }
    },
    [screenToFlowPosition],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        attributionPosition="top-right"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      {openModal && <Modal visible={setOpenModal} type={modalType} handleNodes={setNodes} handleEdges={setEdges}/>}
    </div> 
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
