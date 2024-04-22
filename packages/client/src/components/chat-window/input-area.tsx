import { useState, KeyboardEvent } from "react";

interface InputAreaProps {
    onSend: (text: string) => void;
}

export default function InputArea({ onSend }: InputAreaProps) {
    const [currentText, setCurrentText] = useState("")

    function onSubmit() {
        if (currentText) {
            console.log(currentText);
            onSend(currentText);
            setCurrentText("");
        }
    }

    function onEnterPress(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && e.shiftKey === true) {
            e.preventDefault();
            onSubmit();
        }
    }

    return (
        <div className="grid w-full my-4 mx-12">
            <textarea
                className="resize-none w-full col-start-1 row-start-1 border border-slate-300 rounded-md p-4 pr-24
                    focus:outline-none focus:shadow"
                rows={1}
                onChange={(e) => setCurrentText(e.target.value)}
                value={currentText}
                onSubmit={onSubmit}
                onKeyDown={(e) => onEnterPress(e)}
            />
            <button className="col-start-1 row-start-1 inline-block place-self-end self-center mx-2 mr-4 py-2 px-4
                rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white aria-pressed:bg-blue-600 shadow"
                onClick={onSubmit}
                onSubmit={onSubmit}
            >
                Send
            </button>
        </div>
    );
}
