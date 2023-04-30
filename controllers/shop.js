const cart = require("../models/cart");
const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/index", {
  //     prods: products,
  //     pageTitle: "Shop",
  //     path: "/",
  //   });
  // });
  Product.findAll()
    .then((prod) => {
      res.render("shop/index", {
        prods: prod,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((prod) => {
      res.render("shop/product-list", {
        prods: prod,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (prods of products) {
  //       const cartData = cart.products.find((prod) => prod.id === prods.id);
  //       if (cartData) {
  //         cartProducts.push({ productData: prods, qty: cartData.qty }); //here prods are the different objects from the p location. So to push each of them ONE BY ONE into the empty array,the first productData will be the first prods and its qty will be gotten by using find()
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
  req.user
    .getCart()
    .then((cart) => {
      //this getCart method is possible bacuse of the relationship of we defined in the app.js
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err)); //this was addded by sequalize as a magic method to get all the products stored in the cart
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; //productId here b ecause this was exactly the same name used in product-detail.ejs input type hidden
  // Product.findById(prodId, (products) => {
  //   Cart.addProduct(prodId, products.price);
  // });
  // res.redirect("/cart");

  // //when the post call to /cart is made, the hidden input collects the value of the product.id from the product in that location
  // // when the button for /cart post request is clicked, it checks the clicked element and finds the id which i stores as productId,uses it to run execute the findById and gets the particular product, uses this product to run the cart.addProduct function.
  let product;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      console.log("HHEEEEEEYYYY", fetchedCart);
      // return cart.findByPk(prodId);
      // return cart.getProduct({ where: { id: prodId } });
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      console.log(products);
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        //this is for the case where the products already exists
        // product.quantity = product.quantity + 1;
        const oldQty = product.cartItem.quantity;
        newQty = oldQty + 1;
        return product;
      }

      return Product.findByPk(prodId);
      // .then((product) => {
      //   fetchedCart.addProduct(product, { through: { quantity: newQty } }); //htis means that if the cart does not exist,go the fetchedCart and use a magic method addProduct and add the product and then the THROUGH is telling seqelize that for the additional in between table whixh in our case was the CartItem, set a quantity.Also initially the inbetween table had a quantity field go and check
      // })
    })
    .then((product) => {
      fetchedCart.addProduct(product, { through: { quantity: newQty } }); //htis means that if the cart does not exist,go the fetchedCart and use a magic method addProduct and add the product and then the THROUGH is telling seqelize that for the additional in between table whixh in our case was the CartItem, set a quantity.Also initially the inbetween table had a quantity field go and check
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.getProduct = (req, res, next) => {
  const prodtId = req.params.prodId; //this productId here is gotten from the shop router where :productId is assigned to the /product
  // Also it is productId in the controller and route section but in the ejs, to get this id will have to be from the product rendered here in the controller.that becomes product.id

  Product.findAll({ where: { id: prodtId } }).then((products) => {
    res.render("shop/product-detail", {
      pageTitle: "Product Detail Page",
      product: products[0],
      path: "/products",
    });
  });
  // Product.findById(prodtId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       pageTitle: "Product Detail Page",
  //       product: product,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
