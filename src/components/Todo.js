import React, {useState} from 'react';

const todo = props => {
    useState('');

    return <React.Fragment>
        <input type='text' placeholder='Todo'/>
        <button type='button'>Add</button>
        <ul/>
    </React.Fragment>
};

export default  todo;