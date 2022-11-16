import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

const Post = forwardRef((props, ref) => {
  const [refObs, { entry }] = useIntersectionObserver();
  const isVisible = entry && entry.isIntersecting;

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
    console.log(time);
    if (time < 35.56) return time;
    if (time < 71.112) return time - 35.56;
    if (time < 124.56) return -1;
    if (time < 160.12) return time - 124.56;
    if (time < 195.68) return time - 160.12;

    return -1;
  };

  //visibilty update
  useEffect(() => {
    const time = calculateTimings(props.audioRef.current.currentTime);
    if (time == -1) videoRef.current.currentTime = 1555550;
    if (!isVisible) {
      videoRef.current.pause();
    }
    if (isVisible && props.started.current && time != -1) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  }, [isVisible]);

  //onVideoEnd
  const onEnded = () => {
    const time = calculateTimings(props.audioRef.current.currentTime);
    if (time == -1) return;
    videoRef.current.currentTime = time;
    videoRef.current.play();
  };

  const { name, video, desc } = props.post;
  /*  console.log(post); */
  return (
    <div className="post" ref={refObs}>
      <div className="post-title">
        <div className="name">{name}</div>
        <FontAwesomeIcon className="dots" icon={faDotCircle} />
      </div>
      <video
        onEnded={onEnded}
        className="video"
        /* controls */
        ref={videoRef}
        muted
        src={video}
      ></video>
      <div className="desc">
        <div className="descName">{name}</div>
        {desc}
      </div>
    </div>
  );
});

Post.displayName = 'Post';

export default Post;
