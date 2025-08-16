/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form as FormProvider } from './components/form';
import FormField, { type FormFieldType } from './form-field';
import { Button } from './components/button';
import { z } from 'zod';
import type { Components, Field, FieldTransformer, FormSubmitHandler } from './types';
import { generateFields, generateGrid, getDefaultValues } from '../utils/form';
import { FormComponentsProvider } from './components/form-context';
export type * from './types';
import './globals.css';

type FormProps<Z extends z.ZodObject<any>, C extends Components> = {
  schema: Z;
  initialValues?: z.input<Z>;
  fields?: Field<Z, C>[];
  fieldTransformer?: FieldTransformer<Z, C>;
  onSubmit?: FormSubmitHandler<Z>;
  onCancel?: () => void;
  components?: C;
};

export const Form = <
  Z extends z.ZodObject<any> = z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
>(
  props: FormProps<Z, C>
) => {
  const {
    schema,
    initialValues,
    fields = [],
    onSubmit,
    onCancel,
    fieldTransformer,
    components = {},
  } = props;

  const initialFormValues = useMemo<z.input<Z>>(() => {
    if (initialValues) return initialValues;
    if (!schema) return {} as z.input<Z>;
    return getDefaultValues(schema);
  }, [initialValues, schema]);

  const form = useForm({
    resolver: zodResolver(schema),
    values: initialFormValues,
  });
  const isSubmitting = form.formState.isSubmitting;

  const formFields = useMemo<Field<Z, C>[]>(() => {
    if (fields.length > 0) return fields;

    if (!schema) return [];

    return generateFields<Z, C>(schema, fieldTransformer);
  }, [fields, schema, fieldTransformer]);

  const rows = useMemo(() => generateGrid<Z, C>(formFields), [formFields]);

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const handleSubmit = async (data: z.infer<Z>) => {
    await onSubmit?.(data);
  };

  return (
    <FormComponentsProvider value={components}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {rows.map((row, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                {row.map((col) => (
                  <div
                    key={col.name}
                    className="w-full"
                    style={{
                      gridColumn: `span ${col.size} / span ${col.size}`,
                    }}
                  >
                    {col.type !== 'hidden' && (
                      <FormField metadata={col as unknown as FormFieldType<C>} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormComponentsProvider>
  );
};
export default Form;
