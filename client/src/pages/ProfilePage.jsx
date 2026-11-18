import React from 'react';
import ProfileModal from '../components/ProfileModal.jsx';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <ProfileModal
      isOpen={true}
      onClose={() => navigate(-1)}
    />
  );
}
