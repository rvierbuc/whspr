import React, {useState, useRef} from 'react';
import axios from 'axios';

const RecordPost = ({ audioContext }: { audioContext: BaseAudioContext }) =>{
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioSource = useRef<AudioBufferSourceNode | null>(null);
    
    const startRecording = async () => {
        try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) =>{
            if(event.data.size > 0){
                setAudioChunks((prevChunks)=>[...prevChunks, event.data])
            }
        }
        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob (audioChunks, {type: 'audio/wav'})
        }
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
    }

    const stopRecording = async () => {
        if (mediaRecorder?.current?.state === 'recording') {
        mediaRecorder.current.stop();
        setIsRecording(false);
        //stop mic access
        const tracks = mediaRecorder.current.stream.getTracks();
        tracks.forEach((track) =>{
            track.stop();
        })
          }
        };

        const playAudio = async () => {
          if (!audioChunks.length || !audioContext) {
            console.log('something was null: ', !audioChunks.length, !audioContext)
            return;
          }
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          audioContext.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              if (!audioContext) {
                console.error('audio context is null');
                return;
              }
              audioSource.current = audioContext.createBufferSource();
              audioSource.current.buffer = buffer;
              audioSource.current!.connect(audioContext.destination);
      
              audioSource.current.onended = () => {
                setIsPlaying(false);
              };
              audioSource.current.start();
              setIsPlaying(true);
            },
            (error) => {
              console.error('error playing audio: ', error);
            }
          );
        };

      const saveAudioToGoogleCloud = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          const response = await axios.post(`/upload`, formData);
          if (response.status === 200) {
            const downloadURL = response.data;
            console.log('Audio saved. Download URL:', downloadURL);
          } else {
            console.error('Error saving audio:', response.statusText);
          }
        } catch (error) {
          console.error('Error saving audio:', error);
        }
      };
    
    return(
        <div>
            <button 
            onClick={startRecording}
            disabled={isRecording}
            >Record</button>
            <button 
            onClick={playAudio}
            disabled={isPlaying || audioChunks.length === 0}
            >Playback</button>
            <button 
            onClick={stopRecording}
            disabled={!isRecording}
            >Stop</button>
            <button
            onClick={saveAudioToGoogleCloud}
            disabled={audioChunks.length === 0 || isRecording}
            >Save</button>
            <button>Delete</button>
        </div>
    )
}

module.exports = RecordPost