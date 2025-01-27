import mongoose from "mongoose";

export const init = async (dbName: string) => {
  return mongoose
    .connect("mongodb://localhost:27017/?replicaSet=dbrs", {
      autoIndex: false, // don't autoIndex
      dbName,
    })
    .then(async (db) => {
      mongoose.set("debug", false);
    })
    .catch((err: any) => {
      console.error("mongoose connection error", err);
      process.exit(1);
    });
};
