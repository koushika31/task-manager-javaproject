import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '' });
  const [suggestion, setSuggestion] = useState('');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Voice input for task title
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event) => {
      setForm(form => ({ ...form, title: event.results[0][0].transcript }));
    };
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      category: form.categoryId ? { id: parseInt(form.categoryId) } : null
    };
    axios.post('http://localhost:8080/api/tasks', payload)
      .then(() => {
        setForm({ title: '', description: '', categoryId: '' });
        fetchTasks();
      })
      .catch(error => alert('Error creating task: ' + error));
  };

  const markCompleted = (task) => {
    axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
      ...task,
      completed: true,
      category: task.category ? { id: task.category.id } : null
    })
      .then(fetchTasks)
      .catch(error => alert('Error updating task: ' + error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:8080/api/tasks/${id}`)
      .then(fetchTasks)
      .catch(error => alert('Error deleting task: ' + error));
  };

  // AI-powered task suggestion using OpenAI API
  const getTaskSuggestion = async () => {
    setLoadingSuggestion(true);
    setSuggestion('');
    const prompt = `Suggest a new productive task for someone who already has these tasks: ${tasks.map(t => t.title).join(', ')}.`;
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-...MHMA' // <-- Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt,
          max_tokens: 30
        })
      });
      const data = await response.json();
      setSuggestion(data.choices[0].text.trim());
    } catch (error) {
      setSuggestion('Error getting suggestion.');
    }
    setLoadingSuggestion(false);
  };

  return (
    <div className="app-container">
      <h1>Task Management System</h1>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <button type="button" onClick={handleVoiceInput} title="Speak task title" style={{marginLeft: 5}}>
          🎤
        </button>
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">Add Task</button>
        <button type="button" onClick={getTaskSuggestion} style={{marginLeft: 10}}>
          Suggest Task (AI)
        </button>
      </form>

      {loadingSuggestion && <div style={{marginTop: 10, color: '#2563eb'}}>Loading suggestion...</div>}
      {suggestion && (
        <div style={{marginTop: 10, color: '#2563eb'}}>
          <b>AI Suggestion:</b> {suggestion}
        </div>
      )}

      <h2>Tasks</h2>
      <ul>
        {tasks.length === 0 && <li>No tasks found.</li>}
        {tasks.map(task => (
          <li key={task.id}>
            <div className="task-info">
              <span className={`task-title${task.completed ? ' completed' : ''}`}>{task.title}</span>
              {task.category && (
                <span className="task-category">{task.category.name}</span>
              )}
              <div style={{ fontSize: '0.95em', color: '#64748b' }}>{task.description}</div>
            </div>
            <div className="task-actions">
              {!task.completed && (
                <button className="complete-btn" onClick={() => markCompleted(task)}>
                  Mark Completed
                </button>
              )}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;