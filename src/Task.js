import checkIcon from "./check.svg";
import editIcon from "./edit.svg";
import deleteIcon from "./delete.svg";

const Task = ({task, onComplete, onEdit, onDelete}) => {
  return (
    <div className="task">
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

      <p className={task.completed ? "title completed" : "title"}>
        {task.title}
      </p>

      <div className="actions">
        <button onClick={() => onEdit(task.id, task.title)}>
          <img src={editIcon} alt="edit icon" />
        </button>
        <button onClick={() => onDelete(task.id)}>
          <img src={deleteIcon} alt="delete icon" />
        </button>
      </div>
    </div>
  );
};

export default Task;
