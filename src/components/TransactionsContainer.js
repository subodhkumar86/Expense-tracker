import React from 'react';
import styled from 'styled-components';
import TransactionItem from './TransactionItem';

const TransactionContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionsContainer = ({ transactions, deleteTransaction }) => {
  return (
    <TransactionContainer>
      <h3>Transaction History</h3>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            deleteTransaction={deleteTransaction}
          />
        ))}
      </TransactionList>
    </TransactionContainer>
  );
};

export default TransactionsContainer;
