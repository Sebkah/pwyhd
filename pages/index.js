import Head from 'next/head';
import data from '../components/data.json';
import { useRef, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../components/post';

export default function Home() {
  const audio = useRef(null);
  const videos = useRef([]);
  const startedRef = useRef(false);

  const [timer, setTimer] = useState(null);

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

  const startAudio = () => {
    console.log('Starting the show');

    /*   setTimer(
      setTimeout(() => {
        videos.current.forEach((video) => {
          video.play(0);
        });
      }, 124560)
    ); */

    /* setStarted(true); */
    startedRef.current = true;
    audio.current.currentTime = 0;
    audio.current.play();

    console.log(audio.current.currentTime);
    videos.current.forEach((video) => {
      video.play(0);
    });
  };
  const stopAudio = () => {
    console.log('Starting the show');
    startedRef.current = false;
    /*   setStarted(false); */

    videos.current.forEach((video) => {
      video.currentTime = 0;
      video.pause();
    });

    clearTimeout(timer);
    setTimer(null);

    audio.current.currentTime = 0;
    audio.current.pause();
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
      <audio
        /*   onTimeUpdate={() => {
          console.log(audio.current.currentTime);
        }} */
        ref={audio}
        controls
        src="audio.mp3"
      ></audio>

      <div className="top-bar">Arigato Massai</div>

      <div className="controls">
        <div onClick={startAudio}>START AUDIO</div>
        <div onClick={stopAudio}>STOP AUDIO</div>
      </div>

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
            index={index}
            audioRef={audio}
            started={startedRef}
          />
        ))}
      </InfiniteScroll>

      {/*     <div className="posts">
        {data.posts.map(({ video, desc }, index) => (
          <video
            ref={(el) => (videos.current[index] = el)}
            key={desc}
            muted
 
            src={video}
          ></video>
     
        ))}
      </div> */}
    </div>
  );
}
