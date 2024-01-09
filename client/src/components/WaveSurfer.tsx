import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import React, { useEffect, useState } from 'react';
import Delete from './Delete';
import axios from 'axios';
import { Modal } from './Modal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Post from './Post';
import HoverPlugin from 'wavesurfer.js/plugins/hover';
import { use } from 'passport';
import { MdOutlineAddComment } from 'react-icons/md';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { MdOutlineFavorite } from 'react-icons/md';
import { MdArrowOutward } from 'react-icons/md';
import { MdDeleteOutline } from "react-icons/md";

dayjs.extend(relativeTime);
interface WaveSurferProps {
  audioUrl: string;
  postId: number;
  postObj: any;
  userId: number;
  getPosts: any;
  updatePost: any;
  onProfile: boolean;
  onUserProfile: boolean;
  setOnProfile: any;
  audioContext: AudioContext;
  feed: string;
  setIsDeleting: any
  setCorrectPostId: any
  setSelectedUserPosts: any
  isDeleting: boolean
  onGridView: boolean;
  setOnGridView: any;
}

const WaveSurferComponent: React.FC<WaveSurferProps> = ({
  postObj,
  audioUrl,
  postId,
  userId,
  getPosts,
  updatePost,
  onProfile,
  onUserProfile,
  setOnProfile,
  audioContext,
  feed,
  setIsDeleting,
  setCorrectPostId,
  setSelectedUserPosts,
  isDeleting
  onGridView,
  setOnGridView,
}) => {
  const [wave, setWave] = useState<WaveSurfer | null>(null);
  const [display, setDisplay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [decodedData, setDecodedData] = useState<any>();
  const [following, setFollowing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [addComment, setAddComment] = useState<boolean>(false);
  // const { audioUrl, postId } = props;
  const containerId = `waveform-${postId || ''}`;
  console.log('wavesurfer AC', audioContext);
  // const handleDelete: () => void = async () => {
  //   try {
  //     const deletePost = await axios.delete(`/deletePost/${userId}/${postId}`);
  //     console.log(deletePost.status);
  //   } catch (error: any) {
  //     console.error(error);
  //   }
  // };
  const handleLike = async ()=> {
    try {
      await axios.post('/post/like', { userId, postId: postObj.id });
      await axios.put('/post/updateCount', {
        column: 'likeCount',
        type: 'increment',
        id: postId,
      });
      await updatePost(postId, userId);
    } catch (error) {
      console.log('client could not like', error);
    }
  };
  const handleUnlike = async () => {
    try {
      // const likeObj = postObj.Likes.filter((likeObj) => likeObj.userId === userId);
      await axios.delete(`/post/unlike/${postId}/${userId}`);
      await axios.put('/post/updateCount', {
        column: 'likeCount',
        type: 'decrement',
        id: postId,
      });
      await updatePost(postId, userId );
    } catch (error) {
      console.log('client could not unlike', error);
    }
  };
  const isFollowing = async () => {
    try {
      const findFollowing = await axios.get(
        `/post/isFollowing/${userId}/${postObj.user.id}`,
      );
      if (findFollowing.status === 200) {
        setFollowing(true);
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setFollowing(false);
      }
      console.log('following error', error);
    }
  };
  const startFollowing = async () => {
    try {
      const createFollowing = await axios.post('/post/startFollowing', {
        userId,
        followingId: postObj.user.id,
      });
      if (createFollowing.data === 'Created') {
        setFollowing(true);
      }
    } catch (error) {
      console.error('could not follow user', error);
    }
  };
  console.log('isGrid', onGridView);
  const stopFollowing = async () => {
    try {
      const createFollowing = await axios.delete(
        `/post/stopFollowing/${userId}/${postObj.user.id}`,
      );
      if (createFollowing.data === 'Created') {
        setFollowing(false);
      }
    } catch (error) {
      console.error('could not follow user', error);
    }
  };
  console.log('on user profile:', onUserProfile);
  console.log('on profile:', onProfile);
  const createSoundWaves = () => {
    let regions: RegionsPlugin;
    let hover: HoverPlugin;
    //if there is a wavesurfer already, destroy it
    if (wave) {
      wave.destroy();
    }
    //create the new wave
    console.log('creating new wave');
    const wavesurfer = WaveSurfer.create({
      // barWidth: 15,
      // barRadius: 5,
      // barGap: 2,
      //autoplay: true,
      interact: true,
      container: `#${containerId}`,
      waveColor: 'rgb(166, 197, 255)',
      progressColor: 'rgb(60, 53, 86)',
      url: audioUrl,
      width: 'auto',
      height: onUserProfile || onProfile ? 200 : 500, //TODO: maybe change this back to auto
      normalize: true,
     
      renderFunction: (channels, ctx) => {
        const { width, height } = ctx.canvas;
        const scale = channels[0].length / width;
        const step = 10;

        ctx.translate(0, height / 2);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();

        for (let i = 0; i < width; i += step * 2) {
          const index = Math.floor(i * scale);
          const value = Math.abs(channels[0][index]);
          let x = i;
          let y = value * height;

          ctx.moveTo(x, 0);
          ctx.lineTo(x, y);
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
          ctx.lineTo(x + step, 0);

          x = x + step;
          y = -y;

          ctx.moveTo(x, 0);
          ctx.lineTo(x, y);
          ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
          ctx.lineTo(x + step, 0);
        }

        ctx.stroke();
        ctx.closePath();
      },
    });
    hover = wavesurfer.registerPlugin(HoverPlugin.create());

    regions = wavesurfer.registerPlugin(RegionsPlugin.create());
    
    // wavesurfer.on("click", () => {
    //   regions.addRegion({
    //     start: wavesurfer.getCurrentTime(),
    //     end: wavesurfer.getCurrentTime() + 0.25,
    //     drag: true,
    //     color: "hsla(250, 100%, 30%, 0.5)",
    //     id: "test",
    //   });
    // });
    // wavesurfer.on('scroll', (visibleStartTime, visibleEndTime) => {
    //   console.log('Scroll', visibleStartTime + 's', visibleEndTime + 's')
    // })
    wavesurfer.on('ready', (waveDuration) => {
      if (waveDuration > 60) {
        const seconds = waveDuration % 60;
        const minutes = Math.floor(waveDuration / 60);
        setDuration(`${minutes}:${seconds}`);
      } else {
        const seconds = Math.ceil(waveDuration);
        if (seconds < 10) {
          setDuration(`00:0${seconds}`);
        } else {
          setDuration(`00:${seconds}`);
        }
      }

    });
    wavesurfer.on('finish', async () => {
      setIsPlaying(false);
      try {
        const addListen = await axios.post('/post/listen', { userId, postId });
        const updateListenCount = await axios.put('/post/updateCount', {
          column: 'listenCount',
          type: 'increment',
          id: postId,
        });
        await updatePost(postId, userId);
        console.log('complete', updateListenCount, addListen);
      } catch (error) {
        console.error('on audio finish error', error);
      }
    });

    setWave(wavesurfer);
    console.log('wave created!');

  };

  useEffect(() => {
    createSoundWaves();
    isFollowing();
  }, [audioUrl]);
  return (
    <div
      className="container"
      id="feed-container"
      style={{ minWidth: '300px', width: '100%', height: '100%', marginTop: '1rem', marginBottom: '1rem' }}
    >
      {!isDeleting
        ?
        <div className="row" id="feed-row">
          <div className="col-sm" id="feed-col-sm">
            <div className="card" id="feed-card" >
              {/* <br/> */}
              <div className="card-body">
                {onProfile ? (
                  <a></a>
                ) : (
                  <div
                    className="d-flex flex-row align-items-center justify-content-start"
                    id="header"
                    style={{
                      padding: '10px',
                    }}
                  >
                    <img
                      src={postObj.user.profileImgUrl}
                      className="rounded-circle"
                      style={{
                        width: 'auto',
                        height: '70px',
                        margin: '20px',
                        objectFit: 'scale-down',
                        borderStyle: 'solid',
                        borderWidth: 'medium',
                        borderColor: '#3c3556',
                      }}
                    />
                    <a
                      href={`profile/${postObj.user.id}`}
                      style={{ fontSize: 'xx-large', color: '#0f0c0c' }}
                      id="feed-username"
                    >
                      {postObj.user.username}
                    </a>
                    {feed === 'explore' ? (
                      following ? (
                        <button
                          className="p-2 btn btn-danger"
                          style={{ marginLeft: 'auto', marginRight: '2%' }}
                          onClick={() => stopFollowing()}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="p-2 btn btn-primary"
                          style={{ marginLeft: 'auto', marginRight: '2%' }}
                          onClick={() => startFollowing()}
                        >
                          Follow
                        </button>
                      )
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              <div hidden={!onProfile} style={{ display: 'flex',
                flexDirection: 'column',
                paddingTop: '1rem',
                paddingLeft: '1rem',
                justifyContent: 'start' }}>
              <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '-2rem',
                      marginLeft: '-1rem',
                      marginBottom: '.5rem',
                      
                    }}
                  >
                    <div
                      style={{
                        fontSize: onUserProfile || onProfile ? '2rem' : '4rem',
                        color: '#e1e1e5',
                      }}
                    >
                      {`${postObj.title} |`}
                    </div>
                    <div
                      style={{
                        marginLeft: '1rem',
                        fontSize: 'large',
                        color: '#e1e1e5',
                      }}
                    >
                      {dayjs(postObj.createdAt).fromNow()}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      
                      marginTop: '-1rem',
                      flexWrap: 'wrap',
                      // overflow:'hidden',
                      // whiteSpace:'nowrap',
                      // textOverflow: 'ellipsis',
                      //overflow:'scroll',
                      justifyContent: 'start',
                      marginLeft: '-1.5rem',
                      maxWidth:'250px'
                    }}
                  >
                    {postObj.categories ? (
                      postObj.categories.map((cat, index) => (
                        <button
                          className="btn btn-link"
                          style={{
                            color: '#e1e1e5',
                            textDecoration: 'none',
                          }}
                          onClick={() => getPosts('explore', cat)}
                          key={(index + 1).toString()}
                        >{`#${cat}`}</button>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
              </div>
              <div
                className="wavesurfer-container"
                style={{
                  marginTop: onProfile ? '0px' : '1rem',
                  height: '100%',
                  borderRadius: '6px',
                  //position: 'relative',
                }}
              >
                <div id={containerId}></div>
                <div
                  className="overlay-container"
                  style={{
                    position: 'absolute',
                    zIndex: '999',
                    top: '0px',
                    left: '0px',
                    right: '0px',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    justifyContent: 'start',
                    width: '100%',
                    height: onUserProfile || onProfile ? '200px' : '500px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'start',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginTop: '-2rem',
                      marginLeft: '-1rem',
                      
                    }}
                    hidden={onProfile}
                  >
                    <div
                      style={{
                        fontSize: onUserProfile || onProfile ? '2rem' : '4rem',
                        color: '#e1e1e5',
                      }}
                    >
                      {`${postObj.title} |`}
                    </div>
                    <div
                      style={{
                        marginLeft: '1rem',
                        fontSize: 'large',
                        color: '#e1e1e5',
                      }}
                    >
                      {dayjs(postObj.createdAt).fromNow()}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      textOverflow: 'ellipsis',
                      marginTop: '-1rem',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      marginLeft: '-1.5rem',
                    }}
                    hidden={onProfile}
                  >
                    {postObj.categories ? (
                      postObj.categories.map((cat, index) => (
                        <button
                          className="btn btn-link"
                          style={{
                            color: '#e1e1e5',
                            textDecoration: 'none',
                          }}
                          onClick={() => getPosts('explore', cat)}
                          key={(index + 1).toString()}
                        >{`#${cat}`}</button>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {isPlaying ? (
                    isPaused ? 
                    <button
                      type="button"
                      style={{
                        marginTop: onUserProfile || onProfile ? '5%' : '15%',
                        alignSelf: 'center',
                      }}
                      className="simple-btn"
                      id="play-btn"
                      onClick={() => {
                        if (wave) {
                          wave.playPause();
                          setIsPaused(() => !isPaused);
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        width= {onUserProfile || onProfile ? '5rem' : '10rem'} height={onUserProfile || onProfile ? '5rem' : '10rem'}
                        fill="#e9ecf343"
                        className="bi bi-pause"
                        viewBox="0 0 16 16"
                        >
                          <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
                      </svg>
                    </button>
                      : <button
                      
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '10rem',
                        margin: 'auto',
                      }}
                      onClick={() => {
                        if (wave) {
                          wave.playPause();
                          setIsPaused(() => !isPaused);
                        }
                      }}></button>
                  ) : (
                    <button
                      type="button"
                      className="simple-btn"
                      style={{
                        marginTop: onUserProfile || onProfile ? '5%' : '15%',
                        alignSelf: 'center',
                      }}
                      onClick={() => {
                        if (wave) {
                          wave.playPause();
                          setIsPlaying(() => !isPlaying);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={onUserProfile || onProfile ? '5rem' : '10rem'} height={onUserProfile || onProfile ? '5rem' : '10rem'}
                        fill="#e9ecf343"
                        className="bi bi-play-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div
                className="d-flex flex-row align-items-center justify-content-start"
                style={{ marginTop: '.5rem' }}
                >
                    <div style={{ color: '#e1e1e5' }}>
              {postObj.isLiked 
                ? `Liked by you and ${postObj.likeCount - 1} other listeners` 
                : `Liked by ${postObj.likeCount} listeners`}
            </div>
                  <div style={{ color: '#e1e1e5', marginLeft: 'auto' }}>{duration ? duration : ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'center', marginBottom:'8px' 
            }}>
              {postObj.isLiked ? (
                <div>
                  {' '}
                  <MdOutlineFavorite
                  data-toggle="tooltip" data-placement="top"
                  title={`Liked by you & ${postObj.likeCount - 1} listeners`}
                    type="button"
                    //className="btn"
                    onClick={() => handleUnlike()}
                    style={{
                      // backgroundColor: 'rgba(233, 236, 243, 0.00)',
                      // borderColor: 'rgba(233, 236, 243, 0.00)',
                      height: '3rem',
                      width: '3rem',
                      marginRight: '1rem',
                      marginLeft: '1rem',
                      color: '#e1e1e5',
                    }}
                  >
                  </MdOutlineFavorite>
                  {/* {postObj.likeCount ? <p style={{marginLeft: '3%', fontSize:'x-large'}}>{`${postObj.likeCount} likes`}</p> : <p></p>}  */}
                </div>
              ) : (
                <div>
                  <MdOutlineFavoriteBorder
                    type="button"
                    data-toggle="tooltip" data-placement="top"
                    title={`Liked by ${postObj.likeCount} listeners`}
                    //className="btn btn-light"
                    onClick={() => handleLike()}
                    style={{
                      //backgroundColor: 'rgba(233, 236, 243, 0.00)',
                      //borderColor: 'rgba(233, 236, 243, 0.00)',
                      height: '3rem',
                      width: '3rem',
                      marginLeft: '1rem',
                      marginRight: '1rem',
                      color: '#e1e1e5',
                    }}
                  >
                  </MdOutlineFavoriteBorder>
                  {/* {postObj.likeCount ? <p style={{marginLeft: '3%', fontSize:'x-large'}}>{`${postObj.likeCount} likes`}</p> : <p></p>} */}
                </div>
              )}
              <MdOutlineAddComment
                type='button'
                onClick={() => { setAddComment(() => !addComment); }}
                style={{
                  //backgroundColor: 'rgba(233, 236, 243, 0.00)',
                  //borderColor: 'rgba(233, 236, 243, 0.00)',
                  color: '#e1e1e5',
                  height: '3rem',
                  width: '3rem',
                  marginRight: '1rem',
                }}
                >
                </MdOutlineAddComment>
                <MdArrowOutward style={{
                  //backgroundColor: 'rgba(233, 236, 243, 0.00)',
                  //borderColor: 'rgba(233, 236, 243, 0.00)',
                  color: '#e1e1e5',
                  height: '3rem',
                  width: '3rem',
                  marginRight: '1rem',
                }}></MdArrowOutward>
                {onUserProfile ? (
                    <div onClick={() => setIsDeleting(true)}>
                      <MdDeleteOutline
                        type="button"
                        onClick={() => {
                          if (!isDeleting) {
                            setIsDeleting(true);
                            setCorrectPostId(postId)
                          } else {
                            setIsDeleting(false);
                            setCorrectPostId(null);
                          }
                        }}
                        style={{
                          color: '#e1e1e5',
                          height: '3rem',
                          width: '3rem',
                          marginRight: '1rem'
                        }}></MdDeleteOutline>
                    </div>
                  ) : (
                    <div></div>
                  )}
              </div>
              {/* {onUserProfile ? (
                <a></a>
              ) : ( */}
                <div>
                  <Post
                    key={postId}
                    postObj={postObj}
                    updatePost={updatePost}
                    userId={userId}
                    audioContext={audioContext}
                    addComment={addComment}
                    setAddComment={setAddComment}
                  />
                </div>
               {/* )} */}
            </div>
          </div>
        </div>
        :
        <div
          className="container"
          id="feed-container"
          style={{width: '100%', height: '100%'}}
        >
          <Delete id={postId} userId={userId} setIsDeleting={setIsDeleting} setSelectedUserPosts={setSelectedUserPosts} />
        </div>}
    </div>
  );
};

export default WaveSurferComponent;
/**
 * listen stat
 * <div>
                    <img
                      src={require('../style/listenIcon.png')}
                      style={{
                        width: 'auto',
                        height: '35px',
                        objectFit: 'scale-down',
                        color: '#e1e1e5',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: '2px',
                      marginRight: '2%',
                      fontSize: 'x-large',
                      color: '#e1e1e5',
                    }}
                  >
                    {postObj.listenCount}
                  </div>
 */
/**
 * old delete
 *  {/* {onUserProfile ? (
                    <div>
                      {' '}
                      <div>
                        <img
                          src={require('../style/bin.png')}
                          style={{
                            width: 'auto',
                            height: '40px',
                            objectFit: 'scale-down',
                            color: '#e1e1e5',
                          }}
                          onClick={() => {
                            if (deleting === false) {
                              setDeleting(true);
                              setIsDeleting(true);
                            } else {
                              setDeleting(false);
                              setIsDeleting(false);
                            }
                          }}
                        />
                      </div>
                      <div>
                        {deleting === true && (
                          <Modal
                            isOpen={deleting}
                            onClose={() => setDeleting(false)}
                            children={<Delete userId={userId} id={postId} />}
                          />
                        )}
                      </div>{' '}
                    </div>
                  ) : (
                    <div></div>
                  )}  */
 