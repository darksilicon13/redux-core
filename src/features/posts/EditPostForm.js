import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { postUpdated, selectPostById } from './postsSlice';


const EditPostForm = () => {
    const { postId } = useParams();

    const post = useSelector(state => selectPostById(state, postId))
    const users = useSelector(state => state.users);

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [userId, setUserId] = useState(post.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(postUpdated({ id: postId, title, content, user: userId }))
            navigate(`/posts/${postId}`);
        }
    }

    const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor='postTitle'>Post Title: </label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor='postAuthor'>Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor='postContent'>Content: </label>
                <input
                    type="text"
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
            </form>
            <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
                Save Post
            </button>
        </section>
    );
}

export default EditPostForm;