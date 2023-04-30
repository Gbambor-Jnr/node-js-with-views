// const fs = require("fs");
// const path = require("path");

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "cart.json"
// );

// module.exports = class Cart {
//   static addProduct(id, productPrice) {
//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 }; //this one is here so it is registered in memory immidtely it gets to that point
//       if (!err) {
//         cart = JSON.parse(fileContent); // we have to first convert this json cart to a javascript readable cart so we can perform js operarions with it
//       }
//       const existingProductIndex = cart.products.findIndex(
//         (prod) => prod.id === id
//       );
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.qty = updatedProduct.qty + 1;
//         // cart.products = [...cart.products];
//         cart.products[existingProductIndex] = updatedProduct;
//       } else {
//         updatedProduct = { id: id, qty: 1 };
//         cart.products = [...cart.products, updatedProduct];
//       }
//       cart.totalPrice = cart.totalPrice + +productPrice;
//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static deleteCart(id, productPrice) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         return;
//       }
//       const cart = JSON.parse(fileContent);

//       const newCart = { ...cart };
//       const oldProduct = newCart.products.find((prod) => prod.id === id);
//       if (!oldProduct) {
//         return;
//       }
//       newCart.products = newCart.products.filter((prod) => prod.id === id);
//       newCart.totalPrice = newCart.totalPrice - oldProduct.qty * productPrice;

//       fs.writeFile(p, JSON.stringify(newCart), (err) => {
//         console.log(error);
//       });
//     });
//   }

//   static getCart(cb) {
//     fs.readFile(p, (err, fileContent) => {
//       const cart = JSON.parse(fileContent);
//       if (err) {
//         cb(null);
//       }
//       cb(cart);
//     });
//   }
// };

const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = cart;
