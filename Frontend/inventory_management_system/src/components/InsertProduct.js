import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

export default function InsertProduct() {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productBarcode, setProductBarcode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate("");

    // Security: Sanitize input to prevent XSS
    const sanitizeInput = (input) => {
        return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
    };

    const setName = (e) => {
        const value = e.target.value;
        // Limit length and sanitize
        if (value.length <= 100) {
            setProductName(value);
        }
    };

    const setPrice = (e) => {
        const value = e.target.value;
        // Validate numeric input
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setProductPrice(value);
        }
    };

    const setBarcode = (e) => {
        const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 13);
        setProductBarcode(value);
    };

    const validateForm = () => {
        if (!productName.trim() || !productPrice || !productBarcode.trim()) {
            setError("*Please fill in all the required fields.");
            return false;
        }

        if (productName.trim().length < 2) {
            setError("*Product name must be at least 2 characters.");
            return false;
        }

        if (parseFloat(productPrice) <= 0) {
            setError("*Product price must be greater than 0.");
            return false;
        }

        if (productBarcode.length < 8 || productBarcode.length > 13) {
            setError("*Product barcode must be between 8 and 13 characters.");
            return false;
        }

        return true;
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Sanitize inputs before sending
            const sanitizedData = {
                ProductName: sanitizeInput(productName.trim()),
                ProductPrice: parseFloat(productPrice),
                ProductBarcode: sanitizeInput(productBarcode.trim())
            };

            const res = await fetch("http://localhost:3001/insertproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sanitizedData)
            });

            const data = await res.json();

            if (res.status === 201) {
                alert("Product added successfully!");
                setProductName("");
                setProductPrice("");
                setProductBarcode("");
                navigate('/products');
            }
            else if (res.status === 409) {
                setError(data.message || "Product with this barcode already exists.");
            }
            else if (res.status === 400) {
                // Handle validation errors
                const errorMessages = data.errors?.map(err => err.message).join(', ') || data.message;
                setError(errorMessages);
            }
            else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please check your connection and try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container-fluid p-5'>
             <h1 className=''>Enter Product Information</h1>
             
            <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_name" className="form-label fw-bold">Product Name</label>
                <input 
                    type="text" 
                    onChange={setName} 
                    value={productName} 
                    className="form-control fs-5" 
                    id="product_name" 
                    placeholder="Enter Product Name" 
                    maxLength={100}
                    required 
                />
            </div>
            <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_price" className="form-label fw-bold">Product Price</label>
                <input 
                    type="text" 
                    onChange={setPrice} 
                    value={productPrice} 
                    className="form-control fs-5" 
                    id="product_price" 
                    placeholder="Enter Product Price" 
                    required 
                />
            </div>
            <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode (8-13 characters)</label>
                <input 
                    type="text" 
                    onChange={setBarcode} 
                    value={productBarcode} 
                    maxLength={13} 
                    className="form-control fs-5" 
                    id="product_barcode" 
                    placeholder="Enter Product Barcode" 
                    required 
                />
            </div>
            <div className='d-flex justify-content-center col-lg-6 col-md-6'>
                <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                <button type="submit" onClick={addProduct} className="btn btn-primary fs-4" disabled={loading}>
                    {loading ? 'Inserting...' : 'Insert'}
                </button>
            </div>
            <div className="col text-center col-lg-6">
                {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
            </div>
        </div>
    );
}
