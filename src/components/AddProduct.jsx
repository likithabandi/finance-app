import React, { useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

const AddProduct = () => {
  const initialState = {
    name: "",
    coreCompany: "",
    rate: 0,
    status: "",
    taxExempted: "",
    salesTax: 0,
    notes: "",
  };

  const [productData, setProductData] = useState(initialState);

  const { name, coreCompany, rate, status, taxExempted, salesTax, notes } =
    productData;

  //  JavaScript code 
  const navigate = useNavigate();

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;

  // Check if taxExempted is being changed and set salestax to 0 if necessary
  if (name === "taxExempted" && value === "Yes") {
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
      salesTax: 0, // Set salesTax to 0 when taxExempted is set to "Yes"
    }));
  } else {
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("/products", productData);
    if (response.status === 201) {
      setAlertType("success");
      setAlertMessage(response.data);
      setProductData(initialState);
    } else {
      setAlertType("danger");
      setAlertMessage(
        `Failed to add product: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    setAlertType("danger");
    setAlertMessage(`Failed to add product: ${error.message}`);
  }
};

const handleCancel = () => {
  // Redirect to the products page on cancel
  navigate("/products");
};

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="mt-4">
  <div className="row">
    <div className="col-md-6">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rate" className="form-label">
          Rate
        </label>
        <input
          type="number"
          className="form-control"
          id="rate"
          name="rate"
          value={rate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="taxExempted" className="form-label">
          Tax Exempted
        </label>
        <select
          className="form-select"
          id="taxExempted"
          name="taxExempted"
          value={taxExempted}
          onChange={handleChange}
          required
        >
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          className="form-control"
          id="notes"
          name="notes"
          value={notes}
          onChange={handleChange}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label htmlFor="coreCompany" className="form-label">
          Core Company
        </label>
        <input
          type="text"
          className="form-control"
          id="coreCompany"
          name="coreCompany"
          value={coreCompany}
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
      {taxExempted === "No" && (
        <div className="mb-3">
          <label htmlFor="salesTax" className="form-label">
            Sales Tax (%)
          </label>
          <input
            type="number"
            className="form-control"
            id="salesTax"
            name="salesTax"
            value={salesTax}
            onChange={handleChange}
            required
          />
        </div>
      )}
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <button type="submit" className="btn btn-outline-success me-2">
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
      </div>
    </div>
  );
};

export default AddProduct;
