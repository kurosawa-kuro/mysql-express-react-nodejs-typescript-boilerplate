// // printDOM.test.js

// import { printDOM } from "./testUtils";
// import { prettyDOM } from "@testing-library/react";

// describe("printDOM function", () => {
//   it("calls prettyDOM with document.body and the provided length", () => {
//     const consoleSpy = jest.spyOn(console, "log");

//     printDOM(10000);

//     expect(consoleSpy).toHaveBeenCalledWith(prettyDOM(document.body, 10000));

//     consoleSpy.mockRestore();
//   });

//   it("calls prettyDOM with document.body and a default length if no length is provided", () => {
//     const consoleSpy = jest.spyOn(console, "log");

//     printDOM();

//     expect(consoleSpy).toHaveBeenCalledWith(prettyDOM(document.body, 50000));

//     consoleSpy.mockRestore();
//   });
// });
