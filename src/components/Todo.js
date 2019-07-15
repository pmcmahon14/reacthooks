import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';

const Todo = props => {
    const [todoName, setTodoName] = useState('');
    // const [submittedTodo, setSubmittedTodo] = useState(null);
    // const [todoList, setTodoList] = useState([]);
    //   const [todoState, setTodoState] = useState({ userInput: '', todoList: [] });

    const todoListReducer = (state, action) => {
        switch (action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter(todo => todo.id !== action.payload);
            default:
                return state;
        }
    };

    const [todoList, dispatch] = useReducer(todoListReducer, []);

    useEffect(() => {
        axios.get('https://test-3e15a.firebaseio.com/todos.json').then(result => {
            console.log(result);
            const todoData = result.data;
            const todos = [];
            for (const key in todoData) {
                todos.push({ id: key, name: todoData[key].name });
            }
            dispatch({ type: 'SET', payload: todos });
        });
        return () => {
            console.log('Cleanup');
        };
    }, []);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    useEffect(() => {
        document.addEventListener('mousemove', mouseMoveHandler);
        return () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        };
    }, []);

    // useEffect(
    //   () => {
    //     if (submittedTodo) {
    //       dispatch({ type: 'ADD', payload: submittedTodo });
    //     }
    //   },
    //   [submittedTodo]
    // );

    const inputChangeHandler = event => {
        // setTodoState({
        //   userInput: event.target.value,
        //   todoList: todoState.todoList
        // });
        setTodoName(event.target.value);
    };

    const todoAddHandler = () => {
        // setTodoState({
        //   userInput: todoState.userInput,
        //   todoList: todoState.todoList.concat(todoState.userInput)
        // });

        axios
            .post('https://test-3e15a.firebaseio.com/todos.json', { name: todoName })
            .then(res => {
                setTimeout(() => {
                    const todoItem = { id: res.data.name, name: todoName };
                    dispatch({ type: 'ADD', payload: todoItem });
                }, 3000);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const todoRemoveHandler = todoId => {
        axios
            .delete(`https://test-3e15a.firebaseio.com/todos/${todoId}.json`)
            .then(res => {
                dispatch({ type: 'REMOVE', payload: todoId });
            })
            .catch(err => console.log(err));
    };

    return (
        <React.Fragment>
            <input
                type="text"
                placeholder="Todo"
                onChange={inputChangeHandler}
                value={todoName}
            />
            <button type="button" onClick={todoAddHandler}>
                Add
            </button>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
                        {todo.name}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Todo;
