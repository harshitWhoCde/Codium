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
    // 👇 FIX: Added corsproxy.io in front of the URL
    const createResponse = await axios.post('https://corsproxy.io/?https://api.paiza.io/runners/create', {
      source_code: sourceCode,
      language: LANGUAGE_MAPPING[language] || 'javascript',
      api_key: 'guest',
    });

    const runId = createResponse.data.id;
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 👇 FIX: Added corsproxy.io here too
    const resultResponse = await axios.get(`https://corsproxy.io/?https://api.paiza.io/runners/get_details?id=${runId}&api_key=guest`);
    
    const data = resultResponse.data;
    const finalOutput = data.stdout || data.stderr || data.build_stderr || "Execution finished with no output.";

    return { run: { output: finalOutput } };

  } catch (error) {
    console.error("Execution failed:", error);
    return { run: { output: "Error: Could not connect to the compiler." } };
  }
};