import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

export default function UpdateProduct() {
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

  const { id } = useParams("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await apiRequest(`/products/${id}`);
        setProductName(data.ProductName);
        setProductPrice(data.ProductPrice);
        setProductBarcode(data.ProductBarcode);
      } catch (err) {
        console.log(err);
      }
    };

    getProduct();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productBarcode) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiRequest(`/updateproduct/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ProductName: productName,
          ProductPrice: productPrice,
          ProductBarcode: productBarcode,
        }),
      });
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
      <p className="eyebrow">Operations · Edit entry</p>
      <h1>Update resource</h1>
      <form className="resource-form" onSubmit={updateProduct}>
        <div className="field">
          <label htmlFor="product_name">Resource name</label>
          <input
            type="text"
            onChange={setName}
            value={productName}
            id="product_name"
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
            {loading ? "Updating..." : "Update resource"} <span>↗</span>
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </main>
  );
}
