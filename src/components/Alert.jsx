import React from "react";

const Alert = ({ type, message }) => {
  return (
    <div className={`alert alert-${type} mt-5`} role="alert">
      <div>
        <i
          className={`bi ${
            type === "success"
              ? "bi-check-circle-fill"
              : "bi-exclamation-triangle-fill"
          } m-2`}
        ></i>
        {message}
      </div>
    </div>
  );
};

export default Alert;
