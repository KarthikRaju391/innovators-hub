import React, { useState } from 'react'

const AddPost = () => {
    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const postData = {
            title,
            body,
            permalink: title.replace(/\s+/g, '-').toLowerCase()
        }

        const res = await fetch('/api/addPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        const data = await res.json();
        if (data !== null) {
            console.log(data)
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="title">Enter Title</label>
            <input type="text" onChange={(e) => setTitle(e.target.value)} name="title" id="title" />
            <label htmlFor="body">Enter Body</label>
            <input type="text" onChange={(e) => setBody(e.target.value)} name="body" id="body" />
            <input type="submit" value="Publish" />
        </form>
    )
}

export default AddPost;