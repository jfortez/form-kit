# @form-kit/form-kit

`@form-kit/form-kit` is a React library for easily creating dynamic and flexible forms. It integrates with `react-hook-form` for state management and `zod` for schema validation, allowing for the automatic generation of form fields from your validation schema.

## Features

- **Automatic form generation**: Create complete forms from a `zod` schema.
- **Highly customizable**: Allows for field transformation and the use of custom input components.
- **Integrated validation**: Uses `zod` for robust and simple schema validation.
- **Based on `react-hook-form`**: Leverages the power and performance of `react-hook-form`.
- **Flexible layout**: Arrange fields in a customizable grid.

## Installation

To install the package, run the following command in your terminal:

```bash
pnpm add @form-kit/form-kit
```

## Basic Usage

Here is an example of how to create a basic form with `@form-kit/form-kit`.

```tsx
import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

// 1. Define your validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// 2. Create your form component
const LoginForm = () => {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
    // Here you can handle the submission logic
  };

  return (
    <Form
      schema={loginSchema}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginForm;
```

In this example, `Form` will automatically render the `email` and `password` fields based on `loginSchema`.

## `Form` Component API

The `Form` component accepts the following props:

| Prop              | Type                                       | Description                                                                                             |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `schema`          | `z.ZodObject`                              | **(Required)** The Zod schema that defines the structure and validation rules of the form.     |
| `initialValues`   | `Partial<z.infer<Z>>`                      | An object with the initial values for the form fields.                                     |
| `fields`          | `Field<Z, C>[]`                            | An array to manually define the form fields, allowing full control over the order, size, and type of each field. |
| `fieldTransformer`| `FieldTransformer<Z, C>`                   | A function or object to transform the properties of automatically generated fields.          |
| `onSubmit`        | `(values: z.infer<Z>) => void`             | The function that is executed when the form is submitted with valid data.                              |
| `onCancel`        | `() => void`                               | The function that is executed when the "Cancel" button is clicked.                                   |
| `components`      | `Record<string, React.ComponentType<any>>` | An object to register custom input components that can be used in the fields. |

## Customization

### Using `fieldTransformer`

You can customize the automatically generated fields using the `fieldTransformer` prop. This is useful for changing the input type, grid size, label, etc.

```tsx
const userSchema = z.object({
  name: z.string(),
  bio: z.string(),
  birthDate: z.string(),
});

const UserForm = () => (
  <Form
    schema={userSchema}
    fieldTransformer={{
      // Transforms the 'bio' field to be a textarea
      bio: {
        type: 'textarea', // Assuming you have registered a 'textarea' component
      },
      // Transforms the 'birthDate' field to be a date field
      birthDate: {
        type: 'date',
        label: 'Date of Birth',
        size: 6, // Takes up half the width of the row
      },
    }}
  />
);
```

### Using Custom Components

You can register and use your own input components through the `components` prop.

```tsx
import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

// Your custom Textarea component
const MyTextarea = (props) => <textarea {...props} rows={4} />;

const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const PostForm = () => (
  <Form
    schema={postSchema}
    components={{
      textarea: MyTextarea,
    }}
    fieldTransformer={{
      content: {
        type: 'textarea',
      },
    }}
  />
);
```