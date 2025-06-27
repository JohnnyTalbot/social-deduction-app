
type InputProps = {
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label ? <label>{label}</label> : ""}
      <input 
        className={`px-5 py-2 focus:outline-none rounded bg-input placeholder:text-placeholder text-input ${className}`} 
        style={{
          boxSizing: 'border-box',
          border: '3px solid #000000',
          boxShadow: '-5px 5px 0px #000000',
          borderRadius: '30px',
        }}
        type="text"
        placeholder={props.placeholder || "Enter text..."}
        {...props}
        name="disable-autofill"
        autoComplete="off"
        />
    </div>
  )
}

export function NumberInput({label, ...props}: InputProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {label ? <label>{label}</label> : ""}
      <input type="number" className="border px-2 py-1 rounded" {...props} />
    </div>
  )
}