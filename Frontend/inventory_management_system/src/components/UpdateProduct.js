import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

export default function UpdateProduct() {
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
        if (value.length <= 100) {
            setProductName(value);
        }
    };
    
    const setPrice = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setProductPrice(value);
        }
    };
    
    const setBarcode = (e) => {
        const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 13);
        setProductBarcode(value);
    };

    const {id} = useParams("");

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3001/products/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                const response = await res.json();
        
                if (res.status === 200 && response.success) {
                    console.log("Data Retrieved.");
                    setProductName(response.data.ProductName);
                    setProductPrice(response.data.ProductPrice.toString());
                    setProductBarcode(response.data.ProductBarcode);
                } else {
                    setError(response.message || "Failed to retrieve product.");
                }
            } catch (err) {
                setError("An error occurred while fetching product data.");
                console.error(err);
            }
        };
      
        getProduct();
    }, [id]);

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

    const updateProduct = async (e) => {
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

            const response = await fetch(`http://localhost:3001/updateproduct/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sanitizedData)
            });

            const data = await response.json();

            if (response.status === 200 && data.success) {
                alert("Product updated successfully!");
                navigate('/products');
            }
            else if (response.status === 409) {
                setError(data.message || "Another product with this barcode already exists.");
            }
            else if (response.status === 400) {
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
            <h1 className=''>Update Product Information</h1>
            <div className="mt-5 col-lg-6 col-md-6 col-12">
                <label htmlFor="product_name" className="form-label fs-4 fw-bold">Product Name</label>
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
            <div className="mt-3 col-lg-6 col-md-6 col-12">
                <label htmlFor="product_price" className="form-label fs-4 fw-bold">Product Price</label>
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
            <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12">
                <label htmlFor="product_barcode" className="form-label fs-4 fw-bold">Product Barcode (8-13 characters)</label>
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
                <button type="submit" onClick={updateProduct} className="btn btn-primary fs-4" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </div>
            <div className="col text-center col-lg-6 ">
                {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
            </div>
        </div>
    );
}
