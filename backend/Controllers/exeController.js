import axios from 'axios';
import File from "../Models/fileModel.js";
import TestCase from "../Models/testCaseModel.js"


async function generateInlineCodeCompletion(req, res) {
  const codeSnippet = req.body.codeSnippet;
  if (!codeSnippet || codeSnippet.trim() === '') return '';
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", 
      {
        contents: [
          {
            parts: [
              { text: `Suggest concise code completions for this snippet. Make sure you generate just the suggestion and nothing else.:\n${codeSnippet}` }
            ]
          }
        ]
      },
      {
        headers: {
          "x-goog-api-key": `${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Gemini's response structure
    const suggestion = response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    


    res.json({ suggestion: suggestion.replace(/```/g, "").trim() });


  } catch (error) {
    console.error("Error generating Gemini code suggestion:", error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
}

// Map your language strings to Judge0 language IDs
const languageMap = {
  cpp: 54,
  javascript: 63,
  python: 71,
  java: 62,
  // add more mappings as needed
};

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions/';
const JUDGE0_API_HOST = 'judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.RAPIDAPI_KEY; // Store your API key in .env

async function runCodeWithJudge0({ code, language, input = '' }) {
  const languageId = languageMap[language.toLowerCase()];
  if (!languageId) {
    throw new Error('Unsupported language');
  }
  
  // Submit code for execution (without waiting)
  console.log(code);
  
  try{
  const submissionResponse = await axios.post(
    `${JUDGE0_API_URL}?base64_encoded=false&wait=false`,
    {
      language_id: languageId,
      source_code: code,
      stdin: input,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': JUDGE0_API_HOST,
        'X-RapidAPI-Key': JUDGE0_API_KEY,
      },
    }
  );

    const token = submissionResponse.data.token;
  
  // Poll Judge0 until execution is finished
  let result = null;
  while (!result || result.status.id <= 2) {
    // 1: In Queue, 2: Processing
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resultResponse = await axios.get(`${JUDGE0_API_URL}${token}`, {
      headers: {
        'X-RapidAPI-Host': JUDGE0_API_HOST,
        'X-RapidAPI-Key': JUDGE0_API_KEY,
      },
    });
    result = resultResponse.data;
  }

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.status.id === 3 ? 0 : result.status.id, // 3 = Accepted
    time: result.time,
    memory: result.memory,
  };
}

catch(err){
  console.error(err)
  return res.json({message: err.message})
}

}

const executeAssignment = async (req, res) => {
  const { code, language, input, fileId} = req.body;

  if (!fileId) {
    return res.status(400).json({ message: "File not found" });
  }

  try {
    // Execute code here (call Judge0, etc.)
    const executionResult = await runCodeWithJudge0({ code, language, input });

    const output = executionResult.stdout || executionResult.stderr;

    await File.findByIdAndUpdate(fileId, {output});
    res.json({ output });

  } catch (err) {
    res.status(500).json({ message: "Execution failed", error: err.message });
  }
};

const executeDsa = async (req, res) => {
  
  const { code, language, testCases } = req.body;

  console.log({ code, language, testCases });
  

  if (!testCases || testCases.length === 0) {

    return res.status(400).json({ message: "No test Cases" });
  }

  try {

    
    const results = [];

    for (const testCaseId of testCases) {
      const testCase = await TestCase.findById(testCaseId);
      if (!testCase) continue;
      const result = await runCodeWithJudge0({
        code,
        language,
        input: testCase.input,
      });
      
      const {stdout, stderr} = result;
      
      // Compare output
      const passed =
        (stdout || '').trim() ===
        (testCase.expected || '').trim();
        
      // Update testcase with output and pass/fail status
      await TestCase.findByIdAndUpdate(testCaseId, {
        received: stdout || stderr,
        status: passed
      });
      
      
      results.push({ testCaseId, passed, stderr, stdout});
    }
    
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Execution failed", error: err.message });
  }
};

export {executeAssignment, executeDsa, generateInlineCodeCompletion}