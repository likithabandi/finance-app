import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const InvoiceReport = ({ invoiceType }) => {
  const location = useLocation();

const [invoiceData, setInvoiceData] = useState(null);
const [partnerData, setPartnerData] = useState(null);

const [isLoading, setIsLoading] = useState(true); // Add a loading state

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  const fetchInvoice = async () => {
    try {
      // Get the invoice ID from URL parameters
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("id");

      // Fetch invoice and partner data using the invoice ID
      const response = await axios.get(`/invoices?id=${id}`);

      if (response.status === 200) {
        // If successful, update the invoice and partner states with the response data
        setInvoiceData(response.data.invoice);
        setPartnerData(response.data.partner);
      } else if (response.status === 404) {
        // Handle a 404 Not Found response
        setAlertType("danger");
        setAlertMessage(
          `${
            invoiceType === "sales" ? "Sales" : "Purchase"
          } invoice not found.`
        );
      } else {
        // Handle other error responses
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve ${invoiceType} invoice: ${response.status} ${response.statusText}`
        );
      }
      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(
        `Failed to retrieve ${invoiceType} invoice: ${error.message}`
      );
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  fetchInvoice();
}, [location.search, invoiceType]);


  return (
    <div className="container">
      <div class="card col-md-8 offset-md-2">
      {isLoading ? (
  <Spinner />
) : (
  <>
    {alertMessage ? (
      <Alert type={alertType} message={alertMessage} />
    ) : (
      <>
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
              <h1>
                {invoiceType === "sales" ? "SALES" : "PURCHASE"} INVOICE
              </h1>
            </div>
          </div>
          <div class="row align-items-start mt-3 mb-5">
            <hr className="mb-0" />
            <div className="col">
              <strong>Invoice Number:</strong> {invoiceData.invoiceNo}
              <br />
              <strong>Invoice Date:</strong> {invoiceData.invoiceDate}
              <br />
              <strong>Due Date:</strong> {invoiceData.dueDate}
            </div>
            <div className="col text-end">
              <strong>
                {invoiceType === "sales" ? "Customer" : "Vendor"} Name:
              </strong>{" "}
              {partnerData.firstName} {partnerData.lastName}
              <br />
              <strong>
                {invoiceType === "sales" ? "Customer" : "Vendor"}{" "}
                Contact:
              </strong>{" "}
              {partnerData.contactNo}
              <br />
              <strong>
                {invoiceType === "sales" ? "Customer" : "Vendor"}{" "}
                Address:
              </strong>{" "}
              {partnerData.address}
            </div>
            <hr />
          </div>
          <div class="row">
            <div class="col">
              <table class="table table-bordered text-center table-sm">
                <thead>
                  <tr>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Sr.
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Product Name
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Quantity
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Rate
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Value of Supplies
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Sales Tax
                    </th>
                    <th
                      className="bg-body-secondary bg-opacity-50"
                      scope="col"
                    >
                      Net Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.invoiceItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="text-start">{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td className="text-end">
                        ${parseFloat(item.rate).toLocaleString()}
                      </td>
                      <td className="text-end">
                        $
                        {parseFloat(
                          item.valueOfSupplies
                        ).toLocaleString()}
                      </td>
                      <td className="text-end">
                        ${parseFloat(item.salesTax).toLocaleString()}
                      </td>
                      <td className="text-end">
                        ${parseFloat(item.netAmount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td
                      colSpan={2}
                      className="text-start bg-body-secondary bg-opacity-50"
                    >
                      Total:
                    </td>
                    <td className="bg-body-secondary bg-opacity-50">
                      {invoiceData.invoiceItems
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.quantity),
                          0
                        )
                        .toLocaleString()}
                    </td>
                    <td className="text-end bg-body-secondary bg-opacity-50"></td>
                    <td className="text-end bg-body-secondary bg-opacity-50">
                      $
                      {invoiceData.invoiceItems
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.valueOfSupplies),
                          0
                        )
                        .toLocaleString()}
                    </td>
                    <td className="text-end bg-body-secondary bg-opacity-50">
                      $
                      {invoiceData.invoiceItems
                        .reduce(
                          (total, item) =>
                            total + parseFloat(item.salesTax),
                          0
                        )
                        .toLocaleString()}
                    </td>
                    <td className="text-end bg-body-secondary bg-opacity-50">
                      $
                      {parseFloat(
                        invoiceData.invoiceTotal
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
              <a href={`/${invoiceType}invoices`} class="btn btn-danger mt-3">
                Back
              </a>
            </div>
          </div>
        </div>
      </>
    )}
  </>
)}
      </div>
    </div>
  );
};

export default InvoiceReport;
