import IMessage from "@/models/message";
import MessageOriginator from "@/models/message-originator";

interface MessageBubbleProps {
    message: IMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    return (
        <div className={`flex h-fit w-fit max-w-xl m-2 p-4 justify-self-end mr-12 ml-12 shadow
        ${message.origin === MessageOriginator.USER
                ? "bg-blue-200 place-self-end rounded-l-2xl rounded-b-2xl"
                : "bg-purple-200 place-self-start rounded-r-2xl rounded-b-2xl"}
        `}>
            {
                message.text
                    ? <p className="overflow-y-hidden text-wrap">{message.text}</p>
                    : <div className='flex justify-center items-center'>
                        <span className='sr-only'>Loading...</span>
                        <div className='m-0.5 h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                        <div className='m-0.5 h-2 w-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                        <div className='m-0.5 h-2 w-2 bg-gray-700 rounded-full animate-bounce'></div>
                    </div>
            }
        </div>
    );
}
