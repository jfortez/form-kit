type InputProps = React.ComponentProps<"input">;
const Input = (props: InputProps) => {
  return <input type="text" {...props} />;
};

export default Input;
