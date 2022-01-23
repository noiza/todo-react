import { useState, useRef, useEffect } from "react";

const EditTaskForm = ({task, onEdit, setIsEditFormOpen}) => {
  const [newTitle, setNewTitle] = useState(task.title);
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle) {
      onEdit(task.id, newTitle);
      setIsEditFormOpen(false);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return(
    <div className="task bg-edit">
      <form className="task-edit-form" onSubmit={handleSubmit}>
        <input
          className="edit-input"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          ref={inputRef}
          onFocus={(e) => e.target.select()}
        />
        
        <div className="task-edit-actions">
          <button
            className="button-text task-edit-button-save"
            type="submit"
          >
            Save
          </button>
          <button 
            className="button-text task-edit-button-cancel"
            type="button"
            onClick={() => setIsEditFormOpen(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;
