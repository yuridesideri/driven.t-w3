import app, {init} from "@/app";
import { HttpStatusCode } from "axios";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, testingToken } from "../helpers";

const api = supertest(app);

beforeAll(async () => {
    await init();
})

beforeEach(async () => {
    await cleanDb();
})

describe("GET /hotels", () => {
    describe("Testing user Authentication", () => {
        testingToken(api.get, "/hotels");
    });
    describe("When token is valid", () => {
        it ("should respond with BadRequest(400) when ticket is not paid", async () => {
            //HttpStatusCode.BadRequest
        })
        it ("should respond with BadRequest(400) when booking is not made", async () => {

            //HttpStatusCode.BadRequest
        })
    })
})

describe("GET /hotels/:id", () => {
    describe("Testing user Authentication", () => {
        testingToken(api.get, "/hotels/:id");
        describe("When token is valid", () => {
    
            it ("should respond with Forbidden(403) when hotel.id isn't associated with user.id", async () => {
                //HttpStatusCode.Forbidden
            })
            it ("should respond with Forbidden(400) when booking is not made", async () => {
                //HttpStatusCode.BadRequest
            })
        })
    });
});