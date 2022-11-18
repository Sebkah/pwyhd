import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

import { motion, AnimatePresence } from 'framer-motion';

const Post = forwardRef((props, ref) => {
  const [refObs, { entry }] = useIntersectionObserver({
    /* rootMargin: '50%'  */
  });
  const isVisible = entry && entry.isIntersecting;

  const [cacheVisibility, setCache] = useState(true);
  const [lyric, setLyric] = useState(true);

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
    if (time < 35.56) return 'Praise';
    if (time < 71.112) return 'PRAISE';
    if (time < 124.56) return 'Now whistle';
    if (time < 160.12) return 'Praise';
    if (time < 195.68) return 'PRAISE';

    return -1;
  };

  //visibilty update
  useEffect(() => {
    const time = calculateTimings(props.audioRef.current.currentTime);
    if (!isVisible && videoRef.current) {
      videoRef.current.pause();
    }
    if (isVisible && videoRef.current /*  && props.started.current */) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  }, [isVisible]);

  //onTimeUpate, fires when video is playing
  const onTimeUpdate = () => {
    console.log(isVisible);
    const time = calculateTimings(props.audioRef.current.currentTime);
    videoRef.current.currentTime = time;
    setCache(false);
    setLyric(lyrics(props.audioRef.current.currentTime));
    if (time == -1) setCache(true);
  };

  const { name, video, desc } = props.post;

  return (
    <div className="post" ref={refObs}>
      <div className="post-title">
        <div className="name">{name}</div>
        <FontAwesomeIcon className="dots" icon={faDotCircle} />
      </div>

      {
        <AnimatePresence>
          {cacheVisibility && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cache"
            ></motion.div>
          )}
        </AnimatePresence>
      }

      {isVisible && (
        <video
          className="video"
          onTimeUpdate={onTimeUpdate}
          /* controls */
          ref={videoRef}
          muted
          src={video}
          loop
        ></video>
      )}

      <div className="desc">
        <div className="descName">{name}</div>
        {desc}
      </div>
      <div className="desc">
        <div className="descName">Arigato Massai</div>
        {lyric}
      </div>
    </div>
  );
});

Post.displayName = 'Post';

export default Post;
