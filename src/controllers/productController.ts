import ProductModel, { IProduct } from "../models/product";
import express from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export const createProduct = [
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      const {
        name,
        description,
        price: priceStr,
        discount: discountStr,
        category: categoryStr,
        color,
        stock: stockStr,
        brand,
        sizes: sizesStr,
        ratings: ratingsStr,
      } = req.body;

      // Convert numeric fields to numbers
      const price = Number(priceStr);
      const discount = Number(discountStr || 0); // Default to 0 if not provided
      const stock = Number(stockStr);

      // Validate numeric fields
      if (isNaN(price) || isNaN(stock)) {
        return res
          .status(400)
          .json({ error: "Price and stock must be numbers" });
      }

      // Validate required fields
      if (
        !name ||
        !description ||
        !price ||
        !categoryStr ||
        !color ||
        !stock ||
        !brand ||
        !sizesStr
      ) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      // Handle image upload
      const productImage = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null;

      // Parse category (string or JSON array)
      let category: string[];
      try {
        category = Array.isArray(categoryStr)
          ? categoryStr
          : JSON.parse(categoryStr);
      } catch (error) {
        category = categoryStr.split(","); // Fallback to comma-separated
      }

      // Parse sizes (JSON array)
      let sizes: { size: string; quantity: number }[];
      try {
        sizes = JSON.parse(sizesStr);
      } catch (error) {
        return res.status(400).json({ error: "Invalid sizes format" });
      }

      // Parse ratings (optional JSON array)
      let ratings: number[] = [];
      if (ratingsStr) {
        try {
          ratings = JSON.parse(ratingsStr);
        } catch (error) {
          return res.status(400).json({ error: "Invalid ratings format" });
        }
      }

      // Create product
      const newProduct = new ProductModel({
        name,
        description,
        price,
        discount,
        category,
        image: productImage,
        color,
        stock,
        brand,
        sizes,
        ratings,
      });

      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
];

export const getProducts = async (req: any, res: any) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = [
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      const productId = req.params.id;

      const product = await ProductModel.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found." });

      const {
        name,
        description,
        price,
        discount,
        category,
        color,
        stock,
        brand,
        sizes,
        ratings,
      } = req.body;

      const productImage = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : product.image;

      const parsedCategory = category ? category.split(",") : product.category;
      const parsedSizes = sizes ? JSON.parse(sizes) : product.sizes;
      const parsedRatings = ratings ? JSON.parse(ratings) : product.ratings;

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        {
          name,
          description,
          price,
          discount,
          category: parsedCategory,
          image: productImage,
          color,
          stock,
          brand,
          sizes: parsedSizes,
          ratings: parsedRatings,
        },
        { new: true }
      );

      res.status(200).json(updatedProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
];

export const deleteProduct = async (req: any, res: any) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await ProductModel.distinct("category");
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getColors = async (req: any, res: any) => {
  try {
    const colors = await ProductModel.distinct("color");
    res.status(200).json(colors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBrands = async (req: any, res: any) => {
  try {
    const brands = await ProductModel.distinct("brand");
    res.status(200).json(brands);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFilteredProducts = async (req: any, res: any) => {
  try {
    const { category, color, brand, limit, page } = req.query;

    const filters: any = {};
    if (category) filters.category = category;
    if (color) filters.color = color;
    if (brand) filters.brand = brand;

    const parsedLimit = parseInt(limit as string, 10) || 10;
    const parsedPage = parseInt(page as string, 10) || 1;

    const skip = (parsedPage - 1) * parsedLimit;

    const products = await ProductModel.find(filters)
      .skip(skip)
      .limit(parsedLimit);

    const total = await ProductModel.countDocuments(filters);

    res.status(200).json({
      products,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
    });
  } catch (error: any) {
    console.error("Error fetching filtered products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
