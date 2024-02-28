import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/index';
import FamilyTree from './pages/FamilyTree';

export default () => {
  return(
  <BrowserRouter>
    <Routes>
      <Route path="/origins/" exact element={<Index/>}/>
      <Route path="/origins/tree" element={<FamilyTree/>}/>
    </Routes>
  </BrowserRouter>
  );
}