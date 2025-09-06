export default function audioSocket(io, socket){
    socket.on("audioMove", ({projectId, x, y, id})=>{
        
        socket.to(projectId).emit("audioMove", {_x:x, _y:y, _id:id})
    })

    socket.on("audioAdd", ({projectId, fileId, audio})=>{

        socket.to(projectId).emit("audioAdd", {_projectId:projectId, _fileId:fileId, _audio:audio, _id:audio.id})
        
    })

    socket.on("audioDelete", ({projectId, trackId})=>{
        
        socket.to(projectId).emit("audioDelete", {_projectId : projectId, _trackId : trackId});
    })

}