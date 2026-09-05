const express = require("express");
const router = express.Router();
const products = require("../Models/Products");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

//Inserting(Creating) Data:
router.post("/insertproduct", async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode } = req.body;

  try {
    const pre = await products.findOne({
      ProductBarcode: ProductBarcode,
      owner: req.user.id,
    });
    console.log(pre);

    if (pre) {
      res.status(422).json("Product is already added.");
    } else {
      const addProduct = new products({
        ProductName,
        ProductPrice,
        ProductBarcode,
        owner: req.user.id,
      });

      await addProduct.save();
      res.status(201).json(addProduct);
      console.log(addProduct);
    }
  } catch (err) {
    console.log(err);
  }
});

//Getting(Reading) Data:
router.get("/products", async (req, res) => {
  try {
    const getProducts = await products
      .find({})
      .populate("owner", "name email role");
    console.log(getProducts);
    res.status(201).json(getProducts);
  } catch (err) {
    console.log(err);
  }
});

//Getting(Reading) individual Data:
router.get("/products/:id", async (req, res) => {
  try {
    const getProduct = await products
      .findById(req.params.id)
      .populate("owner", "name email role");
    console.log(getProduct);
    res.status(201).json(getProduct);
  } catch (err) {
    console.log(err);
  }
});

//Editing(Updating) Data:
router.put("/updateproduct/:id", async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode } = req.body;

  try {
    const updateProducts = await products.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { ProductName, ProductPrice, ProductBarcode },
      { new: true },
    );
    if (!updateProducts) {
      return res
        .status(403)
        .json({ message: "Only the creator can edit this resource." });
    }
    console.log("Data Updated");
    res.status(201).json(updateProducts);
  } catch (err) {
    console.log(err);
  }
});

//Deleting Data:
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const deleteProduct = await products.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deleteProduct) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this resource." });
    }
    console.log("Data Deleted");
    res.status(201).json(deleteProduct);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
