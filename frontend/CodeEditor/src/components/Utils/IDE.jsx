import React, { useEffect, useRef, useState, useContext } from "react";
import Editor from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";
import { updateFile } from "../../store/codeSlice";
import DropDown from "../Dropdown";
import "./IDE.css";
import axios from "axios";
import { setCode as setReduxCode, updateFileById} from "../../store/codeSlice";
import socketService from "../../socketService/socketService";

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
];

const IDE = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(state => state.code.projectId);
  const activeFileIndex = useSelector((state) => state.code.activeFileIndex);
  const files = useSelector((state) => state.code.files);
  const fileId = files[activeFileIndex]._id;
  const username = useSelector(state=>state.user.username)
  const [code, setCode] = useState(files[activeFileIndex]?.code || "");
  const [language, setLanguage] = useState(
    files[activeFileIndex]?.language || "javascript"
  );

  const type = useSelector(state => state.code.type)
  const [cursorPosition, setCursorPosition] = useState(null);
//-------------------------------------------updates and AI---------------------------------------------------------
  const debouncedUpdate = useRef();
  const debouncedFetchSuggestion = useRef();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const [inlineSuggestion, setInlineSuggestion] = useState("");
  const inlineSuggestionRef = useRef(""); // ✅ always-current suggestion

  // --- Content widget for ghost text ---
  const ghostWidgetRef = useRef(null);

  const ensureGhostWidget = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return null;

    if (ghostWidgetRef.current) return ghostWidgetRef.current;

    const domNode = document.createElement("span");
    domNode.className = "inline-suggestion-ghost-text";
    domNode.style.pointerEvents = "none";
    domNode.style.whiteSpace = "pre";

    const widget = {
      id: "inline-suggestion-widget",
      domNode,
      _text: "",
      getId() {
        return this.id;
      },
      getDomNode() {
        return this.domNode;
      },
      getPosition() {
        const position = editor.getPosition();
        return {
          position,
          preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
        };
      },
      setText(text) {
        this._text = text || "";
        this.domNode.textContent = this._text;
      },
    };

    ghostWidgetRef.current = widget;
    editor.addContentWidget(widget);
    return widget;
  };

  const showInlineSuggestion = (text) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || !text) {
      clearInlineSuggestion();
      return;
    }
    const widget = ensureGhostWidget();
    if (!widget) return;
    widget.setText(text);
    editor.layoutContentWidget(widget);
  };

  const clearInlineSuggestion = () => {
    const editor = editorRef.current;
    if (!editor) return;
    if (ghostWidgetRef.current) {
      editor.removeContentWidget(ghostWidgetRef.current);
      ghostWidgetRef.current = null;
    }
    inlineSuggestionRef.current = ""; // ✅ keep ref in sync
    setInlineSuggestion("");
  };
  // --- end widget helpers ---

  useEffect(() => {
    const debounce = (fn, delay) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    };

    debouncedUpdate.current = debounce((newCode) => {
      
      dispatch(
        updateFile({
          index: activeFileIndex,
          changes: { code: newCode, language },
        })
      );
    }, 300);

    debouncedFetchSuggestion.current = debounce(async (currentCode) => {
      if (!currentCode.trim()) {
        clearInlineSuggestion();
        return;
      }
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/execute/suggest`,
          { codeSnippet: currentCode }
        );
        let suggestion = response.data.suggestion || "";

        if (suggestion.startsWith(currentCode)) {
          suggestion = suggestion.slice(currentCode.length);
        }
        suggestion = suggestion.replace(/^\r?\n+/, "");

        inlineSuggestionRef.current = suggestion; // ✅ set ref first
        setInlineSuggestion(suggestion);
        showInlineSuggestion(suggestion);
      } catch (err) {
        console.log("Gemini API not available");
        
        clearInlineSuggestion();
      }
    }, 800);
  }, [dispatch, activeFileIndex, language]);

  // Keep ref synced if something else changes state
  useEffect(() => {
    inlineSuggestionRef.current = inlineSuggestion;
  }, [inlineSuggestion]);

  useEffect(() => {
    setCode(files[activeFileIndex]?.code || "");
    setLanguage(files[activeFileIndex]?.language || "javascript");
    clearInlineSuggestion();
  }, [activeFileIndex, files]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e)=>{
      setCursorPosition(e.position);
    })

    const cursorSub = editor.onDidChangeCursorPosition(() => {
      if (ghostWidgetRef.current && inlineSuggestionRef.current) {
        editor.layoutContentWidget(ghostWidgetRef.current);
      }
    });

    // --- Accept suggestion helper (reads from ref)
    const acceptSuggestion = () => {
      const suggestion = inlineSuggestionRef.current;
      if (!suggestion) return false;

      const pos = editor.getPosition();
      
      editor.executeEdits("inline-suggestion-accept", [
        {
          range: new monaco.Range(
            pos.lineNumber,
            pos.column,
            pos.lineNumber,
            pos.column
          ),
          text: suggestion,
        },
      ]);

      clearInlineSuggestion();
      const updated = editor.getValue();
      setCode(updated);
      dispatch(

        
        updateFile({
          index: activeFileIndex,
          changes: { code: updated },
        })
      );
      return true;
    };

    // ✅ Bind Right Arrow only (no Enter)
    editor.addCommand(monaco.KeyCode.RightArrow, () => {
      acceptSuggestion();
    });

    editor.onDidDispose(() => {
      cursorSub.dispose();
      clearInlineSuggestion();
    });
  };

  const handleEditorChange = (value) => {
    if (value === undefined) return;
    setCode(value);
    debouncedUpdate.current?.(value);
    debouncedFetchSuggestion.current?.(value);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    dispatch(
      updateFile({
        index: activeFileIndex,
        changes: { language: newLanguage },
      })
    );
  };


  //----------------------------------------------codeSync---------------------------------------------------------

  const codeTimeoutRef = useRef(null);

  const handleRemoteChanges = ({_projectId, _fileId, newCode})=>{
    
    if(projectId != _projectId || !newCode){

      return;
    }


    
    if (newCode === code) return;
    
    console.log(fileId, newCode);
    
    dispatch(updateFileById({fileId:_fileId, changes:{code:newCode}}))
  }

  useEffect(()=>{
    socketService.setFileId(fileId);
    socketService.addCodeChangeListener(handleRemoteChanges);

    return ()=>{
      socketService.removeCodeChangeListener();
    }
  }, [fileId])

  useEffect(()=>{
    if(codeTimeoutRef.current){
      clearTimeout(codeTimeoutRef.current);
    }

    codeTimeoutRef.current = setTimeout(()=>{
      if(code){
        socketService.emitCodeChanges(code);
      }
    }, 300)
    
  }, [code])


  //-------------------------------------------------------Cursor Handeling---------------------------------------------------

   
  const cursorTimeoutRef = useRef(null);
const colors = [
  "#e57373", "#64b5f6", "#81c784", "#b16d06ff", "#ba68c8",
  "#4db6ac", "#079d75ff", "#7986cb", "#a1887f", "#90a4ae"
];

// Persistent color and decoration maps
const userColors = {};
const remoteCursors = new Map();
const remoteLabels = new Map();

function getUserColor(username) {
  if (!userColors[username]) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    userColors[username] = colors[randomIndex];
  }
  return userColors[username];
}

// Function to create or retrieve a ContentWidget for the username label
function getRemoteLabelWidget(username, color, editor, monaco) {
  if (remoteLabels.has(username)) {
    return remoteLabels.get(username);
  }

  const domNode = document.createElement("div");
  domNode.className = `remote-label`;
  domNode.textContent = `${username}`;
  domNode.style.backgroundColor = color;
  domNode.style.borderRadius = "6px";

  const widget = {
    domNode: domNode,
    getId: () => `remote-label-widget-${username}`,
    getDomNode: () => domNode,
    getPosition: () => {
      const position = editor.getModel().getDecorationRange(remoteCursors.get(username)?.[0])?.getEndPosition();
      if (!position) return null;
      return {
        position: {
          lineNumber: position.lineNumber,
          column: position.column
        },
        preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
      };
    },
  };
  
  editor.addContentWidget(widget);
  remoteLabels.set(username, widget);
  return widget;
}

// Function to update both the cursor line and the label's position
const updateRemoteCursorAndLabel = (username, position) => {
  const editor = editorRef.current;
  const monaco = monacoRef.current;

  if (!editor || !monaco || !position) return;

  const color = getUserColor(username);

  // 1. Update the cursor line decoration
  const oldDecorations = remoteCursors.get(username) || [];
  const newDecorations = editor.deltaDecorations(oldDecorations, [
    {
      range: new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      ),
      options: {
        className: `remote-cursor`,
        after: {
          content: ' ', // Empty content to make the decoration visible
          inlineClassName: 'remote-cursor',
          inlineClassNameAffectsLetterSpacing: true
        }
      },
    },
  ]);
  remoteCursors.set(username, newDecorations);

  // 2. Get/create the label widget and position it
  const labelWidget = getRemoteLabelWidget(username, color, editor, monaco);
  editor.layoutContentWidget(labelWidget);
};

// listener for socket cursor changes
const handleCursorChange = ({ _fileId, _position, _username }) => {

  console.log(fileId, _fileId);
  
  if (fileId !== _fileId) return; // show only in current file
  if (_username === username) return; // don't draw local cursor

  console.log(_position);
  
  updateRemoteCursorAndLabel(_username, _position);
};

  useEffect(()=>{
    socketService.setFileId(fileId)
    socketService.addCursorChangeListener(handleCursorChange);

    return ()=>{
      socketService.removeCursorChangeListener();
    }
  }, []);

  useEffect(()=>{
    if(cursorTimeoutRef.current){
      clearTimeout(cursorTimeoutRef.current);
    }
    const editor = editorRef.current;

    if(!editor){
      return;
    }

    cursorTimeoutRef.current = setTimeout(()=>{
    
    socketService.emitCursorChange(cursorPosition, username, fileId)

    }, 50)
    
  }, [cursorPosition, projectId, fileId]);

  //--------------------------------------------------------Page Structure--------------------------------------------------------


  return (
    <div className="ide-container">
      {type !== 'dev' && <DropDown
        classname="list"
        label="Language"
        options={languageOptions}
        selected={language}
        onChange={handleLanguageChange}
      />}
      <Editor
        className="monaco-ide"
        height="100%"
        language={language}
        value={code}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          tabCompletion: "on",
          wordBasedSuggestions: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
        }}
      />
    </div>
  );
};

export default IDE;
