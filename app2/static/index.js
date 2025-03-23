// Put these JavaScript codes to the HTML file of the route
// you want socket connections to happen.
const socket = io("/live-chat");

const form = document.getElementById("form");
const input = document.getElementById("input");
const messageContainer = document.getElementById("messageContainer");
const leaveButton = document.getElementById("leaveButton");

// Emit joined event to inform other users in the room
socket.on("connect", () => {
  socket.emit("joined", {});
  console.log("SocketIO: Connected to server");
});

function appendMessage(msgHtml) {
  messageContainer.insertAdjacentHTML("beforeend", msgHtml);
  // Scroll message container to bottom when new message arrives
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Add the status message to DOM
socket.on("status", (data) => {
  let newItem = `
    <div class="row gap-1 mb-2">
      <div class="message-text col me-2 text-muted">${data.msg}</div>
    </div>
  `;
  appendMessage(newItem);
});

// Add the chat message to DOM
socket.on("message", (data) => {
  let newItem = `
    <div class="mb-2 d-flex flex-row flex-nowrap">
      <div class="message-info me-3 p-1 align-self-end  bg-secondary text-white rounded-2">
        ${data.user}
      </div>
      <div class="dialog-box">
        <div class="arrow">
          <div class="outer"></div>
          <div class="inner"></div>
        </div>
      </div>
      <div class="message-text p-1 border border-1 rounded-2 flex-grow-1">
        <div>${data.msg}</div>
      </div>
    </div>
  `;
  appendMessage(newItem);
});

// Send message with enter (hidden submit button)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", {msg: input.value});
    input.value = "";
  }
});

// Leave room by clicking the button
function leaveRoom() {
  socket.emit("left", {}, () => {
    socket.disconnect();
    window.location.href = "/leave-chat";
  });
}

leaveButton.addEventListener("click", () => {
  isLeave = confirm("Do you want to leave the chat?");

  if (isLeave) {
    leaveRoom();
  }
});


// Get file input and button
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

// Listen for file message (to display the file link in chat)
socket.on('file_upload', (data) => {
  console.log(data.fileUrl);
  const messageContainer = document.getElementById("messageContainer");
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
    
  const messageContent = `
      <strong>Media</strong>: 
      <a href="${data.fileUrl}" target="_blank">Click to view file</a>
  `;
  newMessage.innerHTML = messageContent;
  messageContainer.appendChild(newMessage);
});

// Handle file upload event
uploadButton.addEventListener("click", function (event) {
    event.preventDefault();

    const file = fileInput.files[0];
    

    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // Upload file to server using Fetch API or AJAX
        fetch("/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.fileUrl);
            // Emit the file URL to other clients via Socket.IO
            socket.emit("message", {msg: data.fileUrl});
            socket.emit('file_upload', { fileUrl: data.fileUrl });
        })
        .catch(error => {
            console.error("File upload failed:", error);
        });
    } else {
        alert("No file selected.");
    }
});



// Leave room before leaving page
window.onbeforeunload = () => {
  leaveRoom();
  return "Do you want to leave chat?";
}; 

// -------------------------------------------------------------------------------------------------

// const socket = io("/live-chat");

// const form = document.getElementById("form");
// const input = document.getElementById("input");
// const messageContainer = document.getElementById("messageContainer");
// const leaveButton = document.getElementById("leaveButton");
// const fileInput = document.createElement("input");

// fileInput.type = "file";
// fileInput.id = "fileUpload";
// fileInput.style.display = "none";

// // Add file input to the form
// form.appendChild(fileInput);

// // Emit joined event to inform other users in the room
// socket.on("connect", () => {
//   socket.emit("joined", {});
//   console.log("SocketIO: Connected to server");
// });

// function appendMessage(msgHtml) {
//   messageContainer.insertAdjacentHTML("beforeend", msgHtml);
//   // Scroll message container to bottom when new message arrives
//   messageContainer.scrollTop = messageContainer.scrollHeight;
// }

// // Add the status message to DOM
// socket.on("status", (data) => {
//   let newItem = `
//     <div class="row gap-1 mb-2">
//       <div class="message-text col me-2 text-muted">${data.msg}</div>
//     </div>
//   `;
//   appendMessage(newItem);
// });

// // Add the chat message to DOM
// socket.on("message", (data) => {
//   let newItem = `
//     <div class="mb-2 d-flex flex-row flex-nowrap">
//       <div class="message-info me-3 p-1 align-self-end bg-secondary text-white rounded-2">
//         ${data.user}
//       </div>
//       <div class="dialog-box">
//         <div class="arrow">
//           <div class="outer"></div>
//           <div class="inner"></div>
//         </div>
//       </div>
//       <div class="message-text p-1 border border-1 rounded-2 flex-grow-1">
//         <div>${data.msg}</div>
//       </div>
//     </div>
//   `;
//   appendMessage(newItem);
// });

// // Add file messages to DOM
// socket.on("file", (data) => {
//   let fileLink = `
//     <a href="${data.file_url}" target="_blank">${data.filename}</a>
//   `;
//   let newItem = `
//     <div class="mb-2 d-flex flex-row flex-nowrap">
//       <div class="message-info me-3 p-1 align-self-end bg-secondary text-white rounded-2">
//         ${data.user}
//       </div>
//       <div class="dialog-box">
//         <div class="arrow">
//           <div class="outer"></div>
//           <div class="inner"></div>
//         </div>
//       </div>
//       <div class="message-text p-1 border border-1 rounded-2 flex-grow-1">
//         <div>${fileLink}</div>
//       </div>
//     </div>
//   `;
//   appendMessage(newItem);
// });

// // Send message with enter (hidden submit button)
// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (input.value) {
//     socket.emit("message", { msg: input.value });
//     input.value = "";
//   }
// });

// // Trigger file input dialog
// input.addEventListener("keydown", (e) => {
//   if (e.key === "Tab") {
//     e.preventDefault();
//     fileInput.click();
//   }
// });

// // Handle file selection
// fileInput.addEventListener("change", function (e) {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (event) {
//       const fileData = event.target.result;
//       socket.emit("upload_file", {
//         filename: file.name,
//         file: fileData.split(",")[1], // Only send the base64-encoded string
//       });
//     };
//     reader.readAsDataURL(file);
//   }
// });

// // Leave room by clicking the button
// function leaveRoom() {
//   socket.emit("left", {}, () => {
//     socket.disconnect();
//     window.location.href = "/leave-chat";
//   });
// }

// leaveButton.addEventListener("click", () => {
//   const isLeave = confirm("Do you want to leave the chat?");
//   if (isLeave) {
//     leaveRoom();
//   }
// });
