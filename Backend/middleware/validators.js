const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Product validation rules
const productValidationRules = () => {
    return [
        body('ProductName')
            .trim()
            .notEmpty().withMessage('Product name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters')
            .matches(/^[a-zA-Z0-9\s\-_.,()&]+$/).withMessage('Product name contains invalid characters')
            .escape(), // Sanitize to prevent XSS
        
        body('ProductPrice')
            .notEmpty().withMessage('Product price is required')
            .isFloat({ min: 0, max: 999999999 }).withMessage('Product price must be a positive number')
            .toFloat()
            .custom((value) => {
                // Check for max 2 decimal places
                if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
                    throw new Error('Product price can have maximum 2 decimal places');
                }
                return true;
            }),
        
        body('ProductBarcode')
            .trim()
            .notEmpty().withMessage('Product barcode is required')
            .isLength({ min: 8, max: 13 }).withMessage('Product barcode must be between 8 and 13 characters')
            .matches(/^[A-Za-z0-9]+$/).withMessage('Product barcode must be alphanumeric')
            .escape()
    ];
};

// MongoDB ObjectId validation
const idValidationRules = () => {
    return [
        param('id')
            .trim()
            .notEmpty().withMessage('Product ID is required')
            .isMongoId().withMessage('Invalid product ID format')
    ];
};

module.exports = {
    validate,
    productValidationRules,
    idValidationRules
};
