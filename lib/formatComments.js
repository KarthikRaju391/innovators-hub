function formatComments(comments) {
    const map = new Map();
    const roots = [];

    for (let i = 0; i < comments.length; i++) {
        const commentId = comments[i].id;
        map.set(commentId, i);
        comments[i].children = [];
    }
    
    for (let i = 0; i < comments.length; i++) {

        if(typeof comments[i]?.parentId === 'string') {
            const parentCommentIndex = map.get(comments[i].parentId);
    
            comments[parentCommentIndex].children.push(comments[i]);
            
            continue;
        }
        
        roots.push(comments[i])
    }

    return roots;
}

export default formatComments;