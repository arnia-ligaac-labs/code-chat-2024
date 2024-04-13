'use client';

import { useState, useEffect } from "react";

export default function ClientComponent() {
    const [user, setUser] = useState<{ name?: string; email?: string; phone?: string }>({});

    useEffect(() => {
        async function getUser() {
            await fetch("https://jsonplaceholder.typicode.com/users/1")
            .then((res) => res.json())
            .then((receivedUser) => setUser(receivedUser));
        }

        getUser();
    }, []);



    return user?.email ?  (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>{user.phone}</p>
        </div>
    ) : <h1> I have no user </h1>
}