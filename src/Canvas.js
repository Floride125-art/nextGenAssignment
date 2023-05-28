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
  const [resizeHandle, setResizeHandle] = useState('');

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

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const object = objects.find((obj) => obj.id === id);
    const objectX = object.x;
    const objectY = object.y;
    const objectWidth = object.width;
    const objectHeight = object.height;

    const resizeHandles = {
      topLeft: { x: objectX, y: objectY },
      topRight: { x: objectX + objectWidth, y: objectY },
      bottomLeft: { x: objectX, y: objectY + objectHeight },
      bottomRight: { x: objectX + objectWidth, y: objectY + objectHeight },
    };

    if (isWithinResizeHandle(mouseX, mouseY, resizeHandles.topLeft)) {
      setResizing(true);
      setResizeHandle('topLeft');
    } else if (isWithinResizeHandle(mouseX, mouseY, resizeHandles.topRight)) {
      setResizing(true);
      setResizeHandle('topRight');
    } else if (isWithinResizeHandle(mouseX, mouseY, resizeHandles.bottomLeft)) {
      setResizing(true);
      setResizeHandle('bottomLeft');
    } else if (isWithinResizeHandle(mouseX, mouseY, resizeHandles.bottomRight)) {
      setResizing(true);
      setResizeHandle('bottomRight');
    } else {
      setDragOffsetX(mouseX - objectX);
      setDragOffsetY(mouseY - objectY);
      setResizing(false);
      setResizeHandle('');
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
              return resizeObject(obj, mouseX, mouseY);
            } else {
              return moveObject(obj, mouseX, mouseY);
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
    setResizeHandle('');
  };

  const isWithinResizeHandle = (x, y, handle) => {
    const handleSize = 8; 
    return x >= handle.x - handleSize && x <= handle.x + handleSize && y >= handle.y - handleSize && y <= handle.y + handleSize;
  };

  const resizeObject = (obj, mouseX, mouseY) => {
    const objectX = obj.x;
    const objectY = obj.y;
    const objectWidth = obj.width;
    const objectHeight = obj.height;

    let newWidth = objectWidth;
    let newHeight = objectHeight;

    switch (resizeHandle) {
      case 'topLeft':
        newWidth = objectX + objectWidth - mouseX;
        newHeight = objectY + objectHeight - mouseY;
        return { ...obj, x: mouseX, y: mouseY, width: newWidth, height: newHeight };
      case 'topRight':
        newWidth = mouseX - objectX;
        newHeight = objectY + objectHeight - mouseY;
        return { ...obj, y: mouseY, width: newWidth, height: newHeight };
      case 'bottomLeft':
        newWidth = objectX + objectWidth - mouseX;
        newHeight = mouseY - objectY;
        return { ...obj, x: mouseX, width: newWidth, height: newHeight };
      case 'bottomRight':
        newWidth = mouseX - objectX;
        newHeight = mouseY - objectY;
        return { ...obj, width: newWidth, height: newHeight };
      default:
        return obj;
    }
  };

  const moveObject = (obj, mouseX, mouseY) => {
    return { ...obj, x: mouseX - dragOffsetX, y: mouseY - dragOffsetY };
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
          cursor: resizing ? getResizeCursor() : 'move',
          border: resizing ? '1px dashed black' : 'none',
        }}
      >
        {resizing && renderResizeHandles(obj)}
      </div>
    ));
  };

  const getResizeCursor = () => {
    switch (resizeHandle) {
      case 'topLeft':
      case 'bottomRight':
        return 'nwse-resize';
      case 'topRight':
      case 'bottomLeft':
        return 'nesw-resize';
      default:
        return 'auto';
    }
  };

  const renderResizeHandles = (obj) => {
    const handleSize = 8; 

    return (
      <>
        <div
          style={{
            position: 'absolute',
            left: obj.x - handleSize / 2,
            top: obj.y - handleSize / 2,
            width: handleSize,
            height: handleSize,
            background: 'white',
            border: '1px solid black',
            cursor: 'nwse-resize',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: obj.x + obj.width - handleSize / 2,
            top: obj.y - handleSize / 2,
            width: handleSize,
            height: handleSize,
            background: 'white',
            border: '1px solid black',
            cursor: 'nesw-resize',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: obj.x - handleSize / 2,
            top: obj.y + obj.height - handleSize / 2,
            width: handleSize,
            height: handleSize,
            background: 'white',
            border: '1px solid black',
            cursor: 'nesw-resize',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: obj.x + obj.width - handleSize / 2,
            top: obj.y + obj.height - handleSize / 2,
            width: handleSize,
            height: handleSize,
            background: 'white',
            border: '1px solid black',
            cursor: 'nwse-resize',
          }}
        />
      </>
    );
  };

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'relative',
        width: '800px',
        height: '600px',
        border: '1px solid black',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
      }}
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
