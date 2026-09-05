import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function InsertProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState();
  const [productBarcode, setProductBarcode] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate("");

  const setName = (e) => {
    setProductName(e.target.value);
  };

  const setPrice = (e) => {
    setProductPrice(e.target.value);
  };

  const setBarcode = (e) => {
    const value = e.target.value.slice(0, 12);
    setProductBarcode(value);
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiRequest("/insertproduct", {
        method: "POST",
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode,
        }),
      });
      setProductName("");
      setProductPrice(0);
      setProductBarcode(0);
      navigate("/products");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <p className="eyebrow">Operations · New entry</p>
      <h1>Add a resource</h1>
      <form className="resource-form" onSubmit={addProduct}>
        <div className="field">
          <label htmlFor="product_name">Resource name</label>
          <input
            type="text"
            onChange={setName}
            value={productName}
            id="product_name"
            placeholder="e.g. School materials"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="product_price">Value</label>
          <input
            type="number"
            onChange={setPrice}
            value={productPrice || ""}
            id="product_price"
            placeholder="Enter value"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="product_barcode">Reference code</label>
          <input
            type="number"
            onChange={setBarcode}
            value={productBarcode || ""}
            maxLength={12}
            id="product_barcode"
            placeholder="Up to 12 digits"
            required
          />
        </div>
        <div className="form-actions">
          <NavLink to="/products" className="secondary-button">
            Cancel
          </NavLink>
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save resource"} <span>↗</span>
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </main>
  );
}
