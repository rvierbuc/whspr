import React from 'react';
import axios from 'axios';
import { Button, Container, Stack } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: number
  id: number
  setSelectedUserPosts: any
  setIsDeleting: any
}

const Delete = ({ userId, id, setSelectedUserPosts, setIsDeleting }: Props) => {
  const handleDelete: () => void = async () => {
    try {
      const deletePost = await axios.delete(`/deletePost/${userId}/${id}`);
      const getPosts = await axios.get(`/post/selected/${userId}`);
      setSelectedUserPosts(getPosts.data)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container className="deleteModal text-center text-white rounded" style={{display: "block"}}>
      <p>
        Delete this post?
      </p>
      <Stack direction="horizontal" gap={2} className="text-center">
        <Button type="button" className="btn-rounded btn-dark" onClick={handleDelete}>Yes</Button>
        <Button type="button" className="btn-rounded btn-dark" onClick={() => setIsDeleting(false)}>No</Button>
      </Stack>
    </Container>
  );
};

export default Delete;