/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, conn } = require('../../src/db.js');

const agent = session(app);
const dog = {
  name: 'Pug',
  height: "30 -35",
  weigth: "40 -45 ",
  temperament: "Stubborn, Curious, Playful",
};

describe("***RUTAS DOGS***", () => {
  describe("GET /dogs/:id", () => {
    it("should get 200", () => agent.get("/dogs/3498").expect(200));
  });
  describe("GET /temperament", () => {
    it("should get 200", () => agent.get("/temperament").expect(200));
  });
  describe("POST /dog", () => {
    it("should get 200", () =>
      agent.post("/dog").send(dog).expect(200));
  });
});
