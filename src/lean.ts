import { InvoiceModel } from "./models/index";
import { init } from "./modules/mongoose";

async function getAllWithMongooseModel() {
  await InvoiceModel.find({});
}
async function getAllWithLean() {
  await InvoiceModel.find({}).lean();
}
async function run() {
  const start = Date.now();
  await getAllWithMongooseModel();
  const end = Date.now();
  console.log("Time taken for read with mongoose object", end - start, "ms");

  const start2 = Date.now();
  await getAllWithLean();
  const end2 = Date.now();
  console.log("Time taken for read with lean", end2 - start2, "ms");
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
