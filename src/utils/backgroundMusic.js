import React, { useState, useEffect } from 'react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false); // Initially, the music is not playing

  useEffect(() => {
    const audio = document.getElementById("backgroundAudio");
    if (audio) {
      audio.volume = 0.1; // Set volume to 10%
    }
  }, []);

  const togglePlay = () => {
    const audio = document.getElementById("backgroundAudio");
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio id="backgroundAudio" loop>
        <source src="/audio/background.mp3" type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
      <button className="background-music" onClick={togglePlay}>
        {isPlaying ? (
          <span className="material-symbols-outlined">volume_up</span>
        ) : (
          <span className="material-symbols-outlined">volume_off</span>
        )}
      </button>
    </>
  );
};

export default BackgroundMusic;