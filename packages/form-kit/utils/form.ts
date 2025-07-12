/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import type { FormFieldType } from '../src/form-field';
import type { Components, Field, FieldTransformer, Sizes } from '../src/types';

type InternalField<C extends Components> = Omit<Field<any, C>, 'type'> & {
  type: FormFieldType<C>['type'] | 'hidden';
};

export function generateGrid<
  Z extends z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
>(inputs: Field<Z, C>[]): InternalField<C>[][] {
  const GRID_WIDTH = 12;
  const result: InternalField<C>[][] = [];
  let currentRow: InternalField<C>[] = [];
  let currentWidth = 0;

  // Helper function to create a placeholder field
  const createPlaceholder = (size: Sizes): InternalField<C> =>
    ({
      name: `placeholder_${Math.random().toString(36).slice(2)}`,
      type: 'hidden' as const,
      size,
      label: '',
    }) as InternalField<C>;

  for (const item of inputs) {
    const itemWidth = item.size || 12;

    // Validate item size
    if (itemWidth < 1 || itemWidth > 12) {
      throw new Error(`Invalid size ${itemWidth} for field ${item.name}`);
    }

    // If adding this item exceeds row width or row is full, start new row
    if (
      currentWidth + itemWidth > GRID_WIDTH ||
      (currentRow.length === 0 && itemWidth === GRID_WIDTH)
    ) {
      if (currentRow.length > 0) {
        // Fill remaining space with placeholders
        while (currentWidth < GRID_WIDTH) {
          const remaining = GRID_WIDTH - currentWidth;
          currentRow.push(createPlaceholder(remaining as Sizes));
          currentWidth += remaining;
        }
        result.push(currentRow);
      }
      currentRow = [];
      currentWidth = 0;
    }

    // Add item to current row
    currentRow.push({ ...item, size: itemWidth } as unknown as InternalField<C>);
    currentWidth += itemWidth;

    // If row is exactly full, push it
    if (currentWidth === GRID_WIDTH) {
      result.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
  }

  // Handle last row
  if (currentRow.length > 0) {
    while (currentWidth < GRID_WIDTH) {
      const remaining = GRID_WIDTH - currentWidth;
      currentRow.push(createPlaceholder(remaining as Sizes));
      currentWidth += remaining;
    }
    result.push(currentRow);
  }

  // Validate that each row sums to exactly 12
  result.forEach((row, index) => {
    const rowWidth = row.reduce((sum, item) => sum + (item.size || 12), 0);
    if (rowWidth !== GRID_WIDTH) {
      throw new Error(`Row ${index} has invalid width: ${rowWidth}`);
    }
  });

  return result;
}

export function getDefaultValues<ZObject extends z.ZodObject<any>>(
  schema: ZObject
): z.input<ZObject> {
  const shape = schema.shape;
  const defaultValues: Record<string, unknown> = {};

  for (const item of Object.entries(shape)) {
    const [key, value] = item as [string, z.ZodTypeAny];
    const zodType = value as z.ZodTypeAny;

    // Si el esquema tiene un valor por defecto explícito
    if ('_def' in zodType && 'defaultValue' in zodType._def) {
      defaultValues[key] = zodType._def.defaultValue();
      continue;
    }

    // Manejo de diferentes tipos de Zod
    if (zodType instanceof z.ZodString) {
      defaultValues[key] = '';
    } else if (zodType instanceof z.ZodNumber) {
      defaultValues[key] = 0;
    } else if (zodType instanceof z.ZodBoolean) {
      defaultValues[key] = false;
    } else if (zodType instanceof z.ZodArray) {
      defaultValues[key] = [];
    } else if (zodType instanceof z.ZodObject) {
      // Recursión para objetos anidados
      defaultValues[key] = getDefaultValues(zodType);
    } else if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodNullable) {
      // Para tipos opcionales o anulables, asignamos undefined o null respectivamente
      defaultValues[key] = zodType instanceof z.ZodOptional ? undefined : null;
    } else {
      // Para otros tipos no manejados explícitamente, asignar undefined
      defaultValues[key] = undefined;
    }
  }

  return defaultValues as z.input<ZObject>;
}

export function generateFields<
  Z extends z.ZodObject<any>,
  C extends Components = NonNullable<unknown>,
>(schema: Z, fieldTransformer?: FieldTransformer<Z, C>): Field<Z, C>[] {
  const schemaShape = schema.shape;
  const defaultFields: Field<Z, C>[] = Object.keys(schemaShape).map(
    (key) =>
      ({
        name: key,
        size: 12,
        type: 'text',
        label: key,
      }) as unknown as Field<Z, C>
  );

  if (!fieldTransformer) return defaultFields;

  const getTransformResult = (
    field: Field<Z, C>,
    transformer: FieldTransformer<Z, C>
  ): Field<Z, C> => {
    const { name } = field;

    // ensure some fields are not present in the original field
    const privateValues = {
      name,
    };
    if (typeof transformer === 'function') {
      const transformResult = transformer(field);
      if (transformResult) {
        return {
          ...field,
          ...transformResult,
          ...privateValues,
        } as unknown as Field<Z, C>;
      } else return field;
    } else if (typeof transformer === 'object') {
      const transformResult = transformer[name];
      if (!transformResult) return field;

      return {
        ...field,
        ...(typeof transformResult === 'function' ? transformResult(field) : transformResult),
        ...privateValues,
      } as unknown as Field<Z, C>;
    }

    // Si el campo no tiene transformador, devolverlo tal cual
    return field;
  };

  return defaultFields.map((field) => {
    return getTransformResult(field, fieldTransformer);
  });
}
