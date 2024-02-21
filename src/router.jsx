import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Index from './pages/index';
import FamilyTree from './pages/FamilyTree';

export default function Routes(){
  return(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Index}/>
      <Route path="/familytree" component={FamilyTree}/>
    </Switch>
  </BrowserRouter>
  );
}