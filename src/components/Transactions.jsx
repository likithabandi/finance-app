import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Transactions = ({ transactionType }) => {
  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // Add a loading state

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  // Fetch all payments/receipts
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `/transactions?type=${transactionType}`
      );

      if (response.status === 200) {
        if (response.data.length === 0) {
          setAlertType("warning");
          setAlertMessage(`No ${transactionType}s found.`);
        } else {
          setTransactions(response.data);
        }
      } else {
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve ${transactionType}s: ${response.status} ${response.statusText}`
        );
      }

      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(
        `Failed to retrieve ${transactionType}s: ${error.message}`
      );
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  fetchTransactions();
}, [transactionType]);

const getTransactionTypeName = (type) => {
  const types = {
    BPV: "Bank Payment Voucher",
    CPV: "Cash Payment Voucher",
    BRV: "Bank Receipt Voucher",
    CRV: "Cash Receipt Voucher",
  };
  return types[type] || "Unknown";
};

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>{transactionType === "payment" ? "Payments" : "Receipts"}</h2>
    <Link to="add" className="btn btn-outline-secondary mt-3 mb-4">
      Add {transactionType === "payment" ? "Payment" : "Receipt"}
    </Link>
    {alertMessage ? (
      <Alert type={alertType} message={alertMessage} />
    ) : (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Voucher No.</th>
            <th>Date</th>
            <th>Type</th>
            <th>
              {transactionType === "payment"
                ? "Payment To"
                : "Receipt From"}
            </th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction._id}>
              <td>{transaction.transaction.voucherNo}</td>
              <td>{transaction.transaction.date}</td>
              <td>{getTransactionTypeName(transaction.transaction.type)}</td>
              <td>
                {transaction.partner.firstName}{" "}
                {transaction.partner.lastName}
              </td>
              <td>
                $
                {parseFloat(
                  transaction.transaction.amount
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </>
)}
      </div>
    </div>
  );
};

export default Transactions;
