import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: number
  id: number
}

const Delete = ({ userId, id }: Props) => {
  const navigate = useNavigate();
  const handleDelete: () => void = async () => {
    try {
      const profileNavigate: (path: string) => void = async (path) => await navigate(path);
      const deletePost = await axios.delete(`/deletePost/${userId}/${id}`);
      profileNavigate('/protected/profile')
      console.log(deletePost.status);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <p>
        Are you sure you want to delete this post?
      </p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Delete;