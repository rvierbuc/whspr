import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import WaveSurferSimple from "./WaveSurferSimple";

const Comment = (props) => {
  const { comment, audioContext, onProfile } = props;
  return (
    <div className="d-flex flex-column" style={{ margin: '1rem' }}>
      <div className="d-flex flex-row justify-content-start align-items-center"  >
        <a href={onProfile ? `feed/profile/${comment.User.id}` : `profile/${comment.User.id}`} className="card-link" style={{ fontSize: '1rem', textDecoration: 'none', color: '#e1e1e5', marginRight: '.5rem' }}>
          {comment.User.displayUsername || comment.User.username}
        </a>
        <div style={{ color: '#e1e1e5', fontSize:'.5rem', marginLeft:'auto' }}>{dayjs(comment.createdAt).fromNow()}</div>
      </div>
      <WaveSurferSimple
        postId={comment.id}
        audioUrl={comment.soundUrl}
        audioContext={audioContext}
        type={'comment'}
      />
      {/* <audio controls>
          <source src={comment.soundUrl} type="audio/webm" />
        </audio> */}
    </div>
  );
};
export default Comment;
