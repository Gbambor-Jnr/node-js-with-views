const path = require("path");
const sequelize = require("./util/database");

const express = require("express");
const bodyParser = require("body-parser");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      console.log(req.user);
      req.user = user; //initially there is nothing inside of req.user, just like there is nothing inside req.body ubtil something is parsed with the body-parser, so we can now set the req.user to the user of our choice and this makes it available everywhere now
      next(); //this makes sure we move unto the next thing after we get our user and store it
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: "true", onDelete: "CASCADE" }); //Cascade means a delete on the User should also be executed on the product
User.hasMany(Product); // This is because one user can also have many products and is just the inverse of Product.belongsTo(User) and is actually not necessary. Also you can replace the belongs To with has many or you can keep both.Your choice

User.hasOne(Cart, { through: CartItem });
Cart.belongsTo(User); //   A userId field will be added to the Cart and is the userId to which the cart belongs is created  ,when we use belongsToMany, a target Id is created to differentiate the many users from each other

Product.belongsToMany(Cart, { through: CartItem }); //through key tells sequel where the connection bbetween Cart and Product should be stored,a target Id is created to differentiate the many users from each other
Cart.belongsToMany(Product, { through: CartItem }); //this also means that it is in the CartItem that the productId and cartId will be stored

// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: { OrderItem } });

sequelize
  //.sync({ force: true }) //sync is used to sync all our models together
  .sync() //sync is used to sync all our models together
  .then((results) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Ikenna", email: "ikenna@gmail.com" });
    } else {
      return user;
    }
  })
  .then((user) => {
    return user.createCart(); //this means once a user is found, create an empty cart for this user
  })
  .then((cart) => app.listen(3006))
  .catch((err) => {
    console.log(err);
  });

//getProducts() and getCart() are a method set up as a result of the above relationship. getProducts has an s beacsue user has MANY products so its assumed that it is more than one while userhasONE cart so we know it is that one cart we are getting with getCart without an s
