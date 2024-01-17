import React, { useRef, useEffect } from 'react';

const Visualiser = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    draw();
  }, [props.audioData]); // Update the useEffect dependency to include audioData

  const draw = () => {
    const { audioData } = props;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const height = canvas.height;
    const width = canvas.width;
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  };

  return <canvas width="500" height="500" ref={canvasRef} />;
};

export default Visualiser;
