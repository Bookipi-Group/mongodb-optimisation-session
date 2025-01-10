import { model, Schema, SchemaTypes, Types } from "mongoose";

export type TCustomer = {
  _id: Types.ObjectId;
  username: string;
  name: string;
  address: string;
  birthdate: Date;
  email: string;
  accounts: number[];
};
export const CustomerSchema = new Schema<TCustomer>({
  username: {
    type: SchemaTypes.String,
    required: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  address: {
    type: SchemaTypes.String,
    required: true,
  },
  birthdate: {
    type: SchemaTypes.Date,
    required: true,
  },
  email: {
    type: SchemaTypes.String,
    required: true,
  },
  accounts: {
    type: [SchemaTypes.Number],
    required: true,
  },
});
export const CustomerModel = model<TCustomer>("customers", CustomerSchema);
