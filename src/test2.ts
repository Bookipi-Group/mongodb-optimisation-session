import { init } from "./modules/mongoose";
import mongoose from "mongoose";
import { CustomerModel } from "./models";

async function runAggregation1() {
  const { CustomerModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: CustomerModel.collection.name,
  });
  const start = Date.now();
  await CustomerModel.aggregate([
    {
      $lookup: {
        from: "accounts",
        localField: "accounts",
        foreignField: "account_id",
        as: "account",
      },
    },
    {
      $match: {
        "account.limit": { $gte: 10000 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
  ]);
  const end = Date.now();
  return end - start;
}

async function runAggregation2() {
  const { AccountModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: AccountModel.collection.name,
  });
  const start = Date.now();
  await AccountModel.aggregate([
    {
      $match: {
        limit: { $gte: 10000 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "account_id",
        foreignField: "accounts",
        as: "customer",
      },
    },
    {
      $group: {
        _id: { $first: "$customer._id" },
        name: { $first: { $first: "$customer.name" } },
      },
    },
  ]);
  const end = Date.now();
  return end - start;
}

async function runAggregation3() {
  const { AccountModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: AccountModel.collection.name,
  });
  const start = Date.now();
  await AccountModel.aggregate([
    {
      $match: {
        limit: { $gte: 10000 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "account_id",
        foreignField: "accounts",
        as: "customer",
      },
    },
    {
      $group: {
        _id: { $first: "$customer._id" },
        name: { $first: { $first: "$customer.name" } },
      },
    },
  ]);
  const end = Date.now();
  return end - start;
}

async function runAggregation4() {
  const { AccountModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: AccountModel.collection.name,
  });
  const start = Date.now();
  await AccountModel.aggregate([
    {
      $match: {
        limit: { $gte: 10000 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "account_id",
        foreignField: "accounts",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $group: {
        _id: "$customer._id",
        name: { $first: "$customer.name" },
      },
    },
  ]);
  const end = Date.now();
  return end - start;
}

async function runTests() {
  let totalTimeCost = 0;
  for (let i = 0; i < 100; i++) {
    totalTimeCost += await runAggregation1();
  }
  console.log(`aggregation1 took ${totalTimeCost}ms`);

  totalTimeCost = 0;
  for (let i = 0; i < 100; i++) {
    totalTimeCost += await runAggregation2();
  }
  console.log(`aggregation2 took ${totalTimeCost}ms`);

  totalTimeCost = 0;
  for (let i = 0; i < 100; i++) {
    totalTimeCost += await runAggregation3();
  }
  console.log(`aggregation3 took ${totalTimeCost}ms`);
}

async function run() {
  const { cleandb } = await import("./utils");
  await cleandb();

  const { CustomerModel, AccountModel } = await import("./models");
  await CustomerModel.collection.createIndex({
    accounts: 1,
  });
  await AccountModel.collection.createIndex({
    account_id: 1,
  });
  await AccountModel.collection.createIndex({
    limit: 1,
    account_id: 1,
  });
  await runTests();
}
init("sample_analytics")
  .then(async () => {
    await run();
    console.log("end");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
