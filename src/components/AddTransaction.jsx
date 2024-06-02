import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const AddTransaction = ({ transactionType }) => {
  const initialState = {
    voucherNo: "",
    type: "",
    date: new Date().toISOString().split("T")[0],
    paymentTo: "",
    receiptFrom: "",
    amount: 0,
    reference: "",
  };

  const [transactionData, setTransactionData] = useState(initialState);

  const { voucherNo, type, date, paymentTo, receiptFrom, amount, reference } =
    transactionData;

    const navigate = useNavigate();

    // State variable to track loading status
    const [isLoading, setIsLoading] = useState(true);
    
    // State variables to manage the alert
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    
    const [partners, setPartners] = useState(null);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [voucherNumberResponse, partnersResponse] = await Promise.all([
            axios.get(`/transactions?type=${transactionType}`),
            axios.get(
              `/partners?type=${
                transactionType === "payment" ? "vendor" : "customer"
              }&status=Active`
            ),
          ]);
    
          // Handle the response for invoice numbers
          if (voucherNumberResponse.status === 200) {
            const totalVouchers = voucherNumberResponse.data.length;
            const nextVoucherNumber = `${
              transactionType === "payment" ? "PMT" : "RCT"
            }-${String(totalVouchers + 1).padStart(4, "0")}`;
            setTransactionData((prevData) => ({
              ...prevData,
              voucherNo: nextVoucherNumber,
            }));
          } else {
            setAlertType("danger");
            setAlertMessage(`Failed to generate Voucher No.`);
          }
    
          // Handle the response for partners
          if (partnersResponse.status === 200) {
            setPartners(partnersResponse.data);
          } else {
            setAlertType("danger");
            setAlertMessage(
              `${
                transactionType === "payment" ? "Vendors" : "Customers"
              } not found.`
            );
          }
    
          setIsLoading(false); // Set loading to false after all requests are completed
        } catch (error) {
          setAlertType("danger");
          setAlertMessage(`Failed to fetch data: ${error.message}`);
          setIsLoading(false);
        }
      };
    
      fetchData();
    }, [transactionType]);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTransactionData((prevData) => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("/transactions", transactionData);
        if (response.status === 201) {
          setAlertType("success");
          setAlertMessage(response.data);
          setTransactionData(initialState);
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to add ${transactionType}: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to add ${transactionType}: ${error.message}`);
      }
    };
    
    const handleCancel = () => {
      // Redirect to the payments/receipts page on cancel
      navigate(`/${transactionType}s`);
    };
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>Add {transactionType === "payment" ? "Payment" : "Receipt"}</h2>
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="voucherNo" className="form-label">
              Voucher No.
            </label>
            <input
              type="text"
              className="form-control"
              id="voucherNo"
              name="voucherNo"
              value={voucherNo}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Type
            </label>
            <select
              className="form-select"
              id="type"
              name="type"
              value={type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {transactionType === "payment" ? (
                <>
                  <option value="BPV">Bank Payment Voucher</option>
                  <option value="CPV">Cash Payment Voucher</option>
                </>
              ) : (
                <>
                  <option value="BRV">Bank Receipt Voucher</option>
                  <option value="CRV">Cash Receipt Voucher</option>
                </>
              )}
            </select>
          </div>
          {transactionType === "payment" ? (
            <div className="mb-3">
              <label htmlFor="paymentTo" className="form-label">
                Payment To
              </label>
              <select
                className="form-select"
                id="paymentTo"
                name="paymentTo"
                value={paymentTo}
                onChange={handleChange}
                required
              >
                <option value="">Select Vendor</option>
                {partners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.firstName} {partner.lastName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-3">
              <label htmlFor="receiptFrom" className="form-label">
                Receipt From
              </label>
              <select
                className="form-select"
                id="receiptFrom"
                name="receiptFrom"
                value={receiptFrom}
                onChange={handleChange}
                required
              >
                <option value="">Select Customer</option>
                {partners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.firstName} {partner.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="text"
              className="form-control"
              id="date"
              name="date"
              value={date}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reference" className="form-label">
              Reference
            </label>
            <input
              type="text"
              className="form-control"
              id="reference"
              name="reference"
              value={reference}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <button
            type="submit"
            className="btn btn-outline-success me-2"
          >
            <i className="bi bi-save me-2"></i>Add
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleCancel}
          >
            <i className="bi bi-x-square me-2"></i>Cancel
          </button>
        </div>
      </div>
    </form>
    {alertMessage && <Alert type={alertType} message={alertMessage} />}
  </>
)}
      </div>
    </div>
  );
};

export default AddTransaction;
