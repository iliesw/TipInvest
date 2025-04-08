/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Mic, MicOff, Phone, Video as VideoIcon, VideoOff, Share2 } from 'lucide-react';
import ExpertLayout from './layout';
import { useRouter } from 'next/router';
import { decodeToken, requireExpert } from '@/lib/auth';

interface Meeting {
  id: string;
  clientName: string;
  scheduledTime: string;
  duration: number;
  topic: string;
  status: string;
  notes?: string;
  meetingLink?: string;
  client?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function VideoCall() {
  const router = useRouter();
  const { meetingId } = router.query;
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [expertId, setExpertId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  // Video call states
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Ensure user is authenticated as an expert
    requireExpert(router);
    
    // Get user ID from token
    const token = localStorage.getItem('TOKENAUTH');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.id) {
        setUserId(decoded.id);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    // In a real implementation, this would fetch the expert profile from the backend
    // For now, we'll use a mock ID
    setExpertId('1');

    // In a real implementation, fetch expert profile from the API
    // useFetch.get('/expert/profile')
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.profile) {
    //       setExpertId(data.profile.id);
    //     }
    //   })
    //   .catch(err => {
    //     console.error('Error fetching expert profile:', err);
    //   });
  }, [userId]);

  useEffect(() => {
    if (!meetingId || !expertId) return;

    // In a real implementation, this would fetch meeting details from the backend
    // For now, we'll use mock data
    const mockMeeting = {
      id: meetingId as string,
      clientName: 'John Doe',
      scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      duration: 30,
      topic: 'Investment Consultation',
      status: 'scheduled',
      notes: '',
      meetingLink: `/expert/video?meetingId=${meetingId}`,
      client: {
        id: '101',
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
    };

    setMeeting(mockMeeting);
    setNotes(mockMeeting.notes || '');
    setLoading(false);

    // In a real implementation, fetch meeting details from the API
    // useFetch.get(`/expert/meetings/${meetingId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (data.meeting) {
    //       setMeeting(data.meeting);
    //       setNotes(data.meeting.notes || '');
    //     } else {
    //       setError('Meeting not found');
    //     }
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Error fetching meeting:', err);
    //     setError('Failed to load meeting details');
    //     setLoading(false);
    //   });
  }, [meetingId, expertId]);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Request access to user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // In a real implementation, you would set up WebRTC peer connection here
      // and handle signaling to connect with the client
      // For this MVP, we'll just show the local video stream
      
      setIsCallActive(true);
      
      // Start timer
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera or microphone. Please check your device permissions.');
    }
  };

  const endCall = async () => {
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Stop all tracks in the local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clean up WebRTC peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // In a real implementation, this would update the meeting status in the backend
    // try {
    //   await useFetch.put(`/expert/meetings/${meetingId}/status`, {
    //     status: 'completed',
    //     notes
    //   });
    // } catch (err) {
    //   console.error('Error updating meeting status:', err);
    // }
    
    setIsCallActive(false);
    setElapsedTime(0);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMicMuted(!audioTracks[0].enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOff(!videoTracks[0].enabled);
      }
    }
  };

  const shareMeetingLink = () => {
    if (!meeting?.meetingLink) return;
    
    // Copy meeting link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}${meeting.meetingLink}`)
      .then(() => {
        alert('Meeting link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy meeting link:', err);
        alert('Failed to copy meeting link. Please try again.');
      });
  };

  const saveNotes = async () => {
    if (!meeting) return;
    
    // In a real implementation, this would save the notes to the backend
    // try {
    //   await useFetch.put(`/expert/meetings/${meeting.id}/status`, {
    //     status: meeting.status,
    //     notes
    //   });
    //   alert('Notes saved successfully!');
    // } catch (err) {
    //   console.error('Error saving notes:', err);
    //   alert('Failed to save notes. Please try again.');
    // }
    
    alert('Notes saved successfully!'); // Mock success message
  };

  return (
    <ExpertLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Video Consultation</h1>
          
          {isCallActive && (
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <Clock className="h-4 w-4 mr-2 text-gray-600" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <Card className="p-6 text-center bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </Card>
        ) : meeting ? (
          <>
            <Card className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{meeting.topic}</h3>
                  <p className="text-sm text-gray-500">With {meeting.clientName}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(meeting.scheduledTime)}</span>
                    <span className="ml-3">{meeting.duration} minutes</span>
                  </div>
                </div>
                
                {!isCallActive && (
                  <button
                    onClick={startCall}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors inline-flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Start Call
                  </button>
                )}
              </div>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {isCallActive ? (
                    <>
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-md text-white text-sm">
                        {meeting.clientName || meeting.client?.name}
                      </div>
                    </>
                  ) : (
                    <div className="text-white text-center h-full flex flex-col justify-center items-center">
                      <VideoIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Client video will appear here when the call starts</p>
                    </div>
                  )}
                  
                  {/* Local video (small overlay) */}
                  <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-900 rounded overflow-hidden border-2 border-white">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-0.5 rounded-md text-white text-xs">
                      You (Expert)
                    </div>
                    
                    {/* Video off indicator */}
                    {isVideoOff && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90">
                        <VideoOff className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Meeting info and notes sidebar */}
              <div>
                <Card className="p-4 mb-4">
                  <h2 className="text-lg font-semibold mb-2">Client Information</h2>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-500">Name: </span>
                      <span>{meeting.clientName || meeting.client?.name || 'Unknown'}</span>
                    </div>
                    
                    {meeting.client?.email && (
                      <div>
                        <span className="font-medium text-gray-500">Email: </span>
                        <span>{meeting.client.email}</span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-500">Topic: </span>
                      <span>{meeting.topic}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span>{formatDate(meeting.scheduledTime)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span>{meeting.duration} minutes</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-2">Meeting Notes</h2>
                  
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Take notes during your consultation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                  
                  <button
                    onClick={saveNotes}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full text-sm"
                  >
                    Save Notes
                  </button>
                </Card>
              </div>
            </div>
            
            {isCallActive && (
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={toggleMic}
                  className={`p-4 rounded-full ${isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMicMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                  title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                >
                  {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <VideoIcon className="h-6 w-6" />}
                </button>
                
                <button
                  onClick={shareMeetingLink}
                  className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  title="Share meeting link"
                >
                  <Share2 className="h-6 w-6" />
                </button>
                
                <button
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  title="End call"
                >
                  <Phone className="h-6 w-6 text-white transform rotate-135" />
                </button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Meeting not found or has been cancelled.</p>
            <a 
              href="/expert/meetings"
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Meetings
            </a>
          </Card>
        )}
      </div>
    </ExpertLayout>
  );
}