import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

/* export const Post = (post, ref) => {
  const { name, video, desc } = post;
  console.log(ref);
  return (
    <div className="post">
      <div className="name">{name}</div>
      <video className="video" ref={ref} muted src={video}></video>
      <div className="desc">
        <div className="descName">{name}</div>
        {desc}
      </div>
    </div>
  );
}; */

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
  /*   console.log(props.audioRef); */

  const internalFunction = () => {
    // access textAreaRef
  };

  useEffect(() => {
    if (!isVisible) {
      videoRef.current.pause();
    }
    if (isVisible) {
      videoRef.current.currentTime = props.audioRef.current.currentTime - 500;
      videoRef.current.play();
    }
  }, [isVisible]);

  const { name, video, desc } = props.post;
  /*  console.log(post); */
  return (
    <div className="post" ref={refObs}>
      <div className="post-title">
        <div className="name">{name}</div>
        <FontAwesomeIcon className="dots" icon={faDotCircle} />
      </div>
      <video className="video" ref={videoRef} muted src={video}></video>
      <div className="desc">
        <div className="descName">{name}</div>
        {desc}
      </div>
    </div>
  );
});

Post.displayName = 'Post';

export default Post;
