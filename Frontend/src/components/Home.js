import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { apiRequest } from "../api";
export default function Home() {
  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    apiRequest("/products")
      .then((products) =>
        setProductCount(Array.isArray(products) ? products.length : 0),
      )
      .catch(() => setProductCount(0));
  }, []);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Tomorrow is Better · Operations</p>
          <h1>
            Resource
            <br />
            <em>inventory</em> dashboard.
          </h1>
          <p className="dashboard-lede">
            A simple place to track the resources that keep the team moving.
          </p>
          <NavLink className="button button-primary" to="/insertproduct">
            Add a resource <span>+</span>
          </NavLink>
        </div>
        <div className="dashboard-illustration" aria-hidden="true">
          <span className="illustration-ring"></span>
          <span className="illustration-label">
            TiB
            <br />
            <small>INVENTORY</small>
          </span>
        </div>
      </section>
      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Everything in one place.</h2>
          </div>
          <NavLink className="text-link" to="/products">
            View all inventory <span>→</span>
          </NavLink>
        </div>
        <div className="dashboard-grid">
          <article className="summary-card summary-card-primary">
            <span className="card-number">
              {productCount === null ? "--" : productCount}
            </span>
            <span className="card-label">Resources tracked</span>
            <NavLink to="/products">
              Open inventory <span>↗</span>
            </NavLink>
          </article>
          <article className="summary-card">
            <span className="card-icon">+</span>
            <h3>Add a new resource</h3>
            <p>Record equipment, supplies, or materials for the team.</p>
            <NavLink to="/insertproduct" className="text-link">
              Create entry <span>→</span>
            </NavLink>
          </article>
          <article className="summary-card summary-card-note">
            <span className="section-kicker">Quick note</span>
            <p>
              Keep reference codes accurate so every resource can be found when
              it is needed.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
