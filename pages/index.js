import { TopBar } from '../components/TopBar';
import Head from 'next/head';
import data from '../components/data.json';
import { useRef, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../components/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { useRaf } from 'rooks';

export default function Home() {
  const audio = useRef(null);
  const videos = useRef([]);
  const bar = useRef(null);

  const [audioCtx, setAudioCtx] = useState(null);
  const [track, setTrack] = useState(null);
  const [analyser, setanalyser] = useState(null);

  const audioContext = useRef(null);
  const source = useRef(null);
  const audioAnalyser = useRef(null);

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
  };

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    /*     if (audioCtx) return; */
    if (audioContext.current) return;
    const AC = new AudioContext();
    AC.resume();
    /*  setAudioCtx(AC); */
    audioContext.current = AC;

    const TR = AC.createMediaElementSource(audio.current);
    /*   setTrack(TR); */
    source.current = TR;

    const AN = AC.createAnalyser();
    /*   setanalyser(AN); */
    audioAnalyser.current = AN;

    TR.connect(AN);
    AN.connect(AC.destination);
    AN.fftSize = 32;

    animate();
  }, []);

  useEffect(() => {
    if (analyser) animate();
  }, [analyser]);

  const animate = () => {
    if (audioAnalyser.current) {
      const bufferLength = audioAnalyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      audioAnalyser.current.getByteFrequencyData(dataArray);

      bar.current.style.height = dataArray[2] + 'px';
      /* console.log(bar.current.style.height); */

      /*  console.log(dataArray); */
    }

    requestAnimationFrame(animate);
  };

  return (
    <div className="container">
      <Head>
        <title>PWYHD</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div
        style={{
          width: '20px',
          position: 'fixed',
          height: '200px',
          backgroundColor: 'white',
        }}
        ref={bar}
        className="bar"
      ></div> */}
      <audio
        ref={audio}
        /* controls */
        onSeeking={() => {
          console.log(track.mediaElement.currentTime);
        }}
        src="audio.mp3"
      ></audio>
      <div
        className="hello"
        onClick={() => {
          if (audioContext.current.state === 'suspended') {
            audioContext.current.resume();
          }

          audio.current.play();
        }}
      >
        PLAY
      </div>

      <TopBar />

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
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
