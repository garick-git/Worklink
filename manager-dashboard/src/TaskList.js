import React, { useState, useEffect } from 'react';
import TaskDetails from './TaskDetails';
import { FaTimes } from 'react-icons/fa';

const TaskList = ({ tasks, borderColor, permissionLevel }) => {
  const [taskDetailsIsOpen, setTaskDetailsIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const tableStyle = {
    marginLeft: '30%',
    transform: 'translateX(-50%)',
    marginTop: '10px',
    border: `4px solid ${borderColor}`,
  };

  useEffect(() => {
    console.log('tasks: ', tasks);
  }, [])
  useEffect(() => {
    if(selectedTask){
      setTaskDetailsIsOpen(true);
    }
}, [selectedTask]); 

  useEffect(() => {
    if(permissionLevel == 1) {
      setIsManager(true);
    }
    else{
      setIsManager(false);
    }
  }, [permissionLevel]);

  // FUNCTIONS:
  const handleRowClick = (task) => {
    setSelectedTask(task);
    setTaskDetailsIsOpen(true);
}

  const handleCloseForm = () => {
    setTaskDetailsIsOpen(false);
  }

  const formatReadableDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      {taskDetailsIsOpen && (
      <div className="task-details-div">
          <TaskDetails selectedTask={selectedTask} isManager={isManager}/>
          <span className="close-icon" id='close-task-details' onClick={handleCloseForm}>
                    <FaTimes />
                </span>
          </div>
        )}

      <table style={tableStyle} className={`tasks-table ${borderColor === '#4092f6' ? 'tasks-border-blue' : 'tasks-border-black'}`}>
        <thead>
          <tr>
            <th className='tasks-column-lbl'>ID</th>
            <th className='tasks-column-lbl'>Task</th>
            <th className='tasks-column-lbl'>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr className='task-id-rows' key={task.id} onClick={() => handleRowClick(task)}>
              <td id='task-id-column'>{task.id}</td>
              <td id='task-name-column'>{task.name}</td>
              <td id='task-deadline-column'>{formatReadableDate(task.deadline)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;