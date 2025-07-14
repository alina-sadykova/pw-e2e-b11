import { expect } from "@playwright/test";

/**
 * The function iterates over each key in the request object and compares the value in the response/query
 * If our key is 'DOB' it handles the data by converting the date to string in the given format
 *
 * For other keys it will compare the values
 *
 * @param response
 * @param request
 *
 * @throws It will throw an error if 'DOB' field is not in a recognized format.
 */
function compareResponseWithRequest(response, request) {
  for (const key in request) {
    let receivedString: string;

    if (key === "DOB") {
      if (typeof response[key] === "string") {
        receivedString = response[key].split("T")[0];
      } else if (response[key] instanceof Date) {
        receivedString = response[key].toISOString().split("T")[0];
      } else {
        throw new Error(`Unexpected format for DOB: ${response[key]}`);
      }
      expect(receivedString).toBe(request[key]);
    } else {
      expect(response[key]).toBe(request[key]);
    }
  }
}

export default compareResponseWithRequest;
