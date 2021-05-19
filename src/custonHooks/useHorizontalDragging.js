import { useState, useRef, useEffect } from "react";

/* 
customized solution from:
https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
*/

export function useHorizontalDragging(videoModel, dragCorrecter = 0) {
  const [isDragging, setIsDragging] = useState(false);
  const [x, setX] = useState(0);

  const ref = useRef(null);

  function onMouseMove(e) {
    if (!isDragging) {
      return;
    }

    setX(e.x - videoModel.dragClickX + dragCorrecter);

    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseUp(e) {
    setIsDragging(false);
    delete videoModel.dragClickX;
    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseDown(e) {
    if (e.button !== 0) {
      return;
    }

    setIsDragging(true);

    let draggedRect = ref.current.getBoundingClientRect();

    // if you click 15px from left brim of the dragged tag to start drag, this value will be 15;
    // I can't use it as state because I reset it on each custom state call that happens tens of times per second
    // plus I don't need dragClickX as state outside
    videoModel.dragClickX = e.x - draggedRect.left;

    e.stopPropagation();
    e.preventDefault();
  }

  // When the element mounts, attach an mousedown listener
  useEffect(() => {
    ref.current.addEventListener("mousedown", onMouseDown);

    return () => {
      ref.current?.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref.current]);

  // Every time the isDragging state changes, assign or remove
  // the corresponding mousemove and mouseup handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isDragging]);

  return [ref, x, isDragging];
}
