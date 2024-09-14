import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TransactionItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${({ isExpense }) => (isExpense ? '#f8d7da' : '#d4edda')};
  border-left: 5px solid ${({ isExpense }) => (isExpense ? '#f44336' : '#4caf50')};
  margin-bottom: 10px;
  border-radius: 5px;
`;

const TransactionText = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const TransactionAmount = styled.span`
  font-size: 1.2rem;
  color: ${({ isExpense }) => (isExpense ? '#f44336' : '#4caf50')};
`;

const DeleteIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-left: 10px;
  color: #f44336;
  transition: color 0.3s;

  &:hover {
    color: #d32f2f;
  }
`;

const TransactionItem = ({ transaction, deleteTransaction }) => {
  const isExpense = transaction.amount < 0;

  return (
    <TransactionItemContainer isExpense={isExpense}>
      <TransactionText>{transaction.text}</TransactionText>
      <TransactionAmount isExpense={isExpense}>
        ${Math.abs(transaction.amount)}
        <DeleteIcon
          icon={faTrash}
          onClick={() => deleteTransaction(transaction.id)}
        />
      </TransactionAmount>
    </TransactionItemContainer>
  );
};

export default TransactionItem;
