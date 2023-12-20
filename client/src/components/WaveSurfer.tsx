import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Post from "./Post";
dayjs.extend(relativeTime);
interface WaveSurferProps {
  audioUrl: string;
  postId: number;
  postObj: any;
  userId: number;
  getPosts: any;
  updatePost: any;
  onProfile: boolean;
  setOnProfile: any;
  audioContext: any;
}

const WaveSurferComponent: React.FC<WaveSurferProps> = ({
  postObj,
  audioUrl,
  postId,
  userId,
  getPosts,
  updatePost,
  onProfile,
  setOnProfile,
  audioContext,
}) => {
  const [wave, setWave] = useState<WaveSurfer | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [decodedData, setDecodedData] = useState<any>();
  const [following, setFollowing] = useState<boolean>(false)
  // const { audioUrl, postId } = props;
  const containerId = `waveform-${postId || ""}`;

  const isFollowing = async () => {
    try{
      const findFollowing = await axios.get(`/post/isFollowing/${userId}/${postObj.user.id}`)
      if(findFollowing.status === 200){
        setFollowing(true)
      }
    }catch(error: any){
      if(error.response.status === 404){
        setFollowing(false)
      }
      console.log('following error', error)
    }
  }
  const startFollowing = async () => {
    try{
      const createFollowing = await axios.post('/post/startFollowing', {userId, followingId: postObj.user.id})
      if(createFollowing.data === 'Created'){
        setFollowing(true)
      }
    }catch(error){
      console.error('could not follow user', error)

    }
  }

  const stopFollowing = async () => {
    try{
      const createFollowing = await axios.delete(`/post/stopFollowing/${userId}/${postObj.user.id}`)
      if(createFollowing.data === 'Created'){
        setFollowing(false)
      }
    }catch(error){
      console.error('could not follow user', error)

    }
  }
  const createSoundWaves = () => {
    let regions: RegionsPlugin;
    //if there is a wavesurfer already, destroy it
    if (wave) {
      wave.destroy();
    }
    //create the new wave
    console.log("creating new wave");
    
    const wavesurfer = WaveSurfer.create({
      // barWidth: 15,
      // barRadius: 5,
      // barGap: 2,
      interact: true,
      container: `#${containerId}`,
      waveColor: "rgb(0, 255, 0)",
      progressColor: "rgb(0, 0, 255)",
      url: audioUrl,
      width: "auto",
      height: 500,
      normalize: true,
    });

    regions = wavesurfer.registerPlugin(RegionsPlugin.create());

    wavesurfer.on("click", () => {
      regions.addRegion({
        start: wavesurfer.getCurrentTime(),
        end: wavesurfer.getCurrentTime() + 0.25,
        drag: true,
        color: "hsla(250, 100%, 30%, 0.5)",
        id: "test",
      });
    });
    wavesurfer.on("finish", async () => {
      setIsPlaying(false);
      //console.log(userId)
      try {
        const addListen = await axios.post("/post/listen", { userId, postId });
        const updateListenCount = await axios.put("/post/updateCount", {
          column: "listenCount",
          type: "increment",
          id: postId,
        });
        await updatePost(postId, userId);
        console.log("complete", updateListenCount, addListen);
      } catch (error) {
        console.error("on audio finish error", error);
      }
    });
    // wavesurfer.on('decode', () => { THIS CODE WORKS AND IS LEFT COMMENTED OUT UNTIL SOMEONE NEEDS TO USE IT,
    //     regions.addRegion({          IT ADDS A REGIONE TO THE WAVE FORM THAT THE USER CAN DRAG TO HIGHLIGHT SPECIFIC PARTS OF THE WAVE
    //         start: 0.25,         THIS WILL BE TINKERED WITH A LOT FOR USER CREATED SOUNDS
    //         end: 0.5,
    //         drag: true,
    //         color: 'hsla(250, 100%, 30%, 0.5)',
    //     })
    // })
    wavesurfer.getDecodedData();
    setWave(wavesurfer);
    setDisplay(true);
    console.log("wave created!");
  };

  useEffect(() => {
    createSoundWaves();
    isFollowing();
  }, [audioUrl]);
  return (
    <div
      className="container-fluid"
      id="feed-container"
      style={{ width: "100%", height: "100%" }}
    >
      <div className="row" id="feed-row">
        <div className="col-sm" id="feed-col-sm" >
          <div
            className="card"
            id="feed-card"
            // style={{ width: "100%", height: "100%" }}
          >
            {/* <br/> */}
            <div className="card-body">
              {onProfile ? (
                <a></a>
              ) : (
                <div className="card-header d-flex flex-row align-items-center justify-content-start">
                  <img
                    src={postObj.user.profileImgUrl}
                    className="rounded-circle"
                    style={{
                      width: "auto",
                      height: "70px",
                      margin: "20px",
                      objectFit: "scale-down",
                      borderStyle: "solid",
                      borderWidth: "medium",
                    }}
                  />
                  <a
                    href={`profile/${postObj.user.id}`}
                    className="p-2 card-link"
                    style={{ fontSize: "xx-large" }}
                    id="feed-username"
                  >
                    {postObj.user.username}
                  </a>
                  {following
                  ? <button
                    className="p-2 btn btn-danger"
                    style={{ marginLeft: "auto", marginRight: "2%" }}
                    onClick={() => stopFollowing()}
                  >
                    Unfollow
                    </button>
                  : <button
                    className="p-2 btn btn-primary"
                    style={{ marginLeft: "auto", marginRight: "2%" }}
                    onClick={() => startFollowing()}
                  >
                    Follow
                  </button>}
                </div>
              )}
              <div
                className="d-flex flex-row align-items-end justify-content-start"
                style={{ marginTop: "3%" }}
              >
                <div style={{ fontSize: "xxx-large", marginLeft: "20px" }}>
                  {postObj.title}
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    marginRight: "2%",
                    fontSize: "large",
                  }}
                >
                  {dayjs(postObj.createdAt).fromNow()}
                </div>
              </div>

              {postObj.categories ? (
                postObj.categories.map((cat) => (
                  <button
                    className="btn btn-link"
                    style={{
                      color: "#424242",
                      fontSize: "x-large",
                      marginBottom: "3%",
                    }}
                    onClick={() => getPosts("explore", cat)}
                  >{`#${cat}`}</button>
                ))
              ) : (
                <div></div>
              )}
              <div id={containerId}></div>
              <div
                className="d-flex flex-row align-items-center justify-content-start"
                style={{ margin: "2%" }}
              >
                {isPlaying ? (
                  <button
                    type="button"
                    className="btn btn-danger btn-lg"
                    id="play-btn"
                    onClick={() => {
                      if (wave) {
                        wave.playPause();
                        setIsPlaying(() => !isPlaying);
                      }
                    }}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-light btn-lg"
                    id="play-btn"
                    onClick={() => {
                      if (wave) {
                        wave.playPause();
                        setIsPlaying(() => !isPlaying);
                      }
                    }}
                  >
                    Play
                  </button>
                )}
                <div
                  style={{
                    padding: "2px",
                    marginLeft: "auto",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                  }}
                >
                  <div>
                    <img
                      src={require("../style/listenIcon.png")}
                      style={{
                        width: "auto",
                        height: "35px",
                        objectFit: "scale-down",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: "2px",
                      marginRight: "2%",
                      fontSize: "x-large",
                    }}
                  >
                    {postObj.listenCount}
                  </div>
                  <div style={{ marginLeft: "3%" }}>
                    <img
                      src={require("../style/commentIcon.png")}
                      style={{
                        width: "auto",
                        height: "40px",
                        objectFit: "scale-down",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: "2px",
                      marginRight: "2%",
                      fontSize: "x-large",
                    }}
                  >
                    {postObj.commentCount}
                  </div>
                  <div style={{ marginLeft: "5px" }}>
                    <svg
                      width="32"
                      height="32"
                      fill="black"
                      className="bi bi-heart"
                      viewBox="0 0 16 16"
                    >
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
                    </svg>
                  </div>
                  <div
                    style={{
                      marginLeft: "3px",
                      marginRight: "2%",
                      fontSize: "x-large",
                    }}
                  >
                    {postObj.likeCount}
                  </div>
                </div>
              </div>

              <Post
                key={postId}
                postObj={postObj}
                updatePost={updatePost}
                userId={userId}
                audioContext={audioContext}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveSurferComponent;
