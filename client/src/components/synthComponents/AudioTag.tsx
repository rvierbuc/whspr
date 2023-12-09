import React from 'react';

const AudioTag = ({source}: {source: string}): React.JSX.Element => {
  console.log('AudioTag', source);
  let track = document.getElementById('recording');
  console.log(track);
  return (
    <div>
      <audio id="recording" src={source} controls>
          Your browser does not support this feature
        </audio>
    </div>
  );
};

export default AudioTag;