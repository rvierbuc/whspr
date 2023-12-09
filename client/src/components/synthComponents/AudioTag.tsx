import React, { useRef, useState } from 'react';

const AudioTag = ({source}: {source: string}): React.JSX.Element => {
  const [audioSrc, setAudioSrc] = useState(source);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  return (
    <div>
      <audio ref={audioPlayer} id="recording" src={audioSrc} controls>
          Your browser does not support this feature
        </audio>
    </div>
  );
};

export default AudioTag;