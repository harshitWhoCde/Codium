import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ stream }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current && stream) {
            audioRef.current.srcObject = stream;
        }
    }, [stream]);

    return <audio ref={audioRef} autoPlay controls={false} />;
};

export default AudioPlayer;