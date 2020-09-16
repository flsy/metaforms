# Metaforms

A tool for building and managing forms in simple JSON format.

## usage:
```typescript
import { hasError, setFieldValue, validateForm } from "metaforms";

// An example of login form, which is serialized as JSON object for easier manipulation
const loginForm = {
  email: {
    type: "email",
    label: "Email",
    placeholder: "Enter your email address",
    value: "",
    validation: [
      { type: "required", message: "Please enter your email address" },
      { type: "pattern", message: "Sorry, we do not recognise that email address", value: "^.*@.*\\..*$" }
    ]
  },
  password: {
    type: "password",
    label: "Password",
    value: "",
    validation: [
      { type: "required", message: "Please enter your password" },
    ]
  },
  submit: {
    type: "submit",
    label: "Login"
  }
};

// which we can then take and fill with values:
const formWithValues = compose(
  validateForm,
  setFieldValue("email", "my@email.com"),
  setFieldValue("password", "pass#or!")
)(loginForm);


// or read the values
getFormData(formWithValues); // will produce: { email: "my@email.com", password: "pass#or!" }
 

// or check if the form has any errors
if (hasError(formWithValues)) {
  // if does, we can remove sensitive values and send it back to frontend of our app
  const formToReturn = setFieldValue("password", "", formWithValues);
}
```


