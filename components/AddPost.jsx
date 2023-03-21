import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, SIZE, ROLE } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { Textarea } from "baseui/textarea";
import { Input } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { useRouter } from 'next/router';

const AddPost = (props) => {

    const router = useRouter()

    const [body, setBody] = useState('');
    const [title, setTitle] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (title === "" || body ===""){
            props.closeOpen()
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
        props.closeOpen()
        setTitle("")
        setBody("")
        router.replace(router.asPath)
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <Modal onClose={props.closeOpen} closeable isOpen={props.isOpen} animate autoFocus size={SIZE.default} role={ROLE.dialog} >
                <ModalHeader>Start Channel</ModalHeader>
                <ModalBody>
                
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
                
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={ButtonKind.tertiary} onClick={props.closeOpen} >
                        Cancel
                    </ModalButton>
                        <ModalButton onClick={e => handleSubmit(e)}>Publish</ModalButton>
                </ModalFooter>
            </Modal>
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