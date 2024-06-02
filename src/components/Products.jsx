import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import Alert from "./Alert";

const Products = () => {
  const [products, setProducts] = useState([]);

  // TODO: Write your JavaScript code here

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {/* TODO: Write your JSX code here */}
      </div>
    </div>
  );
};

export default Products;
