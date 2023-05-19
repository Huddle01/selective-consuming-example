import React from "react";

interface Props {
  name: string;
  value: string;
  placeholder: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({
  name,
  value,
  onChange,
  placeholder,
  className,
}) => (
  <input
    type="text"
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`${className}, border-2 border-gray-300 bg-white py-3 px-5 w-full rounded-lg text-sm focus:outline-none mr-2`}
  />
);

export default Input;