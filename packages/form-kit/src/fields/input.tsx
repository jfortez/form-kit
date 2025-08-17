type InputProps = React.ComponentProps<'input'>;
const Input = (props: InputProps) => {
  return <input type="text" className="h-10 bg-primary" {...props} />;
};

export default Input;
