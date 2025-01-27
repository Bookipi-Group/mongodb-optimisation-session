import { model, Schema, Types } from "mongoose";

export type TCustomer = {
  _id: Types.ObjectId;
  name: string;
};
export const CustomerSchema = new Schema<TCustomer>({
  name: {
    type: String,
    required: true,
  },
});
export const CustomerModel = model<TCustomer>("customers", CustomerSchema);
