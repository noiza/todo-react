import checkIcon from "./check.svg";
import archiveIcon from "./archive.svg";
import { useState } from "react";

const Task = ({task, onComplete, onEdit, onArchive}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle) {
      onEdit(task.id, newTitle);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (newTitle !== task.title) {
      setNewTitle(task.title);
    }
  };

  const editingTemplate = (
    <form className="task-edit-form" onSubmit={handleSubmit}>
      <input
        className="edit-input"
        type="text"
        value={newTitle}
        onChange={handleChange}
      />
      
      <div className="task-edit-actions">
        <button className="button-text task-edit-button-save" type="submit">Save</button>
        <button className="button-text task-edit-button-cancel" onClick={handleCancel}>Cancel</button>
      </div>
    </form>
  );

  const viewTemplate = (
    <>
      <div className="checkbox">
        <input
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={(e) => onComplete(task.id, e.target.checked)}
        />
        <label htmlFor={`task-${task.id}`}>
          <img src={checkIcon} alt="check icon" />
        </label>
      </div>

      <p
        className={task.completed ? "title completed" : "title"}
        onClick={() => setIsEditing(true)}
      >
        {task.title}
      </p>

      <div className="actions">
        <button className="button-icon" onClick={() => onArchive(task.id)}>
          <img src={archiveIcon} alt="archive icon" />
        </button>
      </div>
    </>
  );

  return (
    <div className="task">
      {isEditing ? editingTemplate : viewTemplate}
    </div>
  );
};

export default Task;
