import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './NotePad.css';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { updateFile, updateFileById } from '../../store/codeSlice';
import socketService from '../../socketService/socketService';

const NotePad = ({ tabId }) => {
  
  const dispatch = useDispatch();
  const projectId = useParams().projectId;
  const activeFileIndex = useSelector(state => state.code.activeFileIndex);
  const file = useSelector(state => state.code.files[activeFileIndex] || {});
  const textFromStore = tabId === 1 ? file.question || '' : file.notes || '';
  const [text, setText] = useState(textFromStore);

  useEffect(() => {
    setText(textFromStore);
  }, [textFromStore]);

  const debouncedDispatch = useRef();

  useEffect(() => {
    debouncedDispatch.current = debounce(value => {
      dispatch(
        updateFile({
          index: activeFileIndex,
          changes: tabId === 1 ? { question: value } : { notes: value },
        })
      );
    }, 300);

    return () => {
      debouncedDispatch.current.cancel();
    };
  }, [dispatch, activeFileIndex, tabId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    debouncedDispatch.current(value);

  };

  //-------------------------------------------------------------Socket integration--------------------------------------------

  const tab = tabId === 1 ? "question" : "notes";

  
    const NotepadTimeoutRef = useRef(null);

  const handleRemoteNotepadChanges = ({_projectId, _fileId, newText, _tab})=>{
    if(projectId != _projectId || !newText){

      return;
    }

    
    if (newText === text) return;
    
    dispatch(updateFileById({fileId:_fileId, changes: { [_tab] : newText }}))
  }

  useEffect(()=>{
    socketService.setFileId(file._id);
    socketService.addNotepadChangeListener(handleRemoteNotepadChanges);
    return ()=>{

      socketService.removeNotepadChangeListener();
    }
  }, [file._id])

  
    useEffect(()=>{
      
      if(NotepadTimeoutRef.current){
        clearTimeout(NotepadTimeoutRef.current);
      }

      NotepadTimeoutRef.current = setTimeout(() => {
        socketService.emitNotepadChanges(text, tab);
      }, 300);
      
    }, [text])

  return (
    <textarea
      className="notepad-textarea"
      value={text}
      onChange={handleChange}
      placeholder="Start typing your notes here..."
    />
  );
};

export default NotePad;
