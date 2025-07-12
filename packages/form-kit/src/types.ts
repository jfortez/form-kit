/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from 'zod';
import type { FormFieldType } from './form-field';

export type Components = Record<string, React.ComponentType<any>>;

export type Sizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type Field<
  ZObject extends z.ZodObject<any> = z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
> = FormFieldType<C> & {
  name: keyof z.infer<ZObject>;
  size?: Sizes;
};

type MaybePromise<T> = T | Promise<T>;

export type FormSubmitHandler<Z extends z.ZodObject<any>> = (
  values: z.infer<Z>
) => MaybePromise<void>;

//TODO: Omit "name" using Omit<T, "name"> causes a non controlable type error in `fieldProps`
type _TransformField<C extends Components = NonNullable<unknown>> = FormFieldType<C> & {
  size?: Sizes;
  name: 'foo';
};

type FieldTransformFunction<Z extends z.ZodObject<any>, C extends Components> = (
  field: Field<Z, C>
) => Partial<_TransformField<C>> | undefined;

type FieldTransformObject<
  Z extends z.ZodObject<any> = z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
> = Partial<{
  [K in keyof z.infer<Z>]: Partial<_TransformField<C>> | FieldTransformFunction<Z, C>;
}>;

export type FieldTransformer<
  Z extends z.ZodObject<any> = z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
> = FieldTransformObject<Z, C> | FieldTransformFunction<Z, C>;

export type Option = {
  id: string | number;
  name: string;
};

export type SelectOptions = Option[] | Promise<Option[]>;
