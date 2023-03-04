import React, { useState } from 'react'

const Login = () => {
    const [pan, setPan] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch('/api/addPan', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pan })
        })
        const data = await res.json();
        if (data !== null) {
            console.log(data)
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="email">Pan Number</label>
            <input type="text" onChange={(e) => setPan(e.target.value)} name="pan" id="pan" />
            <input type="submit" value="Add PAN" />
        </form>
    )
}

export default Login