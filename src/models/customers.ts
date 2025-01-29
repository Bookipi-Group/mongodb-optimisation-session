import { model, Schema, Types } from "mongoose";

export type TCustomer = {
  _id: Types.ObjectId;
  name: string;
  country?: string;
};
export const CustomerSchema = new Schema<TCustomer>({
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: false,
  },
});
export const CustomerModel = model<TCustomer>("customers", CustomerSchema);
