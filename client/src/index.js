import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import { useHistory,withRouter } from 'react-router-dom';
import {Switch,Route} from 'react-router-dom';
import history from './history';
import Blocks from './components/Blocks';
import App from './components/App';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './index.css';

render(
<Router history={history}>
    <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/blocks' component={Blocks}/>
        <Route path='/conduct-transaction' component={ConductTransaction}/>
        <Route path='/transaction-pool' component={TransactionPool}/>
    </Switch>
</Router>,
document.getElementById('root')
);