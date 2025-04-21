/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useFetch, { Server } from '@/lib/fetch';
import { saveToken } from '@/pages/api/set-cookie';
import { CircleDashedIcon, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Vérifier si le token est disponible (après le chargement de la page)
    if (token) {
      verifyEmail(token as string);
    }
  }, [token]);

  // Compte à rebours pour la redirection après succès
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push('/client');
    }
  }, [status, countdown, router]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await useFetch.get(`/auth/verify-email?token=${verificationToken}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
  
      if (response.ok && !data.error) {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
  
        if (data.token) {
          await saveToken(data.token);
          localStorage.setItem('TOKENAUTH', data.token);
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Email verification failed');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h1>
          
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CircleDashedIcon className="h-16 w-16 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <p className="text-gray-800 font-medium mb-2">{message}</p>
              <p className="text-gray-600 mb-6">Your account is now active!</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-gray-800 font-medium mb-2">Verification Failed</p>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <button 
                onClick={() => router.push('/')} 
                className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}