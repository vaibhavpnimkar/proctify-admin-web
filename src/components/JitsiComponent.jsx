// ProctorComponent.js
import React, { useEffect } from 'react';

const JitsiComponent = () => {
  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  useEffect(() => {
    const domain = 'meet.jit.si';
    const roomName = 'your-room-name'; // Replace with your desired room name
    const options = {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: document.getElementById('jitsi-proctor-container'),
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        noJoinButtons: true, // Hide the "Join" button
        

      },
      interfaceConfigOverwrite: {
        filmStripOnly: false,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    // Provide controls to students
    api.executeCommand('toggleFilmStrip');
    api.executeCommand('toggleTileView');

    return () => {
      api.dispose();
    };
  }, []);

  return (
    <div>
      <div id="jitsi-proctor-container" style={containerStyle}></div>
    </div>
  );
};

export default JitsiComponent;
