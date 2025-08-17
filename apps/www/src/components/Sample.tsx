import { Form } from '@form-kit/form-kit';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  description: z.string(),
});
const Sample = () => {
  return <Form schema={schema} />;
};

export default Sample;
