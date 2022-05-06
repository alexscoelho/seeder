const customers = require("./customers.json");
const products = require("./products.json");
const baseUrl = "http://localhost:3333";

const customerList = customers.QueryResponse.Customer;
const productList = products.QueryResponse.Item;

const [seedArg] = process.argv.slice(2);

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function seedCustomers(customers) {
  customers.forEach(async (customer) => {
    await sleep(2000);
    createCustomer(customer);
  });
}

const createCustomer = (customer) => {
  const customerName = customer.DisplayName || customer.CompanyName;
  fetch(`${baseUrl}/customers`, {
    method: "POST",
    body: JSON.stringify({
      name: customer?.GivenName + " " + customer?.FamilyName || "N/A",
      phone: customer?.PrimaryPhone?.FreeFormNumber || "N/A",
      email: customer?.PrimaryEmailAddr?.Address || "N/A",
      city: customer?.BillAddr?.City || "N/A",
      state: customer?.BillAddr?.CountrySubDivisionCode || "N/A",
      address: customer?.BillAddr?.Line1 || "N/A",
      address2: customer?.BillAddr?.Country || "N/A",
      tierLevel: "default",
      company: customer?.CompanyName || customerName,
      zipCode: parseInt(customer?.BillAddr?.PostalCode) || 0,
      quickbooksId: customer?.Id,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json(resp))
    .then((data) => {
      if (data.statusCode > 400)
        console.log(
          `Customer "${customerName}"" could not be created, either exists or have missing fields`
        );
      else console.log(data);
    });
};

function seedProducts(products) {
  products.forEach(async (product) => {
    await sleep(2000);
    createProducts(product);
  });
}

const createProducts = (product) => {
  const productName = product.Name;
  fetch(`${baseUrl}/products`, {
    method: "POST",
    body: JSON.stringify({
      quickbooksId: product?.Id,
      sku: product?.Name,
      name: product?.Name,
      price: product?.UnitPrice,
      imageUrl:
        "https://static1.squarespace.com/static/5feb8101b5b33b527b373ebc/t/624deb72c3b55f64018575de/1649273714852/stdpsolution+icon-05.png",
      description: product?.Description,
      tierLevel: "A",
      type: product?.Type === "Service" ? "SERVICE" : "NON_INVENTORY",
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json(resp))
    .then((data) => {
      if (data.statusCode > 400)
        console.log(
          `Products "${productName}"" could not be created, either exists or have missing fields`
        );
      else console.log(data);
    });
};

if (seedArg === "products") {
  seedProducts(productList);
} else {
  seedCustomers(customerList);
}
