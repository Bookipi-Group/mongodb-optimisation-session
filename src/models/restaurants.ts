import { model, Schema, SchemaTypes, Types } from "mongoose";

export type TRestaurant = {
  _id: Types.ObjectId;
  borough: string;
  cuisine: string;
  name: string;
  restaurant_id: string;
  address: object;
  grades: object[];
};
export const RestaurantSchema = new Schema<TRestaurant>({
  borough: {
    type: SchemaTypes.String,
    required: true,
  },
  cuisine: {
    type: SchemaTypes.String,
    required: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  restaurant_id: {
    type: SchemaTypes.String,
    required: true,
  },
  address: {
    type: SchemaTypes.Mixed,
    required: true,
  },
  grades: {
    type: [SchemaTypes.Mixed],
    required: true,
  },
});
export const RestaurantModel = model<TRestaurant>(
  "restaurants",
  RestaurantSchema,
);
