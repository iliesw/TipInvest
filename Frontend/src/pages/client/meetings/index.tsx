/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Video, User } from 'lucide-react';
import LayoutC from '../layout';
import { decodeToken } from '@/lib/auth';
import useFetch from '@/lib/fetch';

interface Meeting {
  id: string;
  scheduledTime: string;
  duration: number;
  status: string;
  topic: string;
  meetingLink?: string;
  expert: {
    id: string;
    name: string;
    specialization: string;
    hourlyRate: number;
  } | null;
}

export default function ClientMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from token
    const token = localStorage.getItem('TOKENAUTH');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        setUserId(decoded.id);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMeetings = async () => {
      try {
        const response = await useFetch.get('/client/meetings');
        const data = await response.json();
        if (data.meetings) {
          setMeetings(data.meetings);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        alert('Failed to load meetings. Please try again later.');
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [userId]);

  const isWithinOneHour = (scheduledTime: string) => {
    const meetingTime = new Date(scheduledTime);
    const now = new Date();
    const hoursDifference = (meetingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference <= 1 && hoursDifference > -1; // Allow joining up to 1 hour after start time
  };

  const isWithin24Hours = (scheduledTime: string) => {
    const meetingTime = new Date(scheduledTime);
    const now = new Date();
    const hoursDifference = (meetingTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDifference <= 24;
  };

  const handleCancelMeeting = async (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    if (isWithin24Hours(meeting.scheduledTime)) {
      alert('Meetings cannot be cancelled within 24 hours of the scheduled time.');
      return;
    }

    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    
    try {
      await useFetch.post(`/client/meetings/${meetingId}/cancel`,{});
      
      // Update the local state
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === meetingId 
            ? { ...meeting, status: 'cancelled' } 
            : meeting
        )
      );
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      alert('Failed to cancel meeting. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LayoutC>
      <div className="space-y-6 w-full">
        <h1 className="text-3xl font-bold">My Meetings</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-semibold">{meeting.topic}</h2>
                    <p className="text-blue-600">
                      With {meeting.expert?.name || 'Unknown Expert'}
                    </p>
                    
                    <div className="flex items-center mt-2 text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{formatDate(meeting.scheduledTime)}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                    
                    <div className="mt-2">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {meeting.status === 'scheduled' && (
                      <>
                        <a
                          href={`/client/meetings/${meeting.id}`}
                          className={`px-4 py-2 ${isWithinOneHour(meeting.scheduledTime) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md transition-colors inline-flex items-center justify-center group relative`}
                          onClick={(e) => !isWithinOneHour(meeting.scheduledTime) && e.preventDefault()}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                          {!isWithinOneHour(meeting.scheduledTime) && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Meeting will be joinable 1 hour before start time
                            </span>
                          )}
                        </a>
                        
                        <button
                          onClick={() => handleCancelMeeting(meeting.id)}
                          className={`px-4 py-2 border ${isWithin24Hours(meeting.scheduledTime) ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-red-500 text-red-500 hover:bg-red-50'} rounded-md transition-colors group relative`}
                          disabled={isWithin24Hours(meeting.scheduledTime)}
                          title={isWithin24Hours(meeting.scheduledTime) ? 'Meetings cannot be cancelled within 24 hours of the scheduled time' : ''}
                        >
                          Cancel Meeting
                          {isWithin24Hours(meeting.scheduledTime) && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Cannot cancel within 24 hours
                            </span>
                          )}
                        </button>
                      </>
                    )}
                    
                    {meeting.status === 'completed' && (
                      <button
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                        onClick={() => alert('Feature coming soon!')}
                      >
                        View Recording
                      </button>
                    )}
                    
                    {meeting.status === 'cancelled' && (
                      <p className="text-gray-500 text-sm">
                        This meeting has been cancelled.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">You don&lsquo;t have any scheduled meetings.</p>
            <a 
              href="/client/experts"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
            >
              <User className="h-4 w-4 mr-2" />
              Find an Expert
            </a>
          </Card>
        )}
      </div>
    </LayoutC>
  );
}