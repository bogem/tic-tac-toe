export const handleTextInput = (fn: ((value: string) => void)) => {
    return (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => fn(e.currentTarget.value);
};