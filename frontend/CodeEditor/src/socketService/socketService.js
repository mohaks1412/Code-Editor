import { use } from "react";

class socketService{

  constructor(){
    this.socket = null;
    this.projectId = null;
    this.fileId = null;


    this.codeChanger = null;
    this.notepadChanger = null;
    this.audioMover = null;
    this.audioAdder = null;
    this.audioDeleter = null;
    this.cursorChanger = null;
  }

  //--------------------------------------------------------------setters---------------------------------------------------------

  setFileId(fileId){
    this.fileId = fileId;
    
  }

  setSocket(socket){
    this.socket = socket;
    console.log(this.socket.id, "has connected");
    
  }


  //-----------------------------------------------------------Project Handeling---------------------------------------------------

  joinProject(projectId){
    this.projectId = projectId;
    this.socket.emit("joinProject", projectId)
    console.log("Joined the project", projectId);
    
  }



  leaveProject(){
    this.projectId = null;

    console.log("Leaving the project", this.projectId);
    
  }


  //----------------------------------------------------------------Code Handeling--------------------------------------------------------

  emitCodeChanges(code){

    if(!code || !this.projectId || !this.fileId) return;

    this.socket.emit("codeChange", {projectId: this.projectId, fileId: this.fileId, code});
  }

  addCodeChangeListener(handleCodeChange){

    if(this.codeChanger){
      this.removeCodeChangeListener();
    }


    this.codeChanger = handleCodeChange;
    
    this.socket.on("codeChange", ({_projectId, _fileId, newCode})=>this.codeChanger({_projectId, _fileId, newCode}));

  
  }

  removeCodeChangeListener(){

    this.socket.off("codeChange", this.codeChanger);

    this.codeChanger = null;
  }

  //------------------------------------------------------------NotePad Handeling------------------------------------------


  emitNotepadChanges(text, tab){
    
    if(!text || !this.projectId || !this.fileId) return;

    this.socket.emit("notepadChange", {projectId: this.projectId, fileId: this.fileId, text, tab});
  }


  addNotepadChangeListener(handleNotepadChange){

    if(this.notepadChanger){
      this.removeNotepadChangeListener();
    }
    console.log("Added notepad listener");
    
    this.notepadChanger = handleNotepadChange
    this.socket.on("notepadChange", ({_projectId, _fileId, newText, _tab})=>this.notepadChanger({_projectId, _fileId, newText, _tab}));
  }

  removeNotepadChangeListener(){

    this.socket.off("notepadChange", this.notepadChanger);

    this.notepadChanger = null;
  }

  
//--------------------------------------------------Audio Movement Handeling-------------------------------------------------

  emitAudioMove(id, localPos){

    if(!id || !localPos){
      return;
    }
    
    this.socket.emit("audioMove", {projectId: this.projectId, id, x:localPos.x, y:localPos.y})
  }

  addAudioMoveListener(handleAudioMove){

    if(this.audioMover){
      this.removeAudioMoveListener();
    }

    this.audioMover = handleAudioMove;

    this.socket.on("audioMove", ({_x, _y, _id})=>{this.audioMover({_x, _y, _id})});
  }

  removeAudioMoveListener(){

    this.socket.off("audioMove", this.audioMover);
    console.log("removeing mover listener...");
    
    this.audioMover = null;
  }


  
//-----------------------------------------------------Audio Addition handeling----------------------------------------------


  emitAudioAdd(audio){
    if(!audio){
      return;
    }

    this.socket.emit("audioAdd", {audio, projectId: this.projectId, fileId: this.fileId});
  }

  addAudioAddListener(handelAudioAdd){

    if(this.audioAdder){
      this.removeAudioAddListener();
    }

    this.audioAdder = handelAudioAdd;

    this.socket.on("audioAdd", ({_projectId, _fileId, _audio}) => this.audioAdder({_projectId, _fileId, _audio}))
  }

  removeAudioAddListener(){
    this.socket.off("audioAdd", this.audioAdder);

    this.audioAdder = null;
  }

  //----------------------------------------------Audio Deletion Handeling--------------------------------------------------


  emitAudioDelete(trackId){

    if(!trackId){
      return;
    }

    this.socket.emit("audioDelete", {projectId: this.projectId, trackId});
  }

  addDeleteAudioListener(handleAudioDelete){
    if(this.audioDeleter){
      this.removeDeleteAudioListener();
    }

    this.audioDeleter = handleAudioDelete;
    this.socket.on("audioDelete", ({_projectId, _trackId})=>{this.audioDeleter({_projectId, _trackId})})
  }

  removeDeleteAudioListener(){
    this.socket.off("audioDelete", this.audioDeleter);

    this.audioDeleter = null;
  }

  //--------------------------------------------------Cursor IDE--------------------------------------------------------------

  emitCursorChange(position, username, fileId){

    if(!this.projectId || !fileId || !position || !username){
      return;
    }


    this.socket.emit("cursorChange", {projectId : this.projectId, fileId, position, username});
  }

  addCursorChangeListener(handleCursorChange){


    if(this.cursorChanger){
      this.removeCursorChangeListener
    }

    this.cursorChanger = handleCursorChange;

    this.socket.on("cursorChange", ( { _fileId, _position, _username})=>{this.cursorChanger({ _fileId, _position, _username})})
  }

  removeCursorChangeListener(){

    this.socket.off("cursorChange", this.cursorChanger);

    this.cursorChanger = null;
  }
};






export default new socketService();