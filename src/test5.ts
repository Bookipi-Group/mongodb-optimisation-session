import { InvoiceModel, PaymentModel } from "./models/index";
import { init } from "./modules/mongoose";
import { lodgeTimeCost } from "./utils";
import mongoose from "mongoose";

async function run() {
  await InvoiceModel.collection.dropIndexes();
  await PaymentModel.collection.dropIndexes();
  await InvoiceModel.collection.createIndex({
    "payments.cardType": 1,
  });
  await PaymentModel.collection.createIndex({
    cardType: 1,
  });

  await lodgeTimeCost(async () => {
    const ret = await PaymentModel.aggregate([
      {
        $match: {
          cardType: "credit",
        },
      },
      {
        $lookup: {
          from: "invoices",
          localField: "invoiceId",
          foreignField: "_id",
          as: "invoice",
        },
      },
      { $unwind: "$invoice" },
      {
        $group: {
          _id: "$invoice.customer._id",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: -1,
          count: { $sum: 1 },
        },
      },
    ]);
  }, "with lookup");

  await lodgeTimeCost(async () => {
    const ret = await InvoiceModel.aggregate([
      {
        $match: {
          "payments.cardType": "credit",
        },
      },
      {
        $group: {
          _id: "$customer._id",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: -1,
          count: { $sum: 1 },
        },
      },
    ]);
  }, "with sub-document");
}

init("invoices")
  .then(async () => {
    await run();
    console.log("end");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
