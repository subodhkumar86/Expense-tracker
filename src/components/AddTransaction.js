import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const AddTransaction = ({ addTransaction }) => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && amount) {
      addTransaction({
        id: Math.floor(Math.random() * 100000000),
        text,
        amount: +amount,
      });
      setText('');
      setAmount('');
    }
  };

  return (
    <FormContainer>
      <h3>Add New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Text</label>
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Enter description" 
          />
        </div>
        <div>
          <label>Amount</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Enter amount" 
          />
        </div>
        <button type="submit">Add Transaction</button>
      </form>
    </FormContainer>
  );
};

export default AddTransaction;
