import React, { useState } from 'react';
import axios from 'axios';
import { useLoaderData } from 'react-router-dom';
import { Modal } from './Modal';
const ProfileEdit = () => {
  const [username, setUsername] = useState('');
  const [profileImg, setprofileImg] = useState(null);
  const [userBio, setUserBio] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const [showImgModal, setShowImgModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const user = useLoaderData();
  const userId = user.id;

  const openModalHandler = (modalName) => {
    const newModalState = openModal === modalName ? null : modalName;
    setOpenModal(newModalState);
  };

  const closeModalHandler = () => {
    setOpenModal(null);
  };

  const updateProfile = (field, value) => {
    axios.post('/update-profile', { field, value })
      .then(response => {
        console.log('Profile updated:', response.data);
      })
      .catch(error => {
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
        console.log('Image uploaded correctly');
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleImageChange = (e) => {
    setprofileImg(e.target.files[0]);
    uploadImage();
  };

  return (
    <div className='btn-group'>
      <div>
        <button onClick={() => openModalHandler('img')}>Change User Profile Pic</button>
        <Modal isOpen={openModal === 'img'} onClose={closeModalHandler}>
          <h2>Upload Profile Image</h2>
          <input type="file" onChange={handleImageChange} />
          <button onClick={uploadImage}>Upload Image</button>
          <button onClick={closeModalHandler}>Cancel</button>
        </Modal>
      </div>
      <div>
        <button onClick={() => openModalHandler('username')}>Change User Display Name</button>
        <Modal isOpen={openModal === 'username'} onClose={closeModalHandler}>
          <h2>Upload Profile Image</h2>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={() => updateProfile('displayUsername', username)}>Commit</button>
          <button onClick={closeModalHandler}>Cancel</button>
        </Modal>
      </div>
      <div>
        <button onClick={() => openModalHandler('bio')}>Change User Bio</button>
        <Modal isOpen={openModal === 'bio'} onClose={closeModalHandler}>
          <h2>Change Your Bio</h2>
          <input type="text" onChange={(e) => setUserBio(e.target.value)} />
          <button onClick={() => updateProfile('userBio', userBio)}>Commit</button>
          <button onClick={closeModalHandler}>Cancel</button>
        </Modal>
      </div>
    </div>
  );


};

export default ProfileEdit;