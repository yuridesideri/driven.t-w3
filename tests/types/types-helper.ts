import supertest from "supertest"

export type superTestMethod = supertest.SuperTest<supertest.Test>["get" | "post" | "put" | "delete" | "patch" | "head" | "options"] 