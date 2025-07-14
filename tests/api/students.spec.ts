import { expect, test } from "../../fixtures/test-data-fixtures";

import compareResponseWithRequest from "../../utils/compareResponseWithRequest";
import { executeQuery } from "../../utils/dbUtils";

test.describe.configure({ mode: "serial" });

test.describe("API e2e test together with DB", () => {
  let studentID;
  test("Create a new student using POST", async ({ request, newStudent }) => {
    const response = await request.post(process.env.API_ENDPOINT!, {
      // headers: {
      //   'Content-type': 'application/json',
      //   'Authorization': `Bearer ${process.env.API_TOKEN}`
      // },
      data: newStudent,
    });

    // console.log(JSON.stringify(response, null, 2));

    const responseBody = await response.json();
    console.log(responseBody);

    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();

    const name = responseBody.FIRST_NAME;
    studentID = responseBody.STUDENT_ID;

    console.log("NAME: " + name);
    console.log("DOB: " + responseBody.DOB);

    for (const key in newStudent) {
      expect(responseBody[key]).toBe(newStudent[key]);
    }

    const query = `SELECT * FROM students WHERE email = '${newStudent.EMAIL}'`;

    const result = await executeQuery(query);
    console.log(JSON.stringify(result, null, 2));
    const dbRow = result[0];

    // for (const key in newStudent) {
    //   if (key === "DOB") {
    //     // console.log(dbRow[key].toISOString() + ' CONVERTED VERSION')
    //     // After splitting ---> ['1990-01-01', 'T06:00:00.000Z']
    //     const receivedString = dbRow[key].toISOString().split("T")[0];
    //     expect(receivedString).toBe(newStudent[key]);
    //   } else {
    //     expect(dbRow[key]).toBe(newStudent[key]);
    //   }
    // }

    compareResponseWithRequest(dbRow, newStudent);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  /**
   * Test Case 2
   * Send a GET request to retrieve student we CREATED in the previous test
   * Validate the response is 2**
   * Validate the response body matches the student we created
   */
  test("Get the student we created using GET", async ({
    request,
    newStudent,
  }) => {
    const response = await request.get(
      `${process.env.API_ENDPOINT}/${studentID}`
    );

    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();
    compareResponseWithRequest(responseBody, newStudent);
  });

  /**
   * Test Case 3
   * Send a PUT request to update the student we CREATED in the first test
   * Validate the response is 2**
   */
  test("Update a student we created using PUT", async ({
    request,
    updatedStudent,
  }) => {
    const response = await request.put(
      `${process.env.API_ENDPOINT}/${studentID}`,
      {
        data: updatedStudent,
      }
    );

    expect(response.ok()).toBeTruthy();
    console.log(await response.json());
  });

  /**
   * Test Case 4
   * Send a DELETE request to delete the student we CREATED in the first test
   * Validate the response is 2**
   * And send a query to validate the student was deleted
   */
  test("Delete the student UPDATED using DELETE", async ({
    request,
    updatedStudent,
  }) => {
    const response = await request.delete(
      `${process.env.API_ENDPOINT}/${studentID}`
    );

    expect(response.ok()).toBeTruthy();

    const query = `SELECT * FROM students WHERE email = '${updatedStudent.EMAIL}'`;
    const result = await executeQuery(query);

    expect(result.length).toBe(0);
  });
});
