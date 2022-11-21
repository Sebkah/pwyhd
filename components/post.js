import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import { motion, AnimatePresence } from 'framer-motion';

import Buttons from './Buttons';

const Post = forwardRef((props, ref) => {
  const [refObs, { entry }] = useIntersectionObserver({
    /* rootMargin: '50%'  */
  });
  const isVisible = entry && entry.isIntersecting;

  const [cacheVisibility, setCache] = useState(true);
  const [lyric, setLyric] = useState([]);
  const [dur, setDur] = useState(1);

  const videoRef = useRef();

  // all the functions or values you can expose here
  useImperativeHandle(ref, () => ({
    play: (time) => {
      if (isVisible) {
        videoRef.current.currentTime = time;
        videoRef.current.play();
      }
    },
    pause: () => {
      videoRef.current.pause();
    },
  }));

  const calculateTimings = (time) => {
    /*   console.log(time); */
    if (time < 35.56) return time;
    if (time < 71.112) return time - 35.56;
    if (time < 124.56) return -1;
    if (time < 160.12) return time - 124.56;
    if (time < 195.68) return time - 160.12;

    return -1;
  };

  const lyrics = (time) => {
    if (time < 0.5) return [];
    if (time < 1) return ['PRAISE!! '];
    if (time < 3) return ['Praise what you'];
    if (time < 7) return ['Praise what you have done'];
    if (time < 9) return ['Praise what you have done!! :blush:', 'For the'];
    if (time < 10.5) return ['Praise what you have done!!', 'For the THINGS'];
    if (time < 11)
      return ['Praise what you have done ', 'For the things that you'];
    if (time < 15.5)
      return [
        'Praise what you have done!!',
        'For the things that you have done!!!',
      ];
    if (time < 25)
      return [
        'Praise what you have done',
        'For the things that you have done',
        ,
        'For the things that you have done',
      ];
    if (time < 38)
      return [
        'Praise what you have done',
        'For the things that you have done',
        ,
        'For the things that you have done',
        ,
        'For the things that you have done',
      ];

    return [];
  };

  //visibilty update
  useEffect(() => {
    const time = calculateTimings(props.audioRef.current.currentTime);
    if (!isVisible && videoRef.current) {
      videoRef.current.pause();
      setDur(0);
      setCache(true);
    }
    if (isVisible && videoRef.current /*  && props.started.current */) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
      if (time == -1) {
        setLyric([]);
        setCache(true);
      }
    }
  }, [isVisible]);

  //onTimeUpate, fires when video is playing
  const onTimeUpdate = () => {
    setDur(1);
    console.log(isVisible);
    const time = calculateTimings(props.audioRef.current.currentTime);
    if (Math.abs(videoRef.current.currentTime - time) > 0.3) {
      videoRef.current.currentTime = time;
    }
    setCache(false);
    setLyric(lyrics(props.audioRef.current.currentTime));
    if (time == -1) setCache(true);
  };

  const { name, video, desc, slug } = props.post;

  return (
    <div className="post" ref={refObs}>
      <div className="post-title">
        <div className="name">
          <div className="profile-picture">
            <img src={'/pics/' + slug + '.jpg'} />
          </div>

          {name}
        </div>
        {<FontAwesomeIcon className="dots" icon={faEllipsisVertical} />}
      </div>

      <AnimatePresence>
        {cacheVisibility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur }}
            className="cache"
          ></motion.div>
        )}
      </AnimatePresence>

      <div className="placeHolder">
        {isVisible && (
          <video
            className="video"
            onTimeUpdate={onTimeUpdate}
            /* controls */
            ref={videoRef}
            muted
            src={video}
            preload="true"
            loop
          ></video>
        )}
      </div>

      <Buttons />

      <div className="desc">
        <div className="descName">{name}</div>
        {desc}
      </div>
      {lyric.map((lyr, index) => (
        <AnimatePresence key={index}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="desc"
          >
            <div className="descName">Arigato Massai</div>
            {lyr}
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
});

Post.displayName = 'Post';

export default Post;
