import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DoctorId, TravelModeId } from "@/lib/constants";
import { fetchQueueMinutes, fetchTravelMinutes } from "@/lib/mock-api";
import type { DemoState } from "@/store/slices";

export interface ApiErrorInfo {
  message: string;
}

const toError = (error: unknown): { error: ApiErrorInfo } => ({
  error: { message: error instanceof Error ? error.message : "Unknown error" },
});

/**
 * RTK Query with fakeBaseQuery: the endpoints below call the mock API.
 * When the Spring Boot backend exists, swap queryFn for a real fetchBaseQuery.
 */
export const clinicApi = createApi({
  reducerPath: "clinicApi",
  baseQuery: fakeBaseQuery<ApiErrorInfo>(),
  keepUnusedDataFor: 120,
  endpoints: (build) => ({
    getTravelTime: build.query<number, TravelModeId>({
      async queryFn(mode, api) {
        const { demo } = api.getState() as { demo: DemoState };
        try {
          return { data: await fetchTravelMinutes(mode, demo.travelError) };
        } catch (error) {
          return toError(error);
        }
      },
    }),
    getQueueTimes: build.query<Record<DoctorId, number>, void>({
      async queryFn(_arg, api) {
        const { demo } = api.getState() as { demo: DemoState };
        try {
          return { data: await fetchQueueMinutes(demo.waitError) };
        } catch (error) {
          return toError(error);
        }
      },
    }),
  }),
});

export const { useGetTravelTimeQuery, useGetQueueTimesQuery } = clinicApi;
