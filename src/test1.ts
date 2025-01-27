import { CompanyModel } from "./models/index";
import { init } from "./modules/mongoose";
import { faker } from "@faker-js/faker";

async function setupCompanyOneByOneModel() {
  for (let i = 0; i < 10000; ++i) {
    const company = new CompanyModel({
      name: faker.company.name(),
    });
    await company.save();
  }
}
async function setupCompanyInBatch() {
  const cmds = [];
  for (let i = 0; i < 10000; ++i) {
    cmds.push({
      insertOne: {
        document: {
          name: faker.company.name(),
        },
      },
    });
  }
  await CompanyModel.bulkWrite(cmds);
}
async function run() {
  const start = Date.now();
  await setupCompanyOneByOneModel();
  const end = Date.now();
  console.log("Time taken for one by one model", end - start, "ms");

  const start2 = Date.now();
  await setupCompanyInBatch();
  const end2 = Date.now();
  console.log("Time taken for inserting in a batch", end2 - start2, "ms");
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
