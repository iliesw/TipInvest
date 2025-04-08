/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import ExpertLayout from './layout';
import { decodeToken } from '@/lib/auth';
import useFetch from '@/lib/fetch';

interface Meeting {
  id: string;
  clientName: string;
  scheduledTime: string;
  duration: number;
  topic: string;
  status: string;
}

interface ExpertProfile {
  id: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  profileComplete: boolean;
  totalClients?: number;
  completedSessions?: number;
}

export default function ExpertDashboard() {
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
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

    const fetchDashboardData = async () => {
      try {
        // Fetch expert profile
        const profileResponse = await useFetch.get('/expert/profile');
        const profileData = await profileResponse.json();
        
        if (profileData) {
          setProfile(profileData.profile);
        }

        // Fetch upcoming meetings
        const meetingsResponse = await useFetch.get('/expert/meetings');
        const meetingsData = await meetingsResponse.json();
        
        if (meetingsData && meetingsData.meetings) {
          // Filter for only upcoming meetings
          const upcoming = meetingsData.meetings.filter(
            (meeting: Meeting) => meeting.status === 'scheduled' && new Date(meeting.scheduledTime) > new Date()
          );
          setUpcomingMeetings(upcoming);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        alert('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

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

  return (
    <ExpertLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expert Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-2xl font-bold">{upcomingMeetings.length}</h3>
                <p className="text-gray-500">Upcoming Meetings</p>
              </Card>
              
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <Clock className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-2xl font-bold">{profile.hourlyRate} €</h3>
                <p className="text-gray-500">Hourly Rate</p>
              </Card>
              
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <Users className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-2xl font-bold">{profile?.totalClients || 0}</h3>
                <p className="text-gray-500">Total Clients</p>
              </Card>
              
              <Card className="p-6 flex flex-col items-center justify-center text-center">
                <Video className="h-8 w-8 text-red-500 mb-2" />
                <h3 className="text-2xl font-bold">{profile?.completedSessions || 0}</h3>
                <p className="text-gray-500">Completed Sessions</p>
              </Card>
            </div>

            {/* Upcoming Meetings */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting) => (
                    <Card key={meeting.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{meeting.topic}</h3>
                          <p className="text-sm text-gray-500">With {meeting.clientName}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(meeting.scheduledTime)}</span>
                            <Clock className="h-4 w-4 ml-3 mr-1" />
                            <span>{meeting.duration} minutes</span>
                          </div>
                        </div>
                        <div>
                          <a 
                            href={`/expert/video?meetingId=${meeting.id}`}
                            className={`px-4 py-2 ${isWithinOneHour(meeting.scheduledTime) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md transition-colors inline-flex items-center group relative`}
                            onClick={(e) => !isWithinOneHour(meeting.scheduledTime) && e.preventDefault()}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Call
                            {!isWithinOneHour(meeting.scheduledTime) && (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Meeting will be joinable 1 hour before start time
                              </span>
                            )}
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No upcoming meetings scheduled.</p>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                  <a href="/expert/profile" className="flex flex-col items-center">
                    <div className="rounded-full bg-blue-100 p-3 mb-3">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-medium">Update Profile</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">Edit your expertise, bio, and availability</p>
                  </a>
                </Card>
                
                <Card className="p-6 hover:bg-gray-50 cursor-pointer transition-colors">
                  <a href="/expert/meetings" className="flex flex-col items-center">
                    <div className="rounded-full bg-green-100 p-3 mb-3">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="font-medium">Manage Meetings</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">View and manage all your scheduled meetings</p>
                  </a>
                </Card>
                
              </div>
            </div>
          </>
        )}
      </div>
    </ExpertLayout>
  );
}