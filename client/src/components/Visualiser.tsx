import React, { useRef, useEffect } from 'react';

interface VisualiserProps {
  audioData: number[];
}

const Visualiser: React.FC<VisualiserProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    draw();
  }, [audioData]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const height = canvas.height;
    const width = canvas.width;

    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.clearRect(0, 0, width, height);

    const sliceWidth = (width * 1.0) / audioData.length;
    let x = 0;

    context.beginPath();
    context.moveTo(0, height / 2);

    audioData.forEach((item) => {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    });

    context.lineTo(x, height / 2);
    context.stroke();
  };

  return <canvas width="500" height="100vh" ref={canvasRef} className='mt-5'/>;
};

export default Visualiser;

