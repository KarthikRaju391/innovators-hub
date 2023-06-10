import React, { useState } from 'react'
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { useRouter } from 'next/router';
import { Button } from 'baseui/button';

const AddPost = () => {

    const router = useRouter()

    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (title === "" || body ===""){
            return
        }
        
        const postData = {
            title,
            body,
            permalink: title.replace(/\s+/g, '-').toLowerCase()
        }

        await fetch('/api/addPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        setTitle("")
        setBody("")
        router.replace(router.asPath)
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className='w-[18rem] mx-auto select-none my-[.5rem] py-[.5rem] text-xl font-semibold cursor-default text-center'>
        
            <h2>Start Channel</h2>
                
                <FormControl label={() => "Enter Title: "} >
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                name="title" 
                                id="title"
                                placeholder="Eg. Portfolio Pros"
                                pattern="^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"
                                autoFocus
                                clearable
                                required
                                clearOnEscape
                                overrides={{
                                    Root: {
                                    style: ({ $theme }) => ({ width: "18rem" })
                                    }
                                }}
                            />
                        </FormControl>
                    
                        <FormControl label={() => "Enter Body: "} >
                            <Textarea
                                value={body}
                                name="body"
                                id="body"
                                required
                                onChange={e => setBody(e.target.value)}
                                placeholder={`Tips for smart investments strategies.`}
                                clearOnEscape
                            />
                        </FormControl>
            <div className='flex justify-center'>
                <Button type='submit'>Publish</Button>
            </div>
        </form>
    )
}

export default AddPost;

{/* <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="title">Enter Title</label>
                    <input type="text" onChange={(e) => setTitle(e.target.value)} name="title" id="title" />
                <label htmlFor="body">Enter Body</label>
                    <input type="text" onChange={(e) => setBody(e.target.value)} name="body" id="body" />
                <input type="submit" value="Publish" />
            </form> */}