import { mustnotcontain } from "../rules";
import { validateField } from "../validate";

describe("mustnotcontain", () => {
  const message = "Please enter a valid password, it can`t contain your username";
  const validation = [
    mustnotcontain({ message, value: "username" })
  ];

  it("returns error when it contains", () => {
    const errorMessage = validateField({ username: "Honza" }, { value: "MyHonza", validation });

    expect(errorMessage).toEqual(message);
  });

  it("returns error when it equals", () => {
    const errorMessage = validateField({ username: "Honza" }, { value: "HonzA", validation });

    expect(errorMessage).toEqual(message);
  });

  it("dos not return error when different value", () => {
    const errorMessage = validateField({ username: "Honza" }, { value: "Frank", validation });

    expect(errorMessage).toEqual(undefined);
  });

  it("dos not return error when no form field in form", () => {
    const errorMessage = validateField({ myName: "Bob" }, { value: "email@domain.com", validation });

    expect(errorMessage).toEqual(undefined);
  });
});
