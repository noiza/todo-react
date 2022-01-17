import checkIcon from "./check.svg";
import unarchiveIcon from "./unarchive.svg";
import deleteIcon from "./delete.svg";

const ArchivedTask = ({task, onComplete, onDelete, onUnarchive}) => {

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

      <p className={task.completed ? "title completed" : "title"}>{task.title}</p>
      
      <div className="actions">
        <button className="button-icon" onClick={() => onDelete(task.id)}>
          <img src={deleteIcon} alt="delete icon" />
        </button>
        <button className="button-icon" onClick={() => onUnarchive(task.id)}>
          <img src={unarchiveIcon} alt="archive icon" />
        </button>
      </div>
    </div>
  );
};

export default ArchivedTask;
