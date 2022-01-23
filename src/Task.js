import checkIcon from "./check.svg";
import archiveIcon from "./archive.svg";

const Task = ({task, onComplete, onOpenEditForm, onArchive}) => {

  return (
    <div className="task cursor-pointer" onClick={() => onOpenEditForm(task.id)}>
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
      >
        {task.title}
      </p>

      <div className="actions">
        <button className="button-icon" onClick={() => onArchive(task.id)}>
          <img src={archiveIcon} alt="archive icon" />
        </button>
      </div>
    </div>
  );
};

export default Task;
