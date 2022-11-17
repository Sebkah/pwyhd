import Head from 'next/head';
import data from '../components/data.json';
import { useRef, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../components/post';

export default function Home() {
  const audio = useRef(null);
  const videos = useRef([]);

  const [posts, setPosts] = useState(() => {
    let post = data.posts;
    for (let index = 0; index < 9; index++) {
      post = [...post, ...data.posts];
    }
    return post;
  });

  const getMorePost = async () => {
    const newPosts = [data.posts[0], data.posts[1]];
    setPosts((post) => [...post, ...newPosts]);
    console.log(posts.length);
  };

  useEffect(() => {
    console.log(videos.current);
  }, []);

  return (
    <div className="container">
      <Head>
        <title>PWYHD</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <audio ref={audio} controls src="audio.mp3"></audio>

      <div className="top-bar">Arigato Massai</div>

      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePost}
        hasMore={true}
        loader={<h3> Loading...</h3>}
        endMessage={<h4>Nothing more to show</h4>}
      >
        {posts.map((currentPost, index) => (
          <Post
            key={index}
            post={currentPost}
            ref={(el) => (videos.current[index] = el)}
            audioRef={audio}
            /*      started={startedRef} */
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
