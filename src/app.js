import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();

const PORT = 4000;

app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager("./info.txt");

app.listen(PORT, () => {
  console.log(` Server on port ${PORT}`);
});

app.get("/product", async (req, res) => {
  const limit = req.query.limit;

  try {
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.send(limitedProducts);
    } else {
      res.send(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/product/:id", async (req, res) => {
  const product = await productManager.getProductById(req.params.id);

  if (!product) {
    res.status(404).send("Product not found");
    return;
  }

  res.send(product);
});
