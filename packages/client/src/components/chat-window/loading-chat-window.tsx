enum Side {
    LEFT,
    RIGHT
}

interface LoadingChatBubbleProps {
    side: Side
}

function LoadingChatBubble({ side }: LoadingChatBubbleProps) {
    return (
        <div className={`flex h-fit w-fit max-w-xl m-2 p-4 justify-self-end mr-12 ml-12 border mx-auto
                ${side === Side.RIGHT
                ? "place-self-end rounded-l-2xl rounded-b-2xl"
                : "place-self-start rounded-r-2xl rounded-b-2xl"}
                `}>
            <div className="animate-pulse flex space-x-4 w-60">
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoadingChatWindow() {
    const bubbles = Array.from(Array(10).keys()).map(
        val => <LoadingChatBubble
            key={`chat-bubble-key-${val}`}
            side={val % 2 === 0 ? Side.RIGHT : Side.LEFT}
        />)
    return <div className="flex flex-col w-full bg-red500">{bubbles}</div>
}
