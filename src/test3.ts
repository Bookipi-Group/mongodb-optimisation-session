import { CompanyModel } from "./models/index";
import { init } from "./modules/mongoose";
import { Types } from "mongoose";
import { sleep } from "./utils";

async function updateName(
  companyId1: Types.ObjectId,
  companyId2: Types.ObjectId,
  newName1: string,
  newName2: string,
) {
  const session = await CompanyModel.startSession();
  await session.withTransaction(async () => {
    await CompanyModel.updateOne(
      { _id: companyId1 },
      { name: newName1 },
      { session },
    );
    await sleep(10000);
    await CompanyModel.updateOne(
      { _id: companyId2 },
      { name: newName2 },
      { session },
    );
  });
  await session.endSession();
}

async function run() {
  const company1 = await CompanyModel.findOne({})
    .sort({ _id: 1 })
    .skip(0)
    .lean();
  const company2 = await CompanyModel.findOne({})
    .sort({ _id: 1 })
    .skip(1)
    .lean();

  updateName(
    company1._id,
    company2._id,
    `${company1.name}-1`,
    `${company2.name}-1`,
  ).catch((e) => {
    console.error("err1:", e);
  });

  await updateName(
    company2._id,
    company1._id,
    `${company2.name}-2`,
    `${company1.name}-2`,
  ).catch((e) => {
    console.error("err2:", e);
  });
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
