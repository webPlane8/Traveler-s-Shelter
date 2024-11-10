const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/travelers_shelter";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// index route
app.get("/listings", async (req, res) => {
  let allListing = await Listing.find({});
  // console.log(allListing);

  res.render("listing/index.ejs", { allListing });
});

// new route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listing/show.ejs", { listing });
});

// create Route
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Edit Route

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing);
  res.render("listing/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  res.redirect("/listings");
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testListing", (req, res) => {
//   let sampleListing = new Listing({
//     title: "Luxury Villa",
//     description: "My new Villa ",
//     price: 15000,
//     location: "daska",
//     country: "Pakistan",
//   });
//   sampleListing
//     .save()
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   res.send("response send");
// });
app.get("/", (req, res) => {
  res.send(`root is working`);
});

app.listen(port, () => {
  console.log(`app is listening on port: ${port}`);
});
