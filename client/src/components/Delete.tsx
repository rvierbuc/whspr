import React from 'react';
import axios from 'axios';
import { Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: number
  id: number
}

const Delete = ({ userId, id }: Props) => {
  const navigate = useNavigate();
  const handleDelete: () => void = async () => {
    try {
      const profileNavigate: (path: string) => void = (path) => navigate(path);
      const deletePost = await axios.delete(`/deletePost/${userId}/${id}`);
      profileNavigate('/protected/profile')
      console.log(deletePost.status);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container className="deleteModal text-center text-white rounded" style={{display: "block"}}>
      <p>
        Delete this post?
      </p>
      <Button type="button" className="btn-rounded" variant="danger" onClick={handleDelete}>Delete</Button>
    </Container>
  );
};

export default Delete;