import React, { Component } from "react";
import {FormGroup,FormControl,Button} from 'react-bootstrap';
import history from '../history';
import {Link,withRouter,useHistory} from 'react-router-dom';

class ConductTransaction extends Component {
    state = {recipient: '',amount: 0}

    updateRecipient = event => {
        this.setState({recipient: event.target.value});
    }
    updateAmount = event => {
        this.setState({amount: Number(event.target.value) });
    }

    ConductTransaction = () => {
        const {recipient,amount} = this.state;

        fetch(`${document.location.origin}/api/transact`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({recipient,amount})
            
        }).then(response => response.json())
        .then(json => {
            alert(json.message || json.type);
            
            //history.push('/transaction-pool');
        });
    }

    render() {
        

        return(
            <div className='ConductTransaction'>
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl
                    input='text'
                    placeholder='recipient'
                    value={this.state.recipient}
                    onChange={this.updateRecipient}                    
                    />
                </FormGroup>
                <FormGroup>
                    <FormControl
                    input='number'
                    placeholder='amount'
                    value={this.state.amount}
                    onChange={this.updateAmount}                    
                    />
                </FormGroup>
                <div>
                    <Button 
                    bsStyle="danger" 
                    onClick={this.ConductTransaction}
                    >
                        Submit
                    </Button>
                </div>
                <br/>
                <div><Link to='/transaction-pool'>View Transaction Pool Map</Link></div>
            </div>
        )
    }
}


export default ConductTransaction;