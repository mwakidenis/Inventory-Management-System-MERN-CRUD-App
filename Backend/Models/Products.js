const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        ProductName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: [2, 'Product name must be at least 2 characters'],
            maxlength: [100, 'Product name cannot exceed 100 characters'],
            // Security: Prevent script injection in product names
            validate: {
                validator: function(v) {
                    // Disallow HTML tags and script content
                    return !/[<>]/.test(v);
                },
                message: 'Product name cannot contain HTML tags'
            }
        },
        ProductPrice: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price cannot be negative'],
            max: [999999999, 'Product price is too large'],
            validate: {
                validator: function(v) {
                    // Ensure it's a valid number with max 2 decimal places
                    return /^\d+(\.\d{1,2})?$/.test(v.toString());
                },
                message: 'Product price must be a valid number with max 2 decimal places'
            }
        },
        ProductBarcode: {
            type: String,
            required: [true, 'Product barcode is required'],
            unique: true,
            trim: true,
            validate: {
                validator: function(v) {
                    // Validate barcode format (alphanumeric, 8-13 characters)
                    return /^[A-Za-z0-9]{8,13}$/.test(v);
                },
                message: 'Product barcode must be 8-13 alphanumeric characters'
            }
        },
    },
    {
        timestamps: true, // Add createdAt and updatedAt fields
    }
);

// Security: Add index for better query performance and prevent timing attacks
ProductSchema.index({ ProductBarcode: 1 });

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
