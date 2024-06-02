import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Invoices = ({ invoiceType }) => {
  const [invoices, setInvoices] = useState([]);

  const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true); // Add a loading state

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`/invoices?type=${invoiceType}`);

      if (response.status === 200) {
        if (response.data.length === 0) {
          setAlertType("warning");
          setAlertMessage(`No ${invoiceType} invoices found.`);
        } else {
          setInvoices(response.data);
        }
      } else {
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve ${invoiceType} invoices: ${response.status} ${response.statusText}`
        );
      }

      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(
        `Failed to retrieve ${invoiceType} invoices: ${error.message}`
      );
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  fetchInvoices();
}, [invoiceType]);

const handleViewInvoice = (invoice) => {
  // Generate the URL for the InvoiceReport component with the invoice ID as a parameter
  let viewInvoiceUrl = `view?id=${invoice._id}`;

  // Navigate to the InvoiceReport component
  navigate(viewInvoiceUrl);
};


  return (
    <div>
      <NavBar />
      <div className="container mt-4">
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>{invoiceType === "sales" ? "Sales" : "Purchase"} Invoices</h2>
    <Link to="add" className="btn btn-outline-secondary mt-3 mb-4">
      Add {invoiceType === "sales" ? "Sales" : "Purchase"} Invoice
    </Link>
    {alertMessage ? (
      <Alert type={alertType} message={alertMessage} />
    ) : (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Invoice Date</th>
            <th>Invoice No.</th>
            <th>Due Date</th>
            <th>
              {invoiceType === "sales" ? "Customer" : "Vendor"} Name
            </th>
            <th>Total Items</th>
            <th>Invoice Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.invoice.invoiceDate}</td>
              <td>{invoice.invoice.invoiceNo}</td>
              <td>{invoice.invoice.dueDate}</td>
              <td>
                {invoice.partner.firstName}{" "}
                {invoice.partner.lastName}
              </td>
              <td>{invoice.invoice.invoiceItems.length}</td>
              <td>
                $
                {parseFloat(
                  invoice.invoice.invoiceTotal
                ).toLocaleString()}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleViewInvoice(invoice.invoice)}
                >
                  <i class="bi bi-eye-fill me-2"></i>View Invoice
                </button>
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

export default Invoices;
