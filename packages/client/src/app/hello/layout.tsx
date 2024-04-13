export default function HelloPageLayout({ children} : { children: React.ReactNode}) {
    return (
        <div>
            <h1>This is my header</h1>
            {children}
        </div>
    )
} 