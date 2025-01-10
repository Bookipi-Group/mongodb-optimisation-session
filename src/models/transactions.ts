import { model, Schema, SchemaTypes, Types } from "mongoose";

export type TTransaction = {
  date: Date;
  amount: number;
  transaction_code: "buy" | "sell";
  symbol: string;
  price: string;
  total: string;
};
export type TTransactions = {
  account_id: number;
  transaction_count: number;
  bucket_start_date: Date;
  bucket_end_date: Date;
  transactions: TTransaction[];
};

export const TransactionSchema = new Schema<TTransaction>(
  {
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_code: {
      type: String,
      required: true,
      enum: ["buy", "sell"],
    },
    symbol: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

export const TransactionsSchema = new Schema<TTransactions>({
  account_id: {
    type: Number,
    required: true,
  },
  transaction_count: {
    type: Number,
    required: true,
  },
  bucket_start_date: {
    type: Date,
    required: true,
  },
  bucket_end_date: {
    type: Date,
    required: true,
  },
  transactions: {
    type: [TransactionSchema],
    required: true,
  },
});
export const TransactionModel = model<TTransactions>(
  "transactions",
  TransactionsSchema,
);
