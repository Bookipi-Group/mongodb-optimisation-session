import { InvoiceModel } from "./models/index";
import { init } from "./modules/mongoose";
import { lodgeTimeCost } from "./utils";
import mongoose from "mongoose";

async function run() {
  await InvoiceModel.collection.dropIndexes();
  await lodgeTimeCost(async () => {
    await InvoiceModel.countDocuments({
      "payment._id": { $ne: null },
    });
  }, "before index creation:");

  await InvoiceModel.collection.createIndex({
    "payment._id": 1,
  });
  const stats1 = await mongoose.connection.db.command({
    collStats: InvoiceModel.collection.collectionName,
  });
  console.log("Index sizes:", stats1.indexSizes);
  await lodgeTimeCost(async () => {
    await InvoiceModel.countDocuments({
      "payment._id": { $ne: null },
    });
  }, "after index creation:");
  await InvoiceModel.collection.dropIndexes();
  await InvoiceModel.collection.createIndex(
    {
      "payment._id": 1,
    },
    {
      partialFilterExpression: {
        "payment._id": { $exists: true },
      },
    },
  );
  const stats2 = await mongoose.connection.db.command({
    collStats: InvoiceModel.collection.collectionName,
  });
  console.log("Index sizes:", stats2.indexSizes);
  await lodgeTimeCost(async () => {
    await InvoiceModel.countDocuments({
      "payment._id": { $ne: null },
    });
  }, "after partial index creation:");
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
