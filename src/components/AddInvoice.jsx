import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import Alert from "./Alert";

const AddInvoice = ({ invoiceType }) => {
  const initialState = {
    type: invoiceType,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    invoiceNo: "",
    partnerId: "",
    creditTerm: 0,
    reference: "",
    invoiceTotal: 0,
    invoiceItems: [],
  };

  const [invoiceData, setInvoiceData] = useState(initialState);

  let { dueDate, invoiceNo, partnerId, creditTerm, reference, invoiceItems } =
    invoiceData;

    const navigate = useNavigate();

    // State variables to manage the alert
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    
    const [partners, setPartners] = useState([]);
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [invoiceNumberResponse, partnersResponse, productsResponse] =
            await Promise.all([
              axios.get(`/invoices?type=${invoiceType}`),
              axios.get(
                `/partners?type=${
                  invoiceType === "sales" ? "customer" : "vendor"
                }&status=Active`
              ),
              axios.get(`/products?status=Active`),
            ]);
    
          // Handle the response for invoice numbers
          if (invoiceNumberResponse.status === 200) {
            const totalInvoices = invoiceNumberResponse.data.length;
            const nextInvoiceNumber = `${
              invoiceType === "sales" ? "SI" : "PI"
            }-${String(totalInvoices + 1).padStart(4, "0")}`;
            setInvoiceData((prevData) => ({
              ...prevData,
              invoiceNo: nextInvoiceNumber,
            }));
          } else {
            setAlertType("danger");
            setAlertMessage(`Failed to generate Invoice No.`);
          }
    
          // Handle the response for partners
          if (partnersResponse.status === 200) {
            setPartners(partnersResponse.data);
          } else {
            setAlertType("danger");
            setAlertMessage(
              `${invoiceType === "sales" ? "Customers" : "Vendors"} not found.`
            );
          }
    
          // Handle the response for products
          if (productsResponse.status === 200) {
            setProducts(productsResponse.data);
          } else {
            setAlertType("danger");
            setAlertMessage(
              `Failed to retrieve products: ${productsResponse.status} ${productsResponse.statusText}`
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
    }, [invoiceType]);
    
    const [page, setPage] = useState(1);
    
    // Define local state variables for productId and quantity
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(0);
    
    const addProduct = () => {
      if (productId && quantity) {
        // Find the selected product by its name in the products array
        const selectedProduct = products.find(
          (product) => product._id === productId
        );
    
        if (selectedProduct) {
          const valueOfSupplies = quantity * selectedProduct.rate;
          const salesTax = (valueOfSupplies * selectedProduct.salesTax) / 100;
          const netAmount = valueOfSupplies + salesTax;
    
          const newItem = {
            productName: selectedProduct.name,
            quantity,
            rate: selectedProduct.rate,
            valueOfSupplies: valueOfSupplies.toString(),
            salesTax: salesTax.toString(),
            netAmount: netAmount.toString(),
          };
    
          // Update invoiceData.items with the new item
          setInvoiceData((prevData) => ({
            ...prevData,
            invoiceTotal: prevData.invoiceTotal + netAmount,
            invoiceItems: [...prevData.invoiceItems, newItem],
          }));
    
          // Reset productId and quantity
          setProductId("");
          setQuantity(0);
        } else {
          // Handle the case when the selected product is not found
          alert("Selected product not found.");
        }
      }
    };
    
    const handleRemoveInvoiceItem = (itemToRemove) => {
      // Filter out the item to be removed
      const updatedInvoiceItems = invoiceItems.filter(
        (item) => item !== itemToRemove
      );
    
      // Calculate the new invoiceTotal by summing up the netAmount of the remaining items
      const newInvoiceTotal = updatedInvoiceItems.reduce(
        (total, item) => total + parseFloat(item.netAmount),
        0
      );
    
      // Update the state with the filtered invoiceItems and new invoiceTotal
      setInvoiceData((prevData) => ({
        ...prevData,
        invoiceTotal: newInvoiceTotal,
        invoiceItems: updatedInvoiceItems,
      }));
    };
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setInvoiceData((prevData) => ({ ...prevData, [name]: value }));
    };
    
    const addDaysToDate = (daysToAdd) => {
      // Create a new Date object representing the current date
      const currentDate = new Date();
    
      const invoiceDate = currentDate.toISOString().split("T")[0];
    
      // Calculate the new date by adding days
      const newDate = new Date(
        currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );
    
      const dueDate = newDate.toISOString().split("T")[0];
    
      // Return an object or an array with both dates
      return { invoiceDate, dueDate };
    };
    
    const handleCreditTermChange = (e) => {
      const newCreditTerm =
        e.target.value === "" ? null : parseInt(e.target.value);
      const { invoiceDate, dueDate } = addDaysToDate(newCreditTerm || 0);
      setInvoiceData((prevData) => ({
        ...prevData,
        creditTerm: newCreditTerm,
        invoiceDate,
        dueDate,
      }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const response = await axios.post("/invoices", invoiceData);
        if (response.status === 201) {
          setAlertType("success");
          setAlertMessage(response.data);
          setInvoiceData(initialState);
          setPage(1);
        } else {
          setAlertType("danger");
          setAlertMessage(
            `Failed to add ${invoiceType} invoice: ${response.status} ${response.statusText}`
          );
        }
      } catch (error) {
        setAlertType("danger");
        setAlertMessage(`Failed to add ${invoiceType} invoice: ${error.message}`);
      }
    };
    
    const handleCancel = () => {
      // Redirect to the sales/purchase invoices page on cancel
      navigate(`/${invoiceType}invoices`);
    };
    
    const handleNavigation = () => {
      if (page === 1) {
        setPage(2);
      } else {
        setPage(1);
      }
    };
    
    const progressBarWidth = (page === 1 ? 50 : 100) + "%";
  
  return (
    <div>
      <NavBar />
      <div className="container mt-4">
      {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>
      Create {invoiceType === "sales" ? "Sales" : "Purchase"} Invoice
    </h2>
    <div
      className="progress mt-4 mb-4"
      role="progressbar"
      aria-label="Animated striped example"
      aria-valuenow={page === 1 ? 50 : 100}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        style={{ width: progressBarWidth }}
      >
        {page === 1 ? "Step 1" : "Step 2"}
      </div>
    </div>
    <form onSubmit={handleSubmit} className="mt-4">
      {page === 1 && (
        <>
          <h3>Add Invoice Details</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="invoiceNo" className="form-label">
                  Invoice No.
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="invoiceNo"
                  name="invoiceNo"
                  value={invoiceNo}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="partnerId" className="form-label">
                  {invoiceType === "sales" ? "Customer" : "Vendor"} Name
                </label>
                <select
                  className="form-select"
                  id="partnerId"
                  name="partnerId"
                  value={partnerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select{" "}
                    {invoiceType === "sales" ? "Customer" : "Vendor"}
                  </option>
                  {partners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.firstName} {partner.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="reference" className="form-label">
                  Reference
                </label>
                <textarea
                  className="form-control"
                  id="reference"
                  name="reference"
                  value={reference}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">
                  Due Date
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="dueDate"
                  name="dueDate"
                  value={dueDate}
                  onChange={handleChange}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label htmlFor="creditTerm" className="form-label">
                  Credit Term
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="creditTerm"
                  name="creditTerm"
                  value={creditTerm}
                  onChange={handleCreditTermChange}
                  required
                />
              </div>
            </div>
          </div>
        </>
      )}
      {page === 2 && (
        <>
          <h3>Add Invoice Items</h3>
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="productId" className="form-label">
                  Product Name
                </label>
                <select
                  className="form-select"
                  id="productId"
                  name="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                onClick={addProduct}
                className="btn btn-outline-success mt-3"
              >
                <i className="bi bi-save me-2"></i>Add Item
              </button>
            </div>
          </div>
          <div className="row mt-4 mb-4">
            <div className="col-md-12">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Value of Supplies</th>
                    <th>Sales Tax</th>
                    <th>Net Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.rate}</td>
                      <td>{item.valueOfSupplies}</td>
                      <td>{item.salesTax}</td>
                      <td>{item.netAmount}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger me-2"
                          onClick={() => handleRemoveInvoiceItem(item)}
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <div className="row">
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={handleNavigation}
          >
            {page === 1 ? (
              <>
                <i className="bi bi-arrow-right-square me-2"></i>Next
              </>
            ) : (
              <>
                <i className="bi bi-arrow-left-square me-2"></i>Back
              </>
            )}
          </button>

          {page === 2 && (
            <>
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
            </>
          )}
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

export default AddInvoice;
