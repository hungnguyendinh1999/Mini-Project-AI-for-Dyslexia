import './TextBox.css';
import React, {FC, ChangeEvent} from 'react';

interface TextBoxProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    readonly?: boolean;
    color?: string;
}

/**
 * Textbox component with specific modifications.
 * 
 * @param value value to display
 * @param onChange function to call when value is changed
 * @param placeholder when textbox is empty, this appears as placeholder
 * @param rows number of rows should the height of the textbox span
 * @param readonly boolean to allow or disallow editing
 * @param color the "color" attribute in css
 * @returns textarea object with those values and specific css
 */
const TextBox: FC<TextBoxProps> = ({value, onChange, placeholder = 'Enter text here...', rows = 5, readonly = false, color = "inherit"}) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="custom-textbox"
            readOnly={readonly}
            style={{color: color}}
        />
    );
};

export default TextBox;
