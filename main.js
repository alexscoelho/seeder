const customers = require("./ss-customers.json");

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
  const customerName = customer.name || customer.company;
  fetch("https://stepsolutionapi.herokuapp.com/customers", {
    method: "POST",
    body: JSON.stringify({
      ...customer,
      email: customer.email || "N/A",
      city: customer.city || "N/A",
      state: customer.state || "N/A",
      address: customer.address || "N/A",
      address2: "see address",
      tierLevel: "default",
      company: customer.company || customer.name,
      zipCode: parseInt(customer.zipcode) || 0,
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

seedCustomers(customers);
