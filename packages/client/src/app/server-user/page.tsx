export default async function ServerUserPage() {
    const user = await fetch("https://jsonplaceholder.typicode.com/users/1").then((res) => res.json());

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>{user.phone}</p>
        </div>
    )
}