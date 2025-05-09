interface TextareaProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
    id?: string;
    required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange, placeholder, rows = 4, className = '', id, required = false }) => {
    return (
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`p-2 border border-gray-300 rounded-md resize-none ${className}`}
            required={required}
        />
    );
};

export default Textarea;
