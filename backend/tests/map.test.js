import { describe, it, expect, vi, beforeEach,beforeAll } from "vitest";
import request from "supertest";
import  app from "../app.js";
import * as mapService from "../services/maps.service.js";
import dogwalkerModel from "../models/dogwalker.model.js";
import resetDb from "./helpers/reset-db";

// 🧹 reset all mocks before each test
beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Map Routes", () => {
    //   beforeAll(async () => {
    //     console.log("clearing db");
    //     await resetDb();
    // });

  it("GET /get-coordinates should return coordinates", async () => {

    vi.spyOn(mapService, "getAddressCoordinate").mockResolvedValue({ ltd: 10, lng: 20 });
    const { status, body } = await request(app).get("/map/get-coordinates").query({ address: "Paris" });
  

    expect(status).toBe(200);
    expect(body).toEqual({ ltd: 10, lng: 20 });
  });

  it("GET /get-distance-time should return distance & time", async () => {
    vi.spyOn(mapService, "getDistanceTime").mockResolvedValue({ distance: "5km", time: "10 mins" });

    const { status, body } = await request(app)
      .get("/map/get-distance-time")
      .query({ origin: "Agra", destination: "Banglore" });

    expect(status).toBe(200);
    expect(body).toEqual({ distance: "5km", time: "10 mins" });
  });

  it("GET /get-suggestions should return autocomplete results", async () => {
    vi.spyOn(mapService, "getAutoCompleteSuggestions").mockResolvedValue(["Paris", "Parish"]);

    const { status, body } = await request(app).get("/map/get-suggestions").query({ input: "Par" });

    expect(status).toBe(200);
    expect(body).toEqual(["Paris", "Parish"]);
  });

  it("GET /get-dogwalkers-in-radius should return dogwalkers", async () => {
    vi.spyOn(mapService, "getDogwalkersInRadius").mockResolvedValue([
      { name: "Walker1" },
      { name: "Walker2" },
    ]);

    const { status, body } = await request(app)
      .get("/map/get-dogwalkers-in-radius")
      .query({ ltd: 10.0, lng: 20.0, radius: 5 });

    expect(status).toBe(200);
    expect(body).toEqual([{ name: "Walker1" }, { name: "Walker2" }]);
  });

  it("GET /get-address should return address from coordinates", async () => {
    vi.spyOn(mapService, "getAddressFromCoordinates").mockResolvedValue("Some Street");

    const { status, body } = await request(app)
      .get("/map/get-address")
      .query({ ltd: 10.0, lng: 20.0 });

    expect(status).toBe(200);
    expect(body).toEqual({ address: "Some Street" });
  });

  it("GET /send-request should save booking", async () => {
    const fakeDogwalker = { upcomingBookings: [], save: vi.fn().mockResolvedValue(true) };

    vi.spyOn(dogwalkerModel, "findOne").mockResolvedValue(fakeDogwalker);

    const user = { id: "u1", name: "John" };
    const filters = {
      service: "walking",
      startDate: "2023-01-01",
      endDate: "2023-01-01",
      startTime: "10:00",
      endTime: "11:00",
      dogCount: 1,
      message: "Take care",
    };

    const { status, body } = await request(app)
      .get("/map/send-request")
      .query({
        user: JSON.stringify(user),
        filters: JSON.stringify(filters),
        dogwalkerId: "dw1",
      });

    expect(status).toBe(200);
    expect(body).toEqual({ message: "Booking saved successfully" });
    expect(fakeDogwalker.upcomingBookings.length).toBe(1);
  });
});
