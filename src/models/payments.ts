import { model, Schema, SchemaTypes, Types } from "mongoose";

export type TPayment = {
  _id: Types.ObjectId;
  invoiceId: Types.ObjectId;
  amount: number;
  date: Date;
  cardType: "credit" | "debit";
};

export const PaymentSchema = new Schema<TPayment>({
  invoiceId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  cardType: {
    type: String,
    required: true,
    enum: ["credit", "debit"],
  },
});
export const PaymentModel = model<TPayment>("payments", PaymentSchema);
