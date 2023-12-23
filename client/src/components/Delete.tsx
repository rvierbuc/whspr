import React from 'react';
import axios from 'axios';

const Delete = (userId, id) => {
  const handleDelete: () => void = async () => {
    try {
      const deletePost = await axios.delete(`/deletePost/${userId}/${id}`);
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