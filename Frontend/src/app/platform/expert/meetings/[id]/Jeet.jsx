import React, { useEffect, useRef } from 'react';

const JitsiMeet = ({ roomName, setter }) => {
  // Use refs to track instances and prevent duplicates
  const apiRef = useRef(null);
  const scriptRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    // Prevent multiple initializations
    if (scriptRef.current) return;
    
    // Load the external script dynamically
    const script = document.createElement('script');
    script.src = 'https://8x8.vc/vpaas-magic-cookie-6697529711ce43fea3f6664db554d3f1/external_api.js';
    script.async = true;
    scriptRef.current = script;
    document.body.appendChild(script);

    const initializeAPI = () => {
      // Only initialize if not already initialized and container exists
      if (apiRef.current || !containerRef.current) return;
      
      try {
        apiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", {
          roomName: roomName,
          parentNode: containerRef.current,
        });
        
        apiRef.current.addEventListener('videoConferenceLeft', () => {
          setter(false);
        });
      } catch (error) {
        console.error('Error initializing Jitsi API:', error);
      }
    };

    script.onload = initializeAPI;

    return () => {
      // Proper cleanup on component unmount
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
      
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [roomName, setter]);

  return <div ref={containerRef} style={{ height: '100%' }} />;
};

export default JitsiMeet;
