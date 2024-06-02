import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const EditProduct = () => {
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

    const location = useLocation();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    
    // State variables to manage the alert
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          // Get the product ID from URL parameters
          const queryParams = new URLSearchParams(location.search);
          const id = queryParams.get("id");
    
          // Fetch product data using the product ID
          const response = await axios.get(`/products?id=${id}`);
    
          if (response.status === 200) {
            // If successful, update the product state with the response data
            setProductData(response.data);
          } else if (response.status === 404) {
            // Handle a 404 Not Found response
            setAlertType("danger");
            setAlertMessage("Product not found.");
          } else {
            // Handle other error responses
            setAlertType("danger");
            setAlertMessage(
              `Failed to retrieve product: ${response.status} ${response.statusText}`
            );
          }
          setIsLoading(false);
        } catch (error) {
          setAlertType("danger");
          setAlertMessage(`Failed to retrieve product: ${error.message}`);
          setIsLoading(false); // Set loading state to false if there's an error
        }
      };
    
      fetchProduct();
    }, [location.search]);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
    
      // Convert numeric fields to numbers
      const numericValue =
        name === "rate" || name === "salesTax" ? parseFloat(value) : value;
    
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
          [name]: numericValue,
        }));
      }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.put(
          `/products/${productData._id}`,
          productData
        );
    
        if (response.status === 200) {
          // Redirect to the products page after successful update
          navigate("/products");
        } else if (response.status === 404) {
          setAlertType("danger");
          setAlertMessage("Product not found.");
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to update product: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to update product: ${error.message}`);
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
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>Edit Product</h2>
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

export default EditProduct;
