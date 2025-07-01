
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ImportProcessor: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;
    
    const description = searchParams.get('description');
    
    // If description is empty, redirect to home
    if (!description || description.trim() === '') {
      navigate('/');
      return;
    }
    
    // If user is not logged in, redirect to home (they'll see auth page)
    if (!user) {
      navigate('/');
      return;
    }
    
    // If user is logged in and has description, redirect to add-job with description
    navigate(`/add-job?description=${encodeURIComponent(description.trim())}`);
  }, [loading, user, searchParams, navigate]);

  return null;
};
