import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const EditPartner = ({ partnerType }) => {
  const initialState = {
    type: partnerType,
    firstName: "",
    lastName: "",
    email: "",
    status: "",
    contactNo: "",
    openingBalance: 0,
    address: "",
    repName: "",
    repContact: "",
    repDesignation: "",
  };

  const [partnerData, setPartnerData] = useState(initialState);

  const {
    firstName,
    lastName,
    email,
    status,
    contactNo,
    openingBalance,
    address,
    repName,
    repContact,
    repDesignation,
  } = partnerData;

  const location = useLocation();
const navigate = useNavigate();

const [isLoading, setIsLoading] = useState(true); // Add a loading state

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  const fetchPartner = async () => {
    try {
      // Get the partner ID from URL parameters
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("id");

      // Fetch partner data using the partner ID
      const response = await axios.get(`/partners?id=${id}`);

      if (response.status === 200) {
        // If successful, update the partner state with the response data
        setPartnerData(response.data);
      } else if (response.status === 404) {
        // Handle a 404 Not Found response
        setAlertType("danger");
        setAlertMessage(
          `${partnerType === "customer" ? "Customers" : "Vendors"} not found.`
        );
      } else {
        // Handle other error responses
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve ${partnerType}: ${response.status} ${response.statusText}`
        );
      }
      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(`Failed to retrieve ${partnerType}: ${error.message}`);
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  fetchPartner();
}, [location.search, partnerType]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setPartnerData((prevData) => ({ ...prevData, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.put(
      `/partners/${partnerData._id}`,
      partnerData
    );

    if (response.status === 200) {
      // Redirect to the customers/vendors page after successful update
      navigate(`/${partnerType}s`);
    } else if (response.status === 404) {
      setAlertType("danger");
      setAlertMessage(
        partnerType === "customer"
          ? "Customer not found."
          : "Vendor not found."
      );
    } else {
      setAlertType("danger");
      setAlertMessage(
        `Failed to update ${partnerType}: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    setAlertType("danger");
    setAlertMessage(`Failed to update ${partnerType}: ${error.message}`);
  }
};

const handleCancel = () => {
  // Redirect to the customers/vendors page on cancel
  navigate(`/${partnerType}s`);
};

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>Edit {partnerType === "customer" ? "Customer" : "Vendor"}</h2>
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={address}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNo" className="form-label">
              Contact No.
            </label>
            <input
              type="text"
              className="form-control"
              id="contactNo"
              name="contactNo"
              value={contactNo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="openingBalance" className="form-label">
              Opening Balance
            </label>
            <input
              type="number"
              className="form-control"
              id="openingBalance"
              name="openingBalance"
              value={openingBalance}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      <h3>Representative Information</h3>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="repName" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="repName"
              name="repName"
              value={repName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repContact" className="form-label">
              Contact No.
            </label>
            <input
              type="text"
              className="form-control"
              id="repContact"
              name="repContact"
              value={repContact}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="repDesignation" className="form-label">
              Designation
            </label>
            <input
              type="text"
              className="form-control"
              id="repDesignation"
              name="repDesignation"
              value={repDesignation}
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
            <i className="bi bi-save me-2"></i>Update
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

export default EditPartner;
