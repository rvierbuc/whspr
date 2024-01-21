import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { RecordComment } from './RecordComment';
import WaveSurferComponent from './WaveSurferSimple';
import toast from 'react-hot-toast';
interface SharePostProps {
  userId: number;
  postObj: any;
  showShareModal: boolean;
  setShowShareModal: any;
  audioContext: AudioContext
}
export const SharePost: React.FC<SharePostProps> = ({ audioContext, userId, postObj, showShareModal, setShowShareModal }) => {
  const [followingSearchResults, setFollowingSearchResults] = useState<any>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [sendToUserObj, setSendToUserObj] = useState<any>(null);
  const [shareComment, setShareComment] = useState<FormData>(null);
  // toast notifications
  const notifyPostShared = () => {
    toast.success('Post Shared!', {
      icon: '📨',
      style: {
        background: 'rgba(34, 221, 34, 0.785)',
      },
      position: 'top-right',
    });
  };
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {  
    setSearchInput(event.target.value);
  };
  const handleSearchSubmission = async (): Promise<void> => {
    try {
      // make a request to the server endpoint using the current user's id and the search input as identifying params to get
      // the search results for the followers and the following
      const followersQueryResults = await axios.get(
        `/post/user/${userId}/followers/search/${searchInput}`,
      );
      const followingQueryResults = await axios.get(
        `/post/user/${userId}/following/search/${searchInput}`,
      );
      // using hooks, set the search results for the followers and the following respectively
      setFollowingSearchResults(followingQueryResults.data);
    } catch (error) {
      console.log('error fetching search results', error);
    }
  };
  const handleSelectSendToUser = (userObj) => {
    setSendToUserObj(userObj);
    setFollowingSearchResults(null);
    // TODO: i think this is where the send button functionality is but i'm not sure so i'm leaving it here for now
    notifyPostShared();
  };
  return (
    <div>
          <Modal.Header>
            Send to a Listener!
          </Modal.Header>
          <Modal.Body>
          <div>{`Send ${postObj.title}`}</div>
              <WaveSurferComponent
              audioUrl={postObj.soundUrl}
              postId={postObj.id}
              audioContext={audioContext}
              type={'sharePost'}
              ></WaveSurferComponent>
             
              <div>Send To:
              {sendToUserObj ? <div>
                <img
                      src={sendToUserObj.profileImgUrl}
                      alt="follower profile image"
                      style={{
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    />
                    <h4>{sendToUserObj.username}</h4>
              </div> : 
              <div>
              <input
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
              />
              <button onClick={() => handleSearchSubmission()}>
              Search
            </button>
              </div>
              }
              </div>
              {followingSearchResults 
                ? (followingSearchResults.length > 0 ? followingSearchResults.map((user) => (
                <div 
                key={user.id} 
                onClick={() => handleSelectSendToUser(user)}
                >
                    <img
                      src={user.profileImgUrl}
                      alt="follower profile image"
                      style={{
                        borderRadius: '50%',
                        width: '100px',
                        height: '100px',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    />
                    <h4>{user.username}</h4>
                  </div>
                )) : <div>no user found</div>) : <div></div> }
                {sendToUserObj ? <div>
                  <div>Want to Add Anything?</div>
                  <RecordComment
                  isSharing={true}
                  sentToId={sendToUserObj.id}
                  postObj={postObj}
                  userId={userId}
                  audioContext={audioContext}
                  setShowShareModal={setShowShareModal}
                  ></RecordComment>
                </div> : <div></div>}
          </Modal.Body>
          <Modal.Footer> 
            {/* figure out where to put these buttons */}
          </Modal.Footer> 
    </div>
  );
};