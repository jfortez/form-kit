---
title: API Reference
description: API reference for form-kit.
---

# API Reference

This page contains the API reference for `form-kit`.

## `Form` Component

The `Form` component is the main component of the library. It takes the following props:

- `schema`: A `zod` schema object.
- `onSubmit`: A function to handle form submission.
- `initialValues`: An object with initial values for the form.
- `fields`: An array of field configurations to customize the form fields.
- `fieldTransformer`: A function to transform the fields before rendering.
- `onCancel`: A function to handle the cancel button click.
- `components`: An object with custom components to use in the form.
