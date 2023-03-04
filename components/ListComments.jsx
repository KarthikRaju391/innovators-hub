const ListComments = ({ comments }) => {

    return (
        <div>
            <h1>Comments</h1>
            <ul>
                {comments.map((comment) => (
                    <li className="border-2 w-fit border-blue-500" key={comment.id}>
                        <h2>{comment.name}</h2>
                        <p>{comment.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListComments;