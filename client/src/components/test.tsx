import React, { useState } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import { Modal as CustomModal } from './Modal';
const ProfileEdit = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [profileImg, setprofileImg] = useState(null);
  const [userBio, setUserBio] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const user = useLoaderData();
  const userId = user.id;

  const openModalHandler = (modalName) => {
    const newModalState = openModal === modalName ? null : modalName;
    setOpenModal(newModalState);
  };

  const closeModalHandler = () => {
    setOpenModal(null);
  };

  const updateBio = () => {
    axios.patch('/update-bio', { userBio: userBio, userId })
      .then(response => {
        console.log('Profile updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  const updateUsername = () => {
    setUsernameError('');
    axios.post('/update-username', { displayUsername: username, userId })
      .then(response => {
        console.log('Profile updated:', response.data);
        setOpenModal(null);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setUsernameError('Username already exists.');
        }
        console.error('Error updating profile:', error);
      });
  };

  const uploadImage = () => {
    const formData = new FormData();

    if (!profileImg) {
      console.error('image not selected');
      return;
    }

    formData.append('image', profileImg);
    formData.append('userId', userId); // Include user ID in the form data

    axios.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        closeModalHandler();
        console.log('Image uploaded correctly');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleFileButtonClick = () => {
    document.getElementById('profileImgInput').click();
  };

  const handleImageChange = (e) => {
    setprofileImg(e.target.files[0]);
    uploadImage();
  };

  return (
    <div className='btn-group'>
      <div className="modal-button-container">
        <button className="btn btn-dark" onClick={() => openModalHandler('img')}>Change User Profile Pic</button>
        <CustomModal className="modal-profile-edit" isOpen={openModal === 'img'} onClose={closeModalHandler}>
          <h2>Upload Profile Image</h2>
          <input style={{ display: 'none' }} id="profileImgInput" type="file" onChange={handleImageChange} />
          <button className="btn btn-dark" onClick={handleFileButtonClick}>Choose File</button>
          <button className="btn btn-dark" onClick={uploadImage}>Upload Image</button>
          <button className="btn btn-dark" onClick={closeModalHandler}>Cancel</button>
        </CustomModal>
      </div>
      <div className="modal-button-container">
        <button className="btn btn-dark" onClick={() => openModalHandler('username')}>Change Username</button>
        <CustomModal className="modal-profile-edit" isOpen={openModal === 'username'} onClose={closeModalHandler}>
          <h2>Change Username</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          {usernameError && <div className='text-warning'>{usernameError}</div>}
          <button className="btn btn-dark" onClick={() => updateUsername(username)}>Commit</button>
          <button className="btn btn-dark" onClick={closeModalHandler}>Cancel</button>
        </CustomModal>
      </div>
      <div className="modal-button-container">
        <button className="btn btn-dark" onClick={() => openModalHandler('bio')}>Change User Bio</button>
        <CustomModal className="modal-profile-edit" isOpen={openModal === 'bio'} onClose={closeModalHandler}>
          <h2>Change Your Bio</h2>
          <textarea onChange={(e) => setUserBio(e.target.value)}
            style={{
              borderRadius: '10px',
              minWidth: '200px',
              maxWidth: '100%',
              height: '100px',
            }} />
          <div>
            <button className="btn btn-dark" onClick={() => updateBio('userBio', userBio)}>Commit</button>
            <button className="btn btn-dark" onClick={closeModalHandler}>Cancel</button>
          </div>
        </CustomModal>
      </div>
    </div>
  );


};

export default ProfileEdit;