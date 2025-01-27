import { model, Schema, SchemaTypes, Types } from "mongoose";
import { TPayment, PaymentSchema } from "./payments";

export type TInvoice = {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  customer: {
    _id: Types.ObjectId;
    name: string;
  };
  payments: TPayment[];
};
export const InvoiceSchema = new Schema<TInvoice>({
  companyId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  customer: {
    _id: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  payments: {
    type: [PaymentSchema],
    required: true,
    default: [],
  },
});
export const InvoiceModel = model<TInvoice>("invoices", InvoiceSchema);
