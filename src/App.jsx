import React from "react";
import Routes from './router';


export default () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Routes/>
  );
};
