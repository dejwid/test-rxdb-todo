'use client';
import { use, useEffect, useState } from "react";
import { db } from "~/db";

export default function TodosList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    db.todos.find().exec().then((todos) => {
      setTodos([...todos.map(d => d.name)]);
    });
  }, []);

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTodos([...todos, input]);
    db.todos.insert({
      id: Date.now().toString(),
      name: input,
      done: false,
      timestamp: new Date().toISOString(),
    }).then(() => {
      console.log("todo added");
    });
    setInput("");
  }

  return (
    <div className="p-4">
      <h1>Todos</h1>
      <p>This is the todos page.</p>
      {todos.map((todo) => (
        <div key={todo}>{todo}</div>
      ))}
      <form 
        onSubmit={addTodo}
        className="flex gap-4">
        <input
          type="text"
          placeholder="Add todo" 
          className="p-2 border-2 border-gray-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          type="submit"
          className="p-2 border-2 border-gray-300 cursor-pointer" 
        >
          Add
        </button>
      </form>
    </div>
  );
}