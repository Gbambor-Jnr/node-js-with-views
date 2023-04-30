// const { json } = require("body-parser");
// const fs = require("fs");
// const path = require("path");
// const Cart = require("./cart");

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json"
// );

// const mathId = Math.random();

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     getProductsFromFile((products) => {
//       if (this.id) {
//         const existingProductIndex = products.findIndex(
//           (prod) => prod.id === this.id
//         );
//         const updatedProduct = [...products];
//         updatedProduct[existingProductIndex] = this; //the this here means what everr is coming from the input fields
//         fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
//           console.log(err);
//         });
//       } else {
//         this.id = mathId.toString();
//         getProductsFromFile((products) => {
//           // products.push(this); it means that the products you are passing here is the json.parse(filecontent) since there is no error. the push here then means what ever was already here in this product,yu push the incoming {this.title,description,price etc} into it.
//           products.push(this);
//           fs.writeFile(p, JSON.stringify(products), (err) => {
//             console.log(err);
//           });
//         });
//       }
//     });
//   }

//   static fetchAll(cob) {
//     getProductsFromFile(cob);
//   }

//   static findById(id, cb) {
//     getProductsFromFile((products) => {
//       const product = products.find((p) => p.id === id);
//       // const product = products.filter((p) => p.id === id);
//       cb(product);
//     });
//   }

//   static deleteById(id) {
//     getProductsFromFile((products) => {
//       const product = products.find((prod) => prod.id === id);
//       const updatedProducts = products.filter((prod) => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//         if (!err) {
//           Cart.deleteCart(id, product.id);
//         }
//       });
//     });
//   }
// };

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

//Define a model that will be managed by sequalize,define("modelName", "modelStructure") is used to define a new model
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true, //this makes sure the id is incresased from the last one
    allowNull: false, //this makes sure null values arent allowed as the id
    primaryKey: true, // Thidefines the id as the primary key of the table for retriving data and defining relations
  },

  title: Sequelize.STRING,

  price: {
    type: Sequelize.DOUBLE, //double means it can be a floating point number.i.e with decimals
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
