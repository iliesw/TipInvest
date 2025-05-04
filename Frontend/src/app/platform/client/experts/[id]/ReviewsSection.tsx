"use client";
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Star, User, Loader2 } from 'lucide-react';
import useFetch from '@/lib/fetch';

interface Review {
  id: string;
  clientID: string;
  expertID: string;
  comment: string;
  rating: number;
  date: string;
  clientName?: string;
}

interface ReviewsSectionProps {
  expertId: string;
}

export default function ReviewsSection({ expertId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expertId) {
      fetchReviews();
    }
  }, [expertId]);

  const fetchReviews = async () => {
    try {
      const response = await useFetch.get(`/client/experts/${expertId}`);
      const data = await response.json();
      
      if (data.expert && data.expert.reviews) {
        setReviews(data.expert.reviews);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="p-6 w-full col-span-2">
      
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="w-full col-span-2">
          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{review.clientName || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-yellow-600">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}