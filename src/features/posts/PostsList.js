import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostExcerpt from './PostExcerpt';
import { fetchPosts, selectAllPosts } from './postsSlice';
import Spinner from '../../components/Spinner';

const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);

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
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
        content = orderedPosts.map(post => (
            <PostExcerpt key={post.id} post={post} />
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