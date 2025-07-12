# @form-kit/form-kit

`@form-kit/form-kit` es una biblioteca de React para crear formularios dinámicos y flexibles de manera sencilla. Se integra con `react-hook-form` para la gestión del estado y `zod` para la validación de esquemas, permitiendo la generación automática de campos de formulario a partir de tu esquema de validación.

## Características

- **Generación automática de formularios**: Crea formularios completos a partir de un esquema de `zod`.
- **Altamente personalizable**: Permite la transformación de campos y el uso de componentes de entrada personalizados.
- **Validación integrada**: Utiliza `zod` para una validación de esquemas robusta y sencilla.
- **Basado en `react-hook-form`**: Aprovecha la potencia y el rendimiento de `react-hook-form`.
- **Diseño flexible**: Organiza los campos en una cuadrícula personalizable.

## Instalación

Para instalar el paquete, ejecuta el siguiente comando en tu terminal:

```bash
pnpm add @form-kit/form-kit
```

## Uso Básico

Aquí tienes un ejemplo de cómo crear un formulario básico con `@form-kit/form-kit`.

```tsx
import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

// 1. Define tu esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// 2. Crea tu componente de formulario
const LoginForm = () => {
  const handleSubmit = (data) => {
    console.log('Datos del formulario:', data);
    // Aquí puedes manejar la lógica de envío
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

En este ejemplo, `Form` renderizará automáticamente los campos `email` y `password` basándose en `loginSchema`.

## API del Componente `Form`

El componente `Form` acepta las siguientes props:

| Prop              | Tipo                                       | Descripción                                                                                             |
| ----------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `schema`          | `z.ZodObject`                              | **(Requerido)** El esquema de Zod que define la estructura y las reglas de validación del formulario.     |
| `initialValues`   | `Partial<z.infer<Z>>`                      | Un objeto con los valores iniciales para los campos del formulario.                                     |
| `fields`          | `Field<Z, C>[]`                            | Un array para definir manualmente los campos del formulario, permitiendo un control total sobre el orden, el tamaño y el tipo de cada campo. |
| `fieldTransformer`| `FieldTransformer<Z, C>`                   | Una función u objeto para transformar las propiedades de los campos generados automáticamente.          |
| `onSubmit`        | `(values: z.infer<Z>) => void`             | La función que se ejecuta cuando el formulario se envía con datos válidos.                              |
| `onCancel`        | `() => void`                               | La función que se ejecuta cuando se hace clic en el botón "Cancelar".                                   |
| `components`      | `Record<string, React.ComponentType<any>>` | Un objeto para registrar componentes de entrada personalizados que pueden ser utilizados en los campos. |

## Personalización

### Usando `fieldTransformer`

Puedes personalizar los campos generados automáticamente utilizando la prop `fieldTransformer`. Esto es útil para cambiar el tipo de entrada, el tamaño en la cuadrícula, la etiqueta, etc.

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
      // Transforma el campo 'bio' para que sea un textarea
      bio: {
        type: 'textarea', // Asumiendo que has registrado un componente 'textarea'
      },
      // Transforma el campo 'birthDate' para que sea un campo de fecha
      birthDate: {
        type: 'date',
        label: 'Fecha de Nacimiento',
        size: 6, // Ocupa la mitad del ancho de la fila
      },
    }}
  />
);
```

### Usando Componentes Personalizados

Puedes registrar y utilizar tus propios componentes de entrada a través de la prop `components`.

```tsx
import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

// Tu componente de Textarea personalizado
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
