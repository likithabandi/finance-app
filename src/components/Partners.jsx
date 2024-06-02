import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Partners = ({ partnerType }) => {
  const [partners, setPartners] = useState([]);

  const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(true); // Add a loading state

// State variables to manage the alert
const [alertType, setAlertType] = useState(null);
const [alertMessage, setAlertMessage] = useState("");

useEffect(() => {
  // Fetch all partners
  const fetchPartners = async () => {
    try {
      const response = await axios.get(`/partners?type=${partnerType}`);

      if (response.status === 200) {
        if (response.data.length === 0) {
          setAlertType("warning");
          setAlertMessage(`No ${partnerType}s found.`);
        } else {
          setPartners(response.data);
        }
      } else {
        setAlertType("danger");
        setAlertMessage(
          `Failed to retrieve ${partnerType}s: ${response.status} ${response.statusText}`
        );
      }

      setIsLoading(false);
    } catch (error) {
      setAlertType("danger");
      setAlertMessage(`Failed to retrieve ${partnerType}s: ${error.message}`);
      setIsLoading(false); // Set loading state to false if there's an error
    }
  };

  fetchPartners();
}, [partnerType]);

const handleEditPartner = (partner) => {
  // Generate the URL for the EditPartner component with the customer/vendor data as parameter
  let editPartnerUrl = `edit?id=${partner._id}`;

  // Navigate to the EditPartner component
  navigate(editPartnerUrl);
};

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {isLoading ? (
  <Spinner />
) : (
  <>
    <h2>{partnerType === "customer" ? "Customers" : "Vendors"}</h2>
    <Link to="add" className="btn btn-outline-secondary mt-3 mb-4">
      Add {partnerType === "customer" ? "Customer" : "Vendor"}
    </Link>
    {alertMessage ? (
      <Alert type={alertType} message={alertMessage} />
    ) : (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Contact No.</th>
            <th>Status</th>
            <th>Opening Balance</th>
            <th>Rep. Name</th>
            <th>Rep. Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner._id}>
              <td>
                {partner.firstName} {partner.lastName}
              </td>
              <td>{partner.email}</td>
              <td>{partner.contactNo}</td>
              <td>{partner.status}</td>
              <td>{partner.openingBalance}</td>
              <td>{partner.repName}</td>
              <td>{partner.repContact}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => handleEditPartner(partner)}
                >
                  <i className="bi bi-pencil-square"></i>
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

export default Partners;
