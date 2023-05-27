import React, { useRef, useState } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red' },
    { id: 2, x: 300, y: 200, width: 100, height: 100, color: 'blue' },
  ]);
  const [activeObjectId, setActiveObjectId] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
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

  const handleMouseDown = (e, id, handle) => {
    e.preventDefault();
    const object = objects.find((obj) => obj.id === id);
    if (object) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const offsetX = mouseX - object.x;
      const offsetY = mouseY - object.y;
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setActiveObjectId(id);
      setResizeHandle(handle);
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
            let newWidth = obj.width;
            let newHeight = obj.height;
            let newX = obj.x;
            let newY = obj.y;

            if (resizeHandle === 'move') {
              newX = mouseX - offsetX;
              newY = mouseY - offsetY;
            } else if (resizeHandle === 'topLeft') {
              newWidth = obj.width + obj.x - mouseX;
              newHeight = obj.height + obj.y - mouseY;
              newX = mouseX;
              newY = mouseY;
            } else if (resizeHandle === 'topRight') {
              newWidth = mouseX - obj.x;
              newHeight = obj.height + obj.y - mouseY;
              newY = mouseY;
            } else if (resizeHandle === 'bottomLeft') {
              newWidth = obj.width + obj.x - mouseX;
              newHeight = mouseY - obj.y;
              newX = mouseX;
            } else if (resizeHandle === 'bottomRight') {
              newWidth = mouseX - obj.x;
              newHeight = mouseY - obj.y;
            }

            return { ...obj, x: newX, y: newY, width: newWidth, height: newHeight };
          }
          return obj;
        });
      });
    }
  };

  const handleMouseUp = () => {
    setActiveObjectId(null);
    setOffsetX(0);
    setOffsetY(0);
    setResizeHandle(null);
  };

  const renderObjects = () => {
    return objects.map((obj) => (
      <div
        key={obj.id}
        draggable
        onDragStart={(e) => handleDragStart(e, obj.id)}
        onMouseDown={(e) => handleMouseDown(e, obj.id, 'move')}
        style={{
          position: 'absolute',
          left: obj.x,
          top: obj.y,
          width: obj.width,
          height: obj.height,
          background: obj.color,
          cursor: 'move',
        }}
      >
        <div
          className="resize-handle topLeft"
          onMouseDown={(e) => handleMouseDown(e, obj.id, 'topLeft')}
        />
        <div
          className="resize-handle topRight"
          onMouseDown={(e) => handleMouseDown(e, obj.id, 'topRight')}
        />
        <div
          className="resize-handle bottomLeft"
          onMouseDown={(e) => handleMouseDown(e, obj.id, 'bottomLeft')}
        />
        <div
          className="resize-handle bottomRight"
          onMouseDown={(e) => handleMouseDown(e, obj.id, 'bottomRight')}
        />
      </div>
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
