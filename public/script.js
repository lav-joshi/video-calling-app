const socket = io('/');
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement('video');
myVideo.muted=true;
const peers = {}

var peer = new Peer(undefined ,{
    path:'/peerjs',
    host:'/',
    port:443
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    console.log("three");
    myVideoStream = stream;
    addVideoStream(myVideo,stream);
   
    peer.on('call',call=>{
        console.log("1");
        call.answer(stream);
        const video=document.createElement('video');
        call.on('stream',userVideoStream=>{
            console.log("2");
            addVideoStream(video,userVideoStream);
        });
    },function(err){
        console.log('Fail' ,err);
    });

    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
    });
    //input value
    let text = $('input');
    // when press enter and send message
    $('html').keydown((e)=>{
        if(e.which==13 && text.val().length!==0){
            console.log(text.val());
            socket.emit('message',text.val());
            text.val('');
        }
    });

    socket.on('createMessage',message=>{
        $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom();
    });
});
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

peer.on('open',id=>{
 socket.emit('join-room',ROOM_ID,id)
});


const connectToNewUser = (userId,stream)=>{
  const call = peer.call(userId,stream);

  const video= document.createElement('video');
  call.on('stream',userVideoStream=>{
      console.log("fuck");
      addVideoStream(video,userVideoStream);
  });
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

 
const addVideoStream = (video,stream)=>{
  video.srcObject = stream;
  video.addEventListener('loadedmetadata',()=>{
      video.play();
  });
  videoGrid.append(video);
}


const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

//Mute/Unmute
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
`
document.querySelector('.main__mute_button').innerHTML = html;
}
  
//Video Play/Unplay
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
const setPlayVideo = () => {
const html = `
<i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
`
document.querySelector('.main__video_button').innerHTML = html;
}