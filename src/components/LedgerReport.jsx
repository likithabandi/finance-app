import React, { useState, useEffect } from "react";

const LedgerReport = ({ partner, ledgerItems, startDate, endDate }) => {
  // State to store the running balance, total debit and credit values
const [totalDebit, setTotalDebit] = useState(0);
const [totalCredit, setTotalCredit] = useState(0);
const [runningBalance, setRunningBalance] = useState(0);

// State to store the updated ledger items
const [updatedLedgerItems, setUpdatedLedgerItems] = useState([]);

useEffect(() => {
  // Calculate and update the total Debit and Credit values
  let debitTotal = 0;
  let creditTotal = 0;
  let currentBalance = parseFloat(partner.openingBalance);

  const updatedItems = ledgerItems.map((item) => {
    // Calculate debit and credit values as numbers
    const debit = parseFloat(item.debit);
    const credit = parseFloat(item.credit);

    // Update the balance based on debit or credit
    const balance = (currentBalance + debit - credit).toFixed(2);

    // Update the total Debit and Credit based on whether the balance is positive or negative
    debitTotal += debit;
    creditTotal += credit;

    // Update the running balance for the next iteration
    currentBalance = parseFloat(balance);

    // Return the updated item
    return {
      ...item,
      balance,
    };
  });

  // If the opening balance is positive, add it to the totalDebit; otherwise, add it to the totalCredit
  if (partner.openingBalance >= 0) {
    debitTotal += parseFloat(partner.openingBalance);
  } else {
    creditTotal += Math.abs(parseFloat(partner.openingBalance));
  }
  // Set the updated values in state
  setTotalDebit(debitTotal);
  setTotalCredit(creditTotal);
  setUpdatedLedgerItems(updatedItems);
  setRunningBalance(currentBalance);
}, [partner, ledgerItems, startDate, endDate]);

  return (
    <div className="container">
      <div class="card col-md-10 offset-md-1">
        <div class="card-body">
  <div class="row align-items-start">
    <div class="col">
      <img
        src="/logos/logo.png"
        alt="Company Logo"
        className="img-fluid"
        style={{ maxWidth: "100px" }}
      />
    </div>
    <div class="col text-end">
      <h1>GENERAL LEDGER</h1>
    </div>
  </div>
  <div class="row align-items-start mt-3 mb-5">
    <hr className="mb-0" />
    <div className="col">
      <strong>Full Name:</strong> {partner.firstName} {partner.lastName}
      <br />
      <strong>Address:</strong> {partner.address}
      <br />
      <strong>Contact No.:</strong> {partner.contactNo}
    </div>
    <div className="col text-end">
      <strong>Status:</strong> {partner.status}
      <br />
      <strong>Statement From:</strong> {startDate}
      <br />
      <strong>Statement To:</strong> {endDate}
    </div>
    <hr />
  </div>

  <div class="row">
    <div class="col">
      <table class="table table-bordered text-center table-sm">
        <thead>
          <tr>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Date
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Instrument No.
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Reference
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Description
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Quantity
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Debit
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Credit
            </th>
            <th className="bg-body-secondary bg-opacity-50" scope="col">
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{startDate}</td>
            <td></td>
            <td></td>
            <td>Opening Balance</td>
            <td></td>
            <td className="text-end">
              {parseFloat(partner.openingBalance) >= 0
                ? `$${parseFloat(
                    partner.openingBalance
                  ).toLocaleString()}`
                : ""}
            </td>
            <td className="text-end">
              {parseFloat(partner.openingBalance) < 0
                ? `$${Math.abs(
                    parseFloat(partner.openingBalance)
                  ).toLocaleString()}`
                : ""}
            </td>
            <td className="text-end">
              {partner.openingBalance >= 0
                ? `$${parseFloat(
                    partner.openingBalance
                  ).toLocaleString()}`
                : `($${Math.abs(
                    parseFloat(partner.openingBalance)
                  ).toLocaleString()})`}
            </td>
          </tr>
          {updatedLedgerItems.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.instrumentNo}</td>
              <td>{item.reference}</td>
              <td>{item.description}</td>
              <td>
                {item.quantity === "0"
                  ? ""
                  : parseFloat(item.quantity).toLocaleString()}
              </td>
              <td className="text-end">
                ${parseFloat(item.debit).toLocaleString()}
              </td>
              <td className="text-end">
                ${parseFloat(item.credit).toLocaleString()}
              </td>
              <td className="text-end">
                {item.balance >= 0
                  ? `$${parseFloat(item.balance).toLocaleString()}`
                  : `($${Math.abs(
                      parseFloat(item.balance)
                    ).toLocaleString()})`}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="fw-bold">
            <td
              colSpan={4}
              className="text-start bg-body-secondary bg-opacity-50"
            >
              Total:
            </td>
            <td className="bg-body-secondary bg-opacity-50">
              {ledgerItems
                .reduce(
                  (total, item) => total + parseFloat(item.quantity),
                  0
                )
                .toLocaleString()}
            </td>
            <td className="text-end bg-body-secondary bg-opacity-50">
              ${parseFloat(totalDebit).toLocaleString()}
            </td>
            <td className="text-end bg-body-secondary bg-opacity-50">
              ${parseFloat(totalCredit).toLocaleString()}
            </td>
            <td className="text-end bg-body-secondary bg-opacity-50">
              {runningBalance >= 0
                ? `$${parseFloat(runningBalance).toLocaleString()}`
                : `($${Math.abs(
                    parseFloat(runningBalance)
                  ).toLocaleString()})`}
            </td>
          </tr>
        </tfoot>
      </table>
      <a href="/ledger" class="btn btn-danger mt-3">
        Back
      </a>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default LedgerReport;
