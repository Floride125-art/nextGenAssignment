import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red' },
    { id: 2, x: 300, y: 200, width: 100, height: 100, color: 'blue' },
  ]);
  const [activeObjectId, setActiveObjectId] = useState(null);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [resizing, setResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);

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

    const object = objects.find((obj) => obj.id === id);
    if (object) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const objX = object.x;
      const objY = object.y;
      const objWidth = object.width;
      const objHeight = object.height;
      const handleRadius = 10; 
      if (
        mouseX >= objX + objWidth - handleRadius &&
        mouseX <= objX + objWidth + handleRadius &&
        mouseY >= objY + objHeight - handleRadius &&
        mouseY <= objY + objHeight + handleRadius
      ) {
   
        setResizing(true);
        setResizeHandle('bottom-right');
        setDragOffsetX(objWidth - (mouseX - objX));
        setDragOffsetY(objHeight - (mouseY - objY));
      } else {
        setResizing(false);
        setResizeHandle(null);
        setDragOffsetX(mouseX - objX);
        setDragOffsetY(mouseY - objY);
      }
    }
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
            if (resizing) {
              const newWidth = mouseX - obj.x + dragOffsetX;
              const newHeight = mouseY - obj.y + dragOffsetY;
              return { ...obj, width: newWidth, height: newHeight };
            } else {
              const newX = mouseX - dragOffsetX;
              const newY = mouseY - dragOffsetY;
              return { ...obj, x: newX, y: newY };
            }
          }
          return obj;
        });
      });
    }
  };

  const handleMouseUp = () => {
    setActiveObjectId(null);
    setResizing(false);
    setResizeHandle(null);
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
          border: '1px solid black',
          boxSizing: 'border-box',
          resize: 'both',
          overflow: 'auto',
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
