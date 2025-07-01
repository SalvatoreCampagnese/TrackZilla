
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CompanyReview {
  id: string;
  rating: number;
  comment: string | null;
  role_applied: string | null;
  created_at: string;
  user_id: string;
}

interface CompanyReviewsProps {
  companyName: string;
  roleDescription: string;
}

export const CompanyReviews: React.FC<CompanyReviewsProps> = ({
  companyName,
  roleDescription
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userReview, setUserReview] = useState<CompanyReview | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [companyName]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('company_reviews')
        .select('*')
        .eq('company_name', companyName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      // Check if current user has already reviewed this company
      const existingReview = data?.find(review => review.user_id === user?.id);
      if (existingReview) {
        setUserReview(existingReview);
        setRating(existingReview.rating);
        setComment(existingReview.comment || '');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error loading reviews",
        description: "Could not load company reviews",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !user) return;

    setSubmitting(true);
    try {
      if (userReview) {
        // Update existing review
        const { error } = await supabase
          .from('company_reviews')
          .update({
            rating,
            comment: comment.trim() || null,
            role_applied: roleDescription
          })
          .eq('id', userReview.id);

        if (error) throw error;
        
        toast({
          title: "Review updated",
          description: "Your company review has been updated successfully"
        });
      } else {
        // Create new review
        const { error } = await supabase
          .from('company_reviews')
          .insert({
            company_name: companyName,
            user_id: user.id,
            rating,
            comment: comment.trim() || null,
            role_applied: roleDescription
          });

        if (error) throw error;
        
        toast({
          title: "Review added",
          description: "Your company review has been saved successfully"
        });
      }

      setShowAddForm(false);
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: "Error saving review",
        description: "Could not save your company review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= currentRating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-400'
            } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return "0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Rating Overview */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building className="w-5 h-5" />
            {companyName} Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-bold text-white">{getAverageRating()}</div>
            <div>
              {renderStars(Math.round(parseFloat(getAverageRating())))}
              <p className="text-white/70 text-sm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {!showAddForm && !userReview && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          )}

          {!showAddForm && userReview && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
            >
              Edit Your Review
            </Button>
          )}

          {showAddForm && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-white">Rating</Label>
                <div className="mt-2">
                  {renderStars(rating, true)}
                </div>
              </div>
              <div>
                <Label htmlFor="comment" className="text-white">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this company..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={!rating || submitting}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                >
                  {submitting ? 'Saving...' : userReview ? 'Update Review' : 'Add Review'}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    if (userReview) {
                      setRating(userReview.rating);
                      setComment(userReview.comment || '');
                    } else {
                      setRating(0);
                      setComment('');
                    }
                  }}
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">No reviews yet</p>
            <p className="text-white/50 text-sm">Be the first to review this company!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-white/70 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.role_applied && (
                      <Badge variant="secondary" className="bg-white/20 text-white mb-2">
                        {review.role_applied}
                      </Badge>
                    )}
                    {review.comment && (
                      <p className="text-white leading-relaxed">{review.comment}</p>
                    )}
                  </div>
                  {review.user_id === user?.id && (
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      Your Review
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
