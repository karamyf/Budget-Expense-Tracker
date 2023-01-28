import React, { useState, useEffect } from "react";
import axios from "axios";

const Favorites = ({ allTransaction }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
      // Retrieve the transactions list from local storage
      const transactionsList = JSON.parse(localStorage.getItem("transactionsList")) || [];
      setTransactions(transactionsList);
      setLoading(false);
    }, []);
  
    return (
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {transactions.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction.name}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>You have no favorite transactions.</div>
            )}
          </div>
        )}
      </div>
    );
  };
  

export default Favorites;
