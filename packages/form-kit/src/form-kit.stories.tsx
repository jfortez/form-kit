import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './form-kit';
import { z } from 'zod';

const schema = z.object({
  name: z.string('Name is Required'),
});

const meta = {
  title: 'form-kit/form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultForm: Story = {
  args: {
    schema,
  },
};
