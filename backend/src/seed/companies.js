import Company from "../models/Company.js";

await Company.insertMany([
  {
    name: "TechNova",

    description:
      "Software Development Company",

    services: [
      "Web Development",
      "Mobile Apps",
    ],

    email:
      "contact@technova.com",

    phone:
      "+91-9876543210",
  },
]);