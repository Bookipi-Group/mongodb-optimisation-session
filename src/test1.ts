import { init } from "./modules/mongoose";
import mongoose from "mongoose";

// normal mongoose object returned
async function singleRunWithNormalMongooseObject() {
  const { RestaurantModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: RestaurantModel.collection.name,
  });
  const start = Date.now();
  await RestaurantModel.find({
    cuisine: {$in: ["American", "Chinese", "Pizza", "Italian"]}
  }).sort({ cuisine: 1, name: 1 })
  const end = Date.now();
  return end - start;
} // normal mongoose object returned
async function singleRunWithLeanMongooseObject() {
  const { RestaurantModel } = await import("./models");
  await mongoose.connection.db.runCursorCommand({
    planCacheClear: RestaurantModel.collection.name,
  });
  const start = Date.now();
  await RestaurantModel.find({
    cuisine: {$in: ["American", "Chinese", "Pizza", "Italian"]}
  })
    .sort({ cuisine: 1, name: 1 })
    .lean();
  const end = Date.now();
  return end - start;
}

async function runTests() {
  let totalTimeCost = 0;
  for (let i = 0; i < 1000; i++) {
    totalTimeCost += await singleRunWithLeanMongooseObject();
  }
  console.log(`lean mongoose object took ${totalTimeCost}ms`);

  totalTimeCost = 0;
  for (let i = 0; i < 1000; i++) {
    totalTimeCost += await singleRunWithNormalMongooseObject();
  }
  console.log(`normal mongoose object took ${totalTimeCost}ms`);
}

async function run() {
  const { cleandb } = await import("./utils");
  await cleandb();

  console.log("before index:");
  await runTests();

  const { RestaurantModel } = await import("./models");
  await RestaurantModel.collection.createIndex({
    cuisine: 1,
    name: 1,
  });
  console.log("after normal index:");
  await runTests();

  await cleandb();
  await RestaurantModel.collection.createIndex({
    cuisine: "hashed",
    name: 1,
  });
  console.log("after hashed index:");
  await runTests();

  await cleandb();
  await RestaurantModel.collection.createIndex(
    { name: 1 },
    {
      partialFilterExpression: {
        cuisine: {$in: ["American", "Chinese", "Pizza", "Italian"]}
      },
    },
  );
  console.log("after partial index:");
  await runTests();
}
init("sample_restaurants")
  .then(async () => {
    await run();
    console.log("end");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
