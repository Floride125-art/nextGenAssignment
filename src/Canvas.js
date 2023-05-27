import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red' },
    { id: 2, x: 300, y: 200, width: 100, height: 100, color: 'blue' },
  ]);
  const [activeObjectId, setActiveObjectId] = useState(null);

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
    setActiveObjectId(id);
  };

  const handleMouseMove = (e) => {
    if (activeObjectId !== null) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setObjects((prevObjects) => {
        return prevObjects.map((obj) => {
          if (obj.id === activeObjectId) {
            const newWidth = mouseX - obj.x;
            const newHeight = mouseY - obj.y;
            return { ...obj, width: newWidth, height: newHeight };
          }
          return obj;
        });
      });
    }
  };

  const handleMouseUp = () => {
    setActiveObjectId(null);
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {renderObjects()}
    </div>
  );
};

export default Canvas;
