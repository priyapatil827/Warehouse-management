import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";
import { base_uri } from "../../../../api/api";
import AddProductPage from "../AddProduct/AddProduct";
import ViewProduct from "../ViewProduct/ViewProduct";
import "./ProductManagement.css";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showAddPage, setShowAddPage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${base_uri}/product/getAllProducts`, {
        withCredentials: true,
      });

      const productList = res.data.products || [];
      setProducts(productList);

      // save count
      localStorage.setItem("totalProducts", productList.length);
    } catch (err) {
      console.log("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 UNIQUE CATEGORIES
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // 🔥 FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const getStatus = (stock) => {
    if (stock === 0) return "Inactive";
    if (stock < 50) return "Pending";
    if (stock < 200) return "On Sale";
    return "Active";
  };

  return (
    <div className="pm-page">
      <Navbar />

      <div className="pm-container">
        {/* HEADER BAR */}
        <div className="pm-topbar">
          <h2>Product</h2>

          <div className="pm-actions">
            <input
              className="pm-search"
              type="text"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* CATEGORY FILTER */}
            <select
              className="pm-btn ghost"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button className="pm-btn ghost">Export</button>

            <button
              className="pm-btn primary"
              onClick={() => setShowAddPage(true)}
            >
              + Add New Product
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="pm-table-wrapper">
          {loading ? (
            <p className="pm-empty">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="pm-empty">No products found ✨</p>
          ) : (
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product ID</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => {
                  const status = getStatus(p.stock);

                  return (
                    <tr key={p._id}>
                      <td className="pm-name-cell">
                        <img
                          src={
                            p.image
                              ? `${base_uri.replace(
                                  "/api",
                                  ""
                                )}/uploads/${p.image}`
                              : "https://via.placeholder.com/40"
                          }
                          alt={p.name}
                        />
                        <span>{p.name}</span>
                      </td>

                      <td>#{p._id.slice(-6)}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock} pcs</td>
                      <td>{p.category || "Other"}</td>

                      <td>
                        <span
                          className={`pm-status ${status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="pm-action-btn"
                          onClick={() => setSelectedProduct(p)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddPage && (
        <AddProductPage
          onClose={() => setShowAddPage(false)}
          onSuccess={fetchProducts}
        />
      )}

      {/* VIEW PRODUCT MODAL */}
      {selectedProduct && (
        <ViewProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}
