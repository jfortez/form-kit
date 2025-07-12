import {
  FormControl,
  FormDescription,
  FormField as PrimitiveFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/form';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import Field, { type FieldProps, type FieldType } from './field';
import type { Components } from './types';

type BaseField = {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  element?: React.ReactNode;
};

type FormFieldMap<C extends Components> = {
  [K in FieldType<C>]: BaseField & {
    type: K;
    fieldProps?: Omit<FieldProps<C, K>, keyof ControllerRenderProps>;
  };
};

export type FormFieldType<C extends Components = NonNullable<unknown>> =
  FormFieldMap<C>[FieldType<C>];

type FormInputProps<C extends Components> = {
  metadata: FormFieldType<C>;
};
const FormField = <C extends Components>({ metadata }: FormInputProps<C>) => {
  const { control } = useForm();
  return (
    <PrimitiveFormField
      control={control}
      name={metadata.name}
      render={({ field }) => (
        <FormItem>
          {metadata.label && <FormLabel>{metadata.label}</FormLabel>}
          <FormControl>
            {metadata.element ? (
              metadata.element
            ) : (
              <Field
                inputType={metadata.type}
                placeholder={metadata.placeholder}
                {...metadata.fieldProps}
                {...field}
              />
            )}
          </FormControl>
          {metadata.description && <FormDescription>{metadata.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
