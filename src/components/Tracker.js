import React, { useState } from 'react';
import AddTransaction from './AddTransaction';
import OverviewComponent from './OverviewComponent';
import TransactionsContainer from './TransactionsContainer';

const Tracker = () => {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const calculateIncome = () => {
    return transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((acc, item) => acc + item.amount, 0);
  };

  const calculateExpense = () => {
    return transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, item) => acc + item.amount, 0);
  };

  const calculateBalance = () => {
    return calculateIncome() + calculateExpense();
  };

  return (
    <div>
      <OverviewComponent 
        balance={calculateBalance()} 
        income={calculateIncome()} 
        expense={Math.abs(calculateExpense())} 
      />
      <AddTransaction addTransaction={addTransaction} />
      <TransactionsContainer 
        transactions={transactions} 
        deleteTransaction={deleteTransaction} 
      />
    </div>
  );
};

export default Tracker;
