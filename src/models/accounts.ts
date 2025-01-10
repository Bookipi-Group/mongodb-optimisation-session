import { model, Schema, SchemaTypes, Types } from "mongoose";
export type TAccount = {
  _id: Types.ObjectId;
  account_id: number;
  limit: number;
  products: string[];
};
export const AccountSchema = new Schema<TAccount>({
  account_id: {
    type: SchemaTypes.Number,
    required: true,
  },
  limit: {
    type: SchemaTypes.Number,
    required: true,
  },
  products: {
    type: [String],
    required: true,
  },
});
export const AccountModel = model<TAccount>("accounts", AccountSchema);
