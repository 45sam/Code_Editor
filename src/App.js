import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import axios from 'axios';
import './App.css'; // Assuming you have an App.css file for styling

const App = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleCompile = async () => {
    try {
      const response = await axios.post('http://localhost:5000/compile', { code, language });
      setOutput(response.data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const getExtensions = () => {
    switch (language) {
      case 'javascript':
        return [javascript()];
      case 'python':
        return [python()];
      case 'c':
        return [cpp()];
      default:
        return [javascript()];
    }
  };

  return (
    <div className="App">
      <h1>Online Code Editor</h1>
      <select className="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
      </select>
      <CodeMirror
        value={code}
        height="500px"
        theme={oneDark}
        extensions={getExtensions()}
        onChange={(value) => {
          setCode(value);
        }}
      />
      <button className="compile-button" onClick={handleCompile}>Compile & Run</button>
      <h2>Output:</h2>
      <pre className="output">{output}</pre>
    </div>
  );
};

export default App;
