import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllDiscountResponse,
  SingleDiscountResponse,
} from "../../types/api-types";

export const couponAPI = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`,
  }),
  tagTypes: ["couponApi"],
  endpoints: (builder) => ({
    allCoupon: builder.query<AllDiscountResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["couponApi"],
    }),
    singleCoupon: builder.query<
      SingleDiscountResponse,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => `${id}?id=${userId}`,
      providesTags: ["couponApi"],
    }),
  }),
});

export const { useAllCouponQuery, useSingleCouponQuery } = couponAPI;
