import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LedgerReport from "./LedgerReport";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Ledger = () => {
  const initialState = {
    partnerId: "",
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState(initialState);

  const { partnerId, startDate, endDate } = formData;

  //  JavaScript code 
  const navigate = useNavigate();
const [showReport, setShowReport] = useState(false);

// State variable to track loading status
const [isLoading, setIsLoading] = useState(true);

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

const [ledgerItems, setLedgerItems] = useState(null);
const [partner, setPartner] = useState(null);

const [partners, setPartners] = useState(null);

useEffect(() => {
  const fetchPartners = async () => {
    try {
      // Fetch the partner data
      const response = await axios.get(`/partners`);

      if (response.status === 200) {
        // If successful, update the partner’s state with the response data
        setPartners(response.data);
      } else if (response.status === 404) {
        // Handle a 404 Not Found response
        setAlertType("danger");
        setAlertMessage("Partners not found.");
      } else {
        // Handle other error responses
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve partners: ${response.status} ${response.statusText}`
        );
      }
      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(`Failed to retrieve partners: ${error.message}`);
      setIsLoading(false);
    }
  };

  fetchPartners();
}, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Set isLoading to true when the data fetching starts
  setIsLoading(true);

  try {
    const response = await axios.get(
      `/ledger?partnerId=${formData.partnerId}&startDate=${formData.startDate}&endDate=${formData.endDate}`
    );

    if (response.status === 200) {
      // If successful, update the partner and invoices states with the response data
      setPartner(response.data.partner);
      setLedgerItems(response.data.ledgerItems);
    } else if (response.status === 404) {
      // Handle a 404 Not Found response
      setAlertType("danger");
      setAlertMessage("Invoice not found.");
    } else {
      // Handle other error responses
      setAlertType("danger");
      setAlertMessage(
        `Failed to retrieve invoice: ${response.status} ${response.statusText}`
      );
    }
    // After processing the form, set showReport to true
    setShowReport(true);
    // After processing the form and updating the state, set isLoading to false
    setIsLoading(false);
  } catch (error) {
    setAlertType("danger");
    setAlertMessage(`Failed to retrieve invoice: ${error.message}`);
    setIsLoading(false); // Set loading state to false if there's an error
  }
};

const handleCancel = () => {
  // Redirect to the home page on cancel
  navigate("/");
};

  //  JSX code 
  return isLoading ? (
    <Spinner />
  ) : showReport ? (
    <LedgerReport
      partner={partner}
      ledgerItems={ledgerItems}
      startDate={formData.startDate}
      endDate={formData.endDate}
    />
  ) : (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h2>Ledger</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="mb-3">
                <label htmlFor="partnerId" className="form-label">
                  Partner
                </label>
                <select
                  className="form-select"
                  id="partnerId"
                  name="partnerId"
                  value={partnerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Partner</option>
                  {partners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.firstName} {partner.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 text-center">
                <button type="submit" className="btn btn-outline-success me-2">
                  <i className="bi bi-save me-2"></i>Generate
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
          </div>
        </form>
        {alertMessage && <Alert type={alertType} message={alertMessage} />}
      </div>
    </div>
  );

};

export default Ledger;
