import { expect, test } from "../../fixtures/test-data-fixtures.ts";

import compareResponseWithRequest from "../../utils/compareResponseWithRequest.ts";

test.describe.configure({ mode: "serial" });

test.describe("API Homework Project 01", () => {
  let studentId;
  test("get all students", async ({ request }) => {
    const response = await request.get(process.env.API_ENDPOINT!);
    const responseBody = await response.json();

    expect(response.status()).toBe(200);
    expect(responseBody.length).toBeGreaterThanOrEqual(2);

    for (let student of responseBody) {
      expect(student).toHaveProperty("STUDENT_ID");
    }
  });
  test("create a new student", async ({ request, newStudent }) => {
    const response = await request.post(process.env.API_ENDPOINT!, {
      data: newStudent,
    });

    const responseBody = await response.json();
    studentId = responseBody.STUDENT_ID;
    expect(response.status()).toBe(201);

    compareResponseWithRequest(responseBody, newStudent);
  });
  test("Get newly created student", async ({ request, newStudent }) => {
    const response = await request.get(
      `${process.env.API_ENDPOINT!}/${studentId}`
    );

    const responseBody = await response.json();
    expect(response.status()).toBe(200);

    compareResponseWithRequest(responseBody, newStudent);
  });
  test("Update newly created student with different instructor", async ({
    request,
    updatedStudent,
  }) => {
    const response = await request.put(
      `${process.env.API_ENDPOINT!}/${studentId}`,
      {
        data: updatedStudent,
      }
    );

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody.message).toBe(
      `Successfully updated the student with the STUDENT_ID: ${studentId}`
    );
  });

  test("Delete newly created student ", async ({ request, updatedStudent }) => {
    const response = await request.delete(
      `${process.env.API_ENDPOINT!}/${studentId}`,
      {
        data: updatedStudent,
      }
    );
    expect(response.status()).toBe(204);
  });
});
