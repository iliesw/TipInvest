"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Loader2, Search, Video, X } from 'lucide-react';
import { decodeToken } from '@/lib/auth';
import useFetch from '@/lib/fetch';

interface Meeting {
  client: any;
  id: string;
  clientName: string;
  scheduledTime: string;
  duration: number;
  topic: string;
  status: string;
}

export default function ExpertMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past', 'cancelled'

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
        const response = await useFetch.get('/expert/meetings');
        const data = await response.json();
        if (data.meetings) {
          setMeetings(data.meetings);
          setFilteredMeetings(data.meetings);
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

  useEffect(() => {
    // Apply filters and search
    let result = [...meetings];
    
    // Apply status filter
    if (filter === 'upcoming') {
      result = result.filter(meeting => 
        meeting.status === 'scheduled' && new Date(meeting.scheduledTime) > new Date()
      );
    } else if (filter === 'past') {
      result = result.filter(meeting => 
        meeting.status === 'completed' || new Date(meeting.scheduledTime) < new Date()
      );
    } else if (filter === 'cancelled') {
      result = result.filter(meeting => meeting.status === 'cancelled');
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(meeting => 
        meeting.clientName.toLowerCase().includes(term) || 
        meeting.topic.toLowerCase().includes(term)
      );
    }
    
    setFilteredMeetings(result);
  }, [meetings, filter, searchTerm]);

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

  const handleCancelMeeting = async (id: string) => {
    const meeting = meetings.find(m => m.id === id);
    if (!meeting) return;
    
    if (isWithin24Hours(meeting.scheduledTime)) {
      alert('Meetings cannot be cancelled within 24 hours of the scheduled time.');
      return;
    }
    
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    
    try {
      await useFetch.post(`/expert/meetings/${id}/cancel`, {});
      
      // Update the local state
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id ? { ...meeting, status: 'cancelled' } : meeting
        )
      );
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      alert('Failed to cancel meeting. Please try again.');
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Meetings</h1>
          
          <div className="flex space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search meetings..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Meetings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            
            <Loader2 className='animate-spin'/>
          </div>
        ) : filteredMeetings.length > 0 ? (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className={`p-4 ${meeting.status === 'cancelled' ? 'opacity-60' : ''}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{meeting.topic}</h3>
                      {meeting.status === 'cancelled' && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Cancelled
                        </span>
                      )}
                      {meeting.status === 'completed' && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">With {meeting.client.name}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(meeting.scheduledTime)}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {(
                      <>
                        <button
                          onClick={() => handleCancelMeeting(meeting.id)}
                          className={`px-3 py-1 border ${isWithin24Hours(meeting.scheduledTime) ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} rounded-md transition-colors inline-flex items-center group relative`}
                          disabled={isWithin24Hours(meeting.scheduledTime)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                          {isWithin24Hours(meeting.scheduledTime) && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Cannot cancel within 24 hours
                            </span>
                          )}
                        </button>
                        
                        <a 
                          href={`/expert/meetings/${meeting.id}`}
                          className={`px-3 py-1 ${isWithinOneHour(meeting.scheduledTime) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md transition-colors inline-flex items-center group relative`}
                          onClick={(e) => !isWithinOneHour(meeting.scheduledTime) && e.preventDefault()}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join Call
                          {!isWithinOneHour(meeting.scheduledTime) && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Meeting will be joinable 1 hour before start time
                            </span>
                          )}
                        </a>
                      </>
                    )}
                    
                    {meeting.status === 'completed' && (
                      <a 
                        href={`/expert/meetings/${meeting.id}`}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full h-full  flex items-center justify-center flex-col">
            <img src="/assets/images/undraw_notify_rnwe.svg" className="w-48 mt-48 mb-8" />
            <p className="text-gray-500">
              You have no meetings yet.
            </p>
          </div>
        )}
      </div>
    </>
  );
}