import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostExcerpt from './PostExcerpt';
import { fetchPosts, selectPostIds } from './postsSlice';
import Spinner from '../../components/Spinner';

const PostsList = () => {
    const dispatch = useDispatch();
    const orderedPostIds = useSelector(selectPostIds);

    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'succeeded') {
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }


    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    );
}

export default PostsList;