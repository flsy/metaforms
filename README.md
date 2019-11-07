# metaforms

A tool for building and managing forms.

```shell
npm i metaforms
```


Example usage:
```typescript
import { hasError, pattern, required, setFieldValue, validateForm } from "metaforms";

// An example of login form, which is serialized as JSON object for easier manipulation
const loginForm = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email address",
    value: "",
    validation: [
      required("Please enter your email address"),
      pattern("Sorry, we do not recognise that email address, please check and try again", "^.*@.*\\..*$")
    ]
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    value: "",
    validation: [required("Please enter your password")]
  },
  {
    name: "submit",
    type: "submit",
    label: "Login"
  }
];

// which we can then take and fill with values:

const formWithValues = compose(
  validateForm,
  setFieldValue("email", "my@email.com"),
  setFieldValue("password", "pass#or!")
)(loginForm);


// and check if it has any errors

if (hasError(formWithValues)) {
  ...
  // if does we can remove sensitive values and send it back to frontend
  const formToReturn = setFieldValue("password", "", formWithValues);
  ...;
}
```


