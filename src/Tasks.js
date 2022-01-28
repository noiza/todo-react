import { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import ArchivedTask from "./ArchivedTask";
import EditTaskForm from "./EditTaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState(null);
  const [showArchivedTasks, setShowArchivedTasks] = useState(true);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false); // todo: to store a showCompletedTasks value on the server
  const [showTodayTasks, setShowTodayTasks] = useState(false); // todo: to store a showTodayTasks value on the server
  const [popperIsOpen, setPopperIsOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [editTaskId, setEditTaskId] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const getTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return today = mm + '/' + dd + '/' + yyyy;    
  };
  const todayDate = getTodayDate();

  useEffect(() => {
    axios.get("http://localhost:3001/tasks/").then(({ data }) => {
      setTasks(data);
    });
  }, [showCompletedTasks, showTodayTasks]);

  // onKeyDownHandler adds a new task by Enter
  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {

      if (newTaskTitle) {
        const id = Math.floor(Math.random() * 1000) + 1;
        const newTask = { id, title: newTaskTitle, date: todayDate, completed: false };
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');

        axios.post("http://localhost:3001/tasks/", newTask).catch(() => {
          alert("Error while adding the task.");
        });
      }
    }
  };

  const editTask = (id, newTitle) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );

    axios
      .patch("http://localhost:3001/tasks/" + id, {
        title: newTitle,
      })
      .catch(() => {
        alert("Error while editing the task.");
      });
  };

  const openEditForm = (id) => {
    if (id) {
      setEditTaskId(id);
      setIsEditFormOpen(true);
    }
  };

  const completeTask = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    axios
      .patch("http://localhost:3001/tasks/" + id, {
        completed: status,
      })
      .catch(() => {
        alert("Error while completing the task.");
      });
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure?")) {
      setTasks(tasks.filter((task) => task.id !== id));
      axios.delete("http://localhost:3001/tasks/" + id).catch(() => {
        alert("Error while deleting the task.");
      });
    }
  };

  const archiveTask = (id) => {
    setTasks(tasks.map(task => task.id !== id ? task : {...task, archive: true}));
    axios
      .patch("http://localhost:3001/tasks/" + id, {
        archive: true,
      })
      .catch(() => {
        alert("Error while archiving the task.");
      });
  };

  const unarchiveTask = (id) => {
    setTasks(tasks.map(task => task.id !== id ? task : {...task, archive: false}));
    axios
      .patch("http://localhost:3001/tasks/" + id, {
        archive: false,
      })
      .catch(() => {
        alert("Error while archiving the task.");
      });
  };

  var archivedTasks = tasks && tasks.filter(x => x.archive);
  var activeTasks = tasks && tasks
    .filter(x => !x.archive)
    .filter(x => showCompletedTasks || !x.completed)
    .filter(x => !showTodayTasks || x.date === todayDate);

  activeTasks && activeTasks.sort((x, y) => {
    if (x.completed === y.completed) {
      return 0;
    }
    if (x.completed) {
      return 1;
    }
    return -1;
  });

  return (
    <>
      <div className="header">
        <div className="header-top">
          <h2>to do:</h2>

          <div className="popper-wrap">
            <button className="popper-btn" onClick={() => setPopperIsOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15 14.5a2 2 0 011.936 1.498L19.5 16a.5.5 0 010 1l-2.563.001a2.001 2.001 0 01-3.874 0L4.5 17a.5.5 0 010-1l8.564-.002A2 2 0 0115 14.5zm-.982 1.81l.005-.025-.005.026-.003.014-.004.025-.007.061A.897.897 0 0014 16.5l.008.125.007.047-.001.002.003.014.006.024h-.001l.004.018.016.058.007.021.004.013.009.026.013.033.012.027-.011-.026.019.043-.008-.017.029.06-.018-.037.048.09a1 1 0 001.784-.155l.015-.039.006-.018-.015.039.022-.06-.001-.001.016-.057.004-.018.005-.024.001-.006v-.001l.005-.033.008-.06A.877.877 0 0016 16.5l-.008-.124-.007-.051-.001-.001-.003-.014-.01-.047-.004-.016-.007-.024-.01-.034-.004-.012-.01-.03-.006-.013-.007-.017-.01-.026a.998.998 0 00-1.843.043l-.014.034-.007.022-.014.047-.002.009v.001l-.005.016-.01.047zM9 9.5a2 2 0 011.936 1.498L19.5 11a.5.5 0 010 1l-8.563.001a2.001 2.001 0 01-3.874 0L4.5 12a.5.5 0 010-1l2.564-.002A2 2 0 019 9.5zm0 1a.998.998 0 00-.93.634l-.014.034-.007.022-.014.047-.002.009v.001l-.005.016-.01.047.005-.025-.005.026-.003.014-.004.025-.007.061C8 11.441 8 11.471 8 11.5l.008.125.007.047-.001.002.003.014.006.024h-.001l.004.018.016.058.007.021.004.013.009.026.013.033.012.027-.011-.026.019.043-.008-.017.029.06-.018-.037.048.09a1 1 0 001.784-.155l.015-.039.006-.018-.015.039.022-.06-.001-.001.016-.057.004-.018.005-.024.001-.006v-.001l.005-.033.008-.06A.877.877 0 0010 11.5l-.008-.124-.007-.051-.001-.001-.003-.014-.01-.047-.004-.016-.007-.024-.01-.034-.004-.012-.01-.03-.006-.013-.007-.017-.01-.026A1.002 1.002 0 009 10.5zm6-6a2 2 0 011.936 1.498L19.5 6a.5.5 0 010 1l-2.563.001a2.001 2.001 0 01-3.874 0L4.5 7a.5.5 0 010-1l8.564-.002A2 2 0 0115 4.5zm0 1a.998.998 0 00-.93.634l-.014.034-.007.022-.014.047-.002.009v.001l-.005.016-.01.047.005-.025-.005.026-.003.014-.004.025-.007.061C14 6.441 14 6.471 14 6.5l.008.125.007.047-.001.002.003.014.006.024h-.001l.004.018.016.058.007.021.004.013.009.026.013.033.012.027-.011-.026.019.043-.008-.017.029.06-.018-.037.048.09a1 1 0 001.784-.155l.015-.039.006-.018-.015.039.022-.06-.001-.001.016-.057.004-.018.005-.024.001-.006v-.001l.005-.033.008-.06C16 6.557 16 6.528 16 6.5l-.008-.124-.007-.051-.001-.001-.003-.014-.01-.047-.004-.016-.007-.024-.01-.034-.004-.012-.01-.03-.006-.013-.007-.017-.01-.026A1.002 1.002 0 0015 5.5z" fill="currentColor"></path>
              </svg>
            </button>

            { popperIsOpen &&  
              <div className="popper">
                <div className="popper-top">
                  <h4>Filter</h4>
                  <button className="popper-btn" onClick={() => setPopperIsOpen(false)}>
                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.41421 7L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L7 8.41421L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7Z" fill="currentColor"></path></svg>
                  </button>
                </div>

                <div className="popper-section">
                  <input 
                    type="checkbox"
                    id="showTasksForToday"
                    checked={showTodayTasks}
                    onChange={(e) => setShowTodayTasks(e.target.checked)}
                  />
                  <label htmlFor="showTasksForToday">Show today's tasks only</label>
                </div>

                <div className="popper-section">
                  <input 
                    type="checkbox"
                    id="showCompletedTasks"
                    checked={showCompletedTasks}
                    onChange={(e) => setShowCompletedTasks(e.target.checked)}
                  />
                  <label htmlFor="showCompletedTasks">Show completed tasks</label>
                </div>

                <div className="popper-section">
                  <input 
                    type="checkbox"
                    id="showArchivedTasks"
                    checked={showArchivedTasks}
                    onChange={(e) => setShowArchivedTasks(e.target.checked)}
                  />
                  <label htmlFor="showArchivedTasks">Show archived tasks</label>
                </div>
              </div>
            }

          </div>
        </div>

        <input 
          className="edit-input"
          type="text"
          placeholder="Add a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={onKeyDownHandler}
        />

        <h3>{showTodayTasks ? "Today" : "All"} ({activeTasks && activeTasks.length || 0}):</h3>
      </div>

      <DragDropContext>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div className="tasks task-list" {...provided.droppableProps} ref={provided.innerRef}>
              {activeTasks && activeTasks.length > 0 ? (
                activeTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.title} index={index}>
                    {(provided) => (
                      <div 
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        {isEditFormOpen && task.id === editTaskId ?
                          <EditTaskForm
                            task={task}
                            onEdit={editTask}
                            setIsEditFormOpen={setIsEditFormOpen}
                          />
                            :
                          <Task
                            task={task}
                            onComplete={completeTask}
                            onOpenEditForm={openEditForm}
                            onDelete={deleteTask}
                            onArchive={archiveTask}
                          />
                        }
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="no-tasks">
                  <h3>No tasks found</h3>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {showArchivedTasks &&
        <div>
          <div className="header">
            <h3>Archived ({archivedTasks && archivedTasks.length || 0}):</h3>
          </div>
          
          <div className="tasks">
            {archivedTasks && archivedTasks.length ? (
              archivedTasks
                .map((task) => (
                <ArchivedTask 
                  task={task} 
                  key={task.id}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  onUnarchive={unarchiveTask}
                />
              ))
            ) : (
              <div className="no-tasks">
                <h3>No archived tasks</h3>
              </div>
            )}
          </div>
        </div>
      }

      
    </>
  );
};

export default Tasks;
