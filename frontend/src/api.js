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
    // 👇 FIX: .replace(/\/$/, "") removes any accidental slash at the end of your URL
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, "");
    
    // Now it will correctly call /compile instead of //compile
    const response = await axios.post(`${backendUrl}/compile`, {
      language: LANGUAGE_MAPPING[language] || 'javascript',
      sourceCode: sourceCode
    });

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