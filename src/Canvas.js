import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red' },
    { id: 2, x: 300, y: 200, width: 100, height: 100, color: 'blue' },
  ]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const object = objects.find((obj) => obj.id === parseInt(id));
    if (object) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - object.width / 2;
      const y = e.clientY - rect.top - object.height / 2;
      setObjects((prevObjects) => {
        return prevObjects.map((obj) => {
          if (obj.id === parseInt(id)) {
            return { ...obj, x, y };
          }
          return obj;
        });
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    let startX = e.clientX;
    let startY = e.clientY;
    const object = objects.find((obj) => obj.id === parseInt(id));
    if (object) {
      const handleMouseMove = (e) => {
        const newX = object.x + (e.clientX - startX);
        const newY = object.y + (e.clientY - startY);
        setObjects((prevObjects) => {
          return prevObjects.map((obj) => {
            if (obj.id === parseInt(id)) {
              return { ...obj, x: newX, y: newY };
            }
            return obj;
          });
        });
        startX = e.clientX;
        startY = e.clientY;
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const renderObjects = () => {
    return objects.map((obj) => (
      <div
        key={obj.id}
        draggable
        onDragStart={(e) => handleDragStart(e, obj.id)}
        onMouseDown={(e) => handleMouseDown(e, obj.id)}
        style={{
          position: 'absolute',
          left: obj.x,
          top: obj.y,
          width: obj.width,
          height: obj.height,
          background: obj.color,
          cursor: 'move',
        }}
      />
    ));
  };

  return (
    <div
      ref={canvasRef}
      style={{ position: 'relative', width: '800px', height: '600px', border: '1px solid black' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {renderObjects()}
    </div>
  );
};

export default Canvas;
