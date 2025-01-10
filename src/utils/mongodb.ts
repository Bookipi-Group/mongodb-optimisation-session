import {
  AccountModel,
  CustomerModel,
  TransactionModel,
  RestaurantModel,
} from "../models";

export const cleandb = async () => {
  await AccountModel.collection.dropIndexes();
  await CustomerModel.collection.dropIndexes();
  await TransactionModel.collection.dropIndexes();
  await RestaurantModel.collection.dropIndexes();
};
