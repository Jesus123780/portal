
export const getItemStyle = (isDragging, draggableStyle) => ({
  boxShadow: isDragging ? "0px 2px 3px rgba(0,0,0,0.2)" : "none",
    userSelect: 'none',
    margin: `5px 15px`,
    background: isDragging ? '#ba1313f2' : '#ffffff',
    color: isDragging ? '#ffffff' : '#6e6e73',
    ...draggableStyle
  });