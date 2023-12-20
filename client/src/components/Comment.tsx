import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import WaveSurferSimple from "./WaveSurferSimple";

const Comment = (props) => {
  const { comment, audioContext } = props;
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-between">
        <a href="#" className="card-link" style={{ fontSize: "x-large" }}>
          {comment.User.username}
        </a>
        <div>{dayjs(comment.createdAt).fromNow()}</div>
      </div>
      <WaveSurferSimple
        postId={comment.id}
        audioUrl={comment.soundUrl}
        audioContext={audioContext}
      />
      {/* <audio controls>
          <source src={comment.soundUrl} type="audio/webm" />
        </audio> */}
    </div>
  );
};
export default Comment;
