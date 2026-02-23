import axios from 'axios';

const LANGUAGE_MAPPING = {
  javascript: 'javascript',
  python: 'python3',
  java: 'java',
  csharp: 'csharp',
  php: 'php',
  typescript: 'javascript' 
};

export const executeCode = async (language, sourceCode) => {
  try {
    // 👇 1. Point to your Render backend (or localhost if testing locally)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    // 👇 2. Send the code directly to YOUR server's new /compile route
    const response = await axios.post(`${backendUrl}/compile`, {
      language: LANGUAGE_MAPPING[language] || 'javascript',
      sourceCode: sourceCode
    });

    // 3. Return the result to Output.jsx
    return {
      run: {
        output: response.data.output
      }
    };

  } catch (error) {
    console.error("Execution failed:", error);
    return {
      run: {
        output: "Error: Could not connect to the compiler server. Make sure your backend is running."
      }
    };
  }
};