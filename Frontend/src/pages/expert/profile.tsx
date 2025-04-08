import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import ExpertLayout from './layout';
import { decodeToken } from '@/lib/auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X, Clock, Check, User } from 'lucide-react';
import useFetch from '@/lib/fetch';
import { uploadProfilePicture } from '@/lib/api/expert';

interface ExpertProfile {
  id?: string;
  userId?: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  profilePicture?: string;
  availability: {
    monday: boolean[];
    tuesday: boolean[];
    wednesday: boolean[];
    thursday: boolean[];
    friday: boolean[];
    saturday: boolean[];
    sunday: boolean[];
  };
}

export default function ExpertProfilePage() {
  const [profile, setProfile] = useState<ExpertProfile>({
    specialization: '',
    bio: '',
    hourlyRate: 0,
    availability: {
      monday: Array(24).fill(false),
      tuesday: Array(24).fill(false),
      wednesday: Array(24).fill(false),
      thursday: Array(24).fill(false),
      friday: Array(24).fill(false),
      saturday: Array(24).fill(false),
      sunday: Array(24).fill(false),
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const fetchProfile = async () => {
      try {
        const response = await useFetch.get('/expert/profile');
        const data = await response.json();
        
        if (response.ok && data.profile) {
          setProfile(data.profile);
        }
        // If profile doesn't exist, we'll just use the default empty profile state
        // This allows the user to create their profile
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Only show error message for unexpected errors, not for 404 (profile not found)
        if (error instanceof Error && error.message !== 'Failed to fetch profile') {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? parseFloat(value) : value
    }));
  };

  const handleAvailabilityChange = (day: string, hour: number) => {
    setProfile(prev => {
      const newAvailability = { ...prev.availability };
      newAvailability[day as keyof typeof newAvailability][hour] = !newAvailability[day as keyof typeof newAvailability][hour];
      return { ...prev, availability: newAvailability };
    });
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Create a temporary URL for preview
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);

        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result?.toString();
          if (base64String) {
            try {
              const { profilePictureUrl } = await uploadProfilePicture(base64String);
              setProfile(prev => ({
                ...prev,
                profilePicture: profilePictureUrl
              }));
            } catch (error) {
              console.error('Error uploading profile picture:', error);
              alert('Failed to upload profile picture');
              setProfileImage(profile?.profilePicture || null);
            }
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture');
        setProfileImage(profile?.profilePicture || null);
      }
    }
  };

  const handleProfileImageClick = () => {
    // Trigger the hidden file input when the avatar is clicked
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfile(prev => ({
      ...prev,
      profilePicture: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const setAvailabilityPreset = (preset: string) => {
    setProfile(prev => {
      const newAvailability = { ...prev.availability };
      
      // Reset all availability first
      Object.keys(newAvailability).forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = Array(24).fill(false);
      });
      
      // Set availability based on preset
      if (preset === 'weekdays-9-5') {
        // Monday to Friday, 9AM to 5PM
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          for (let hour = 9; hour < 17; hour++) {
            newAvailability[day as keyof typeof newAvailability][hour] = true;
          }
        });
      } else if (preset === 'weekdays-evenings') {
        // Monday to Friday, 6PM to 10PM
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          for (let hour = 18; hour < 22; hour++) {
            newAvailability[day as keyof typeof newAvailability][hour] = true;
          }
        });
      } else if (preset === 'weekends') {
        // Saturday and Sunday, 9AM to 6PM
        ['saturday', 'sunday'].forEach(day => {
          for (let hour = 9; hour < 18; hour++) {
            newAvailability[day as keyof typeof newAvailability][hour] = true;
          }
        });
      }
      
      return { ...prev, availability: newAvailability };
    });
  };

  const toggleFullDay = (day: string) => {
    setProfile(prev => {
      const dayAvailability = prev.availability[day as keyof typeof prev.availability];
      const allActive = dayAvailability.every(hour => hour);
      
      // Toggle: if all hours are active, deactivate all; otherwise, activate all
      const newDayAvailability = Array(24).fill(!allActive);
      
      const newAvailability = { ...prev.availability };
      newAvailability[day as keyof typeof newAvailability] = newDayAvailability;
      
      return { ...prev, availability: newAvailability };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await useFetch.post('/expert/profile', {
        specialization: profile.specialization,
        bio: profile.bio,
        hourlyRate: profile.hourlyRate,
        profilePicture: profile.profilePicture,
        availability: profile.availability
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setSuccessMessage('Profile saved successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <ExpertLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Expert Profile</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="mb-6 flex items-center">
                <div className="relative">
                  <Avatar 
                    className="h-24 w-24 cursor-pointer border-2 border-gray-200" 
                    onClick={handleProfileImageClick}
                  >
                    {profileImage || profile.profilePicture ? (
                      <AvatarImage src={profileImage || profile.profilePicture} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-700">Profile Picture</h3>
                  <p className="text-xs text-gray-500">Upload a professional photo</p>
                  {(profileImage || profile.profilePicture) && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="mt-2 text-xs text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Real Estate Investment, Property Valuation"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell clients about your expertise, experience, and qualifications..."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (€)
                  </label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={profile.hourlyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              <p className="text-sm text-gray-500 mb-4">Select the hours you&apos;re available for video consultations.</p>
              
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Quick Selection</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAvailabilityPreset('weekdays-9-5')}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Weekdays 9AM-5PM
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAvailabilityPreset('weekdays-evenings')}
                    className="px-3 py-2 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Weekday Evenings
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAvailabilityPreset('weekends')}
                    className="px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Weekends
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">All Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Morning</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afternoon</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evening</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {days.map(day => {
                      const dayAvailability = profile.availability[day as keyof typeof profile.availability];
                      const morningHours = dayAvailability.slice(6, 12);
                      const afternoonHours = dayAvailability.slice(12, 18);
                      const eveningHours = dayAvailability.slice(18, 24);
                      const allActive = dayAvailability.every(hour => hour);
                      
                      return (
                        <tr key={day}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 capitalize">{day}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => toggleFullDay(day)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${allActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {allActive ? (
                                <>
                                  <Check className="mr-1 h-3 w-3" />
                                  Available
                                </>
                              ) : (
                                'Set Available'
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {morningHours.map((isAvailable, idx) => {
                                const hour = idx + 6;
                                return (
                                  <button
                                    key={`${day}-morning-${hour}`}
                                    type="button"
                                    onClick={() => handleAvailabilityChange(day, hour)}
                                    className={`w-10 h-8 text-xs rounded ${isAvailable ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    {hour}:00
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {afternoonHours.map((isAvailable, idx) => {
                                const hour = idx + 12;
                                return (
                                  <button
                                    key={`${day}-afternoon-${hour}`}
                                    type="button"
                                    onClick={() => handleAvailabilityChange(day, hour)}
                                    className={`w-10 h-8 text-xs rounded ${isAvailable ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    {hour}:00
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {eveningHours.map((isAvailable, idx) => {
                                const hour = idx + 18;
                                return (
                                  <button
                                    key={`${day}-evening-${hour}`}
                                    type="button"
                                    onClick={() => handleAvailabilityChange(day, hour)}
                                    className={`w-10 h-8 text-xs rounded ${isAvailable ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                  >
                                    {hour}:00
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </ExpertLayout>
  );
}