
type InputProps = {
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {label ? <label>{label}</label> : ""}
      <input className="border px-2 py-1 rounded" {...props} />
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