import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import DOMPurify from 'dompurify';

export default function Products() {

    useEffect(() => {
        getProducts();
    }, [])

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Security: Sanitize output to prevent XSS
    const sanitizeOutput = (text) => {
        return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
    };

    const getProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:3001/products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const response = await res.json();

            if (res.status === 200 && response.success) {
                console.log("Data Retrieved.");
                setProductData(response.data || []);
            }
            else {
                setError(response.message || "Failed to retrieve products.");
            }
        } catch (err) {
            setError("An error occurred while fetching products.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        // Security: Confirm before deletion
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/deleteproduct/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const deletedata = await response.json();

            if (response.status === 200 && deletedata.success) {
                console.log("Product deleted");
                alert("Product deleted successfully!");
                getProducts();
            } else {
                alert(deletedata.message || "Failed to delete product.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the product.");
        }
    };

    return (
        <>
            <div className='container-fluid p-5'>
                <h1>Products Inventory</h1>
                <div className='add_button'>
                    <NavLink to="/insertproduct" className='btn btn-primary fs-5'> + Add New Product</NavLink>
                </div>

                {loading && <div className="text-center mt-3 fs-5">Loading products...</div>}
                {error && <div className="text-danger text-center mt-3 fs-5">{error}</div>}

                <div className="overflow-auto mt-3" style={{ maxHeight: "38rem" }}>
                    <table className="table table-striped table-hover mt-3 fs-5">
                        <thead>
                            <tr className="tr_color">
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Price</th>
                                <th scope="col">Product Barcode</th>
                                <th scope="col">Update</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="text-center">No products found</td>
                                </tr>
                            )}
                            {
                                productData.map((element, id) => {
                                    return (
                                        <tr key={element._id}>
                                            <th scope="row">{id + 1}</th>
                                            <td>{sanitizeOutput(element.ProductName)}</td>
                                            <td>${parseFloat(element.ProductPrice).toFixed(2)}</td>
                                            <td>{sanitizeOutput(element.ProductBarcode)}</td>
                                            <td>
                                                <NavLink to={`/updateproduct/${element._id}`} className="btn btn-primary">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </NavLink>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => deleteProduct(element._id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
