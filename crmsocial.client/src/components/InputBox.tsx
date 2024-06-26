import React, { ChangeEvent } from 'react';

interface InputBoxProps {
    type?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    name: string;
}

const InputBox: React.FC<InputBoxProps> = ({
    type = 'text',
    value,
    onChange,
    name,
    ...props
}) => {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="form-input sm:text-sm appearance-none w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            {...props}
        />
    );
};

export default InputBox;
