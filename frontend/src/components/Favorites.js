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

    // Function to delete a transaction
    const handleDelete = (transaction) => {
        // Delete the transaction from the state
        setTransactions(transactions.filter(t => t._id !== transaction._id));
        // Update the transactions list in local storage
        localStorage.setItem("transactionsList", JSON.stringify(transactions.filter(t => t._id !== transaction._id)));
    }

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
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => {
                                    const date = new Date(transaction.date);
                                    const formattedDate = date.toISOString().slice(0, 10);
                                    return (
                                        <tr key={transaction._id}>
                                            <td>{formattedDate}</td>
                                            <td>{transaction.amount}</td>
                                            <td>{transaction.description}</td>
                                            <td>
                                                <button onClick={() => handleDelete(transaction)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
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

