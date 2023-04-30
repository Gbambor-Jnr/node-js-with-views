const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user
    .getProducts() //here we want to get ALL THE PRODUCTS in the table and we have this setup because user and Products are associated with the hasMany etc
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  // Product.findByPk(prodId)
  req.user
    .getProducts({ where: { id: prodId } }) //getProduct is a normal sequilize method like findAll Method and is only working beacuse we used hasMany/belongsTo.Also wheever we use the where in sequelize we return an array
    .then((products) => {
      let product = products[0];
      res.render("admin/edit-product", {
        //render edit-product in both here and getAddProduct
        pageTitle: "Edit Products",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescr = req.body.description;
  const updatedPrice = req.body.price;

  Product.findByPk(prodId) //this one is fine becuas ewe assume when we are here there is a product for that user
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.imageUrl = updatedImageUrl),
        (product.description = updatedDescr);
      return product.save();
    })
    .then((result) => {
      //this particular then block runs afterthe first then was successful
      console.log("UPDASTE");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  req.user
    .createProduct({
      //creates an userId field in the product table
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postdeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("DONE");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};
