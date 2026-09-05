import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiRequest } from "../api";

export default function Products() {
  const currentUser = JSON.parse(localStorage.getItem("tib_user") || "null");
  useEffect(() => {
    getProducts();
  }, []);

  const [productData, setProductData] = useState([]);

  const getProducts = async () => {
    try {
      setProductData(await apiRequest("/products"));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiRequest(`/deleteproduct/${id}`, { method: "DELETE" });
      getProducts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="inventory-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Operations · TiB</p>
          <h1>Resource inventory</h1>
          <p>Keep the tools behind the work visible and accounted for.</p>
        </div>
        <NavLink to="/insertproduct" className="button button-primary">
          + Add resource <span>↗</span>
        </NavLink>
      </div>
      <div className="inventory-card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Resource name</th>
              <th>Value</th>
              <th>Reference code</th>
              <th>Added by</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productData.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="6">
                  No resources recorded yet. Add the first one to get started.
                </td>
              </tr>
            ) : (
              productData.map((element, id) => (
                <tr key={element._id}>
                  <td>{String(id + 1).padStart(2, "0")}</td>
                  <td>
                    <strong>{element.ProductName}</strong>
                  </td>
                  <td>{element.ProductPrice}</td>
                  <td>{element.ProductBarcode}</td>
                  <td>
                    <strong>{element.owner?.name || "Unknown"}</strong>
                    <span className="role-inline">
                      {element.owner?.role || "Staff"}
                      {element.owner?._id === currentUser?.id ? " · you" : ""}
                    </span>
                  </td>
                  <td>
                    {element.owner?._id === currentUser?.id ? (
                      <div className="table-actions">
                        <NavLink
                          aria-label={`Edit ${element.ProductName}`}
                          to={`/updateproduct/${element._id}`}
                          className="icon-button edit-button"
                        >
                          ✎
                        </NavLink>
                        <button
                          aria-label={`Delete ${element.ProductName}`}
                          className="icon-button delete-button"
                          onClick={() => deleteProduct(element._id)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="read-only-label">View only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
