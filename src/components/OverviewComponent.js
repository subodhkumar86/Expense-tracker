import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const SummaryItem = styled.div`
  text-align: center;
  h3 {
    color: #555;
  }
  p {
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const OverviewComponent = ({ balance, income, expense }) => {
  return (
    <SummaryContainer>
      <SummaryItem>
        <h3>Balance</h3>
        <p>${balance}</p>
      </SummaryItem>
      <SummaryItem>
        <h3>Income</h3>
        <p style={{ color: '#4caf50' }}>${income}</p>
      </SummaryItem>
      <SummaryItem>
        <h3>Expense</h3>
        <p style={{ color: '#f44336' }}>${expense}</p>
      </SummaryItem>
    </SummaryContainer>
  );
};

export default OverviewComponent;
