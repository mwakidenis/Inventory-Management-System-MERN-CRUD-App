const express = require('express');
const router = express.Router();
const products = require('../Models/Products');
const { productValidationRules, idValidationRules, validate } = require('../middleware/validators');
const { strictRateLimiter } = require('../middleware/security');

// Security: Apply strict rate limiting to write operations
const writeRateLimit = strictRateLimiter;

// Inserting(Creating) Data
router.post("/insertproduct", 
    writeRateLimit,
    productValidationRules(), 
    validate,
    async (req, res, next) => {
        try {
            const { ProductName, ProductPrice, ProductBarcode } = req.body;

            // Check if product with same barcode already exists
            const existingProduct = await products.findOne({ ProductBarcode });

            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message: "Product with this barcode already exists."
                });
            }

            // Create new product
            const addProduct = new products({ 
                ProductName, 
                ProductPrice, 
                ProductBarcode 
            });

            await addProduct.save();
            
            res.status(201).json({
                success: true,
                message: "Product added successfully",
                data: addProduct
            });

        } catch (err) {
            next(err);
        }
    }
);

// Getting(Reading) All Data
router.get('/products', async (req, res, next) => {
    try {
        // Security: Limit the number of results and add pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters"
            });
        }

        const getProducts = await products
            .find({})
            .select('-__v') // Exclude version key
            .limit(limit)
            .skip(skip)
            .lean(); // Return plain JavaScript objects for better performance

        const total = await products.countDocuments();

        res.status(200).json({
            success: true,
            count: getProducts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: getProducts
        });

    } catch (err) {
        next(err);
    }
});

// Getting(Reading) Individual Data
router.get('/products/:id', 
    idValidationRules(), 
    validate,
    async (req, res, next) => {
        try {
            const getProduct = await products
                .findById(req.params.id)
                .select('-__v')
                .lean();

            if (!getProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                data: getProduct
            });

        } catch (err) {
            next(err);
        }
    }
);

// Editing(Updating) Data
router.put('/updateproduct/:id', 
    writeRateLimit,
    idValidationRules(),
    productValidationRules(), 
    validate,
    async (req, res, next) => {
        try {
            const { ProductName, ProductPrice, ProductBarcode } = req.body;

            // Check if another product has the same barcode
            const existingProduct = await products.findOne({ 
                ProductBarcode,
                _id: { $ne: req.params.id }
            });

            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message: "Another product with this barcode already exists."
                });
            }

            const updateProducts = await products.findByIdAndUpdate(
                req.params.id, 
                { ProductName, ProductPrice, ProductBarcode }, 
                { 
                    new: true, 
                    runValidators: true // Run schema validators on update
                }
            ).select('-__v');

            if (!updateProducts) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: updateProducts
            });

        } catch (err) {
            next(err);
        }
    }
);

// Deleting Data
router.delete('/deleteproduct/:id', 
    writeRateLimit,
    idValidationRules(), 
    validate,
    async (req, res, next) => {
        try {
            const deleteProduct = await products.findByIdAndDelete(req.params.id);

            if (!deleteProduct) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                data: deleteProduct
            });

        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;