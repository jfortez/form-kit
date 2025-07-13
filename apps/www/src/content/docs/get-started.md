---
title: Get Started
description: How to get started with form-kit.
---

# Get Started

`form-kit` is a powerful library for creating forms in React. It uses `react-hook-form` and `zod` for validation and form management.

## Installation

First, install the package using your favorite package manager:

```bash
npm install @form-kit/form-kit
```

## Basic Usage

Here's a simple example of how to create a form with `form-kit`.

```tsx
import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

const MyForm = () => {
  return (
    <Form
      schema={schema}
      onSubmit={(data) => {
        console.log(data);
      }}
    />
  );
};

export default MyForm;
```

## How it Works

The `Form` component takes a `zod` schema and an `onSubmit` handler. It automatically generates form fields based on the schema. You can also customize the fields and layout.

### `schema`

The `schema` prop is a `zod` object that defines the shape of your form data and the validation rules.

### `onSubmit`

The `onSubmit` prop is a function that will be called with the form data when the form is submitted and valid.

### Automatic Field Generation

By default, `form-kit` will generate form fields based on the `zod` schema. For example, a `z.string()` will generate a text input, and a `z.number()` will generate a number input.
