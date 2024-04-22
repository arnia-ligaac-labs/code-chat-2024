interface ChipProps {
    title: string;
    updateCurrentConversation: () => void;
    isSelected: boolean;
}

export default function Chip({ title, updateCurrentConversation, isSelected }: ChipProps) {
    return (
        <p className={`
                p-4 m-2 rounded-l select-none text-start truncate hover:bg-gray-200
                ${isSelected ? "bg-gray-200" : ""}
            `}
            onClick={updateCurrentConversation}>
            {title}
        </p>
    )
}
