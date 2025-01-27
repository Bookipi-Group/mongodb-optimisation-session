import { model, Schema, Types } from "mongoose";

export type TCompany = {
  _id: Types.ObjectId;
  name: string;
};
export const CompanySchema = new Schema<TCompany>({
  name: {
    type: String,
    required: true,
  },
});
export const CompanyModel = model<TCompany>("companies", CompanySchema);
