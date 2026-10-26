const fileInput = document.querySelector("#resume-file");
const dropZone = document.querySelector("#drop-zone");
const filePrompt = document.querySelector("#file-prompt");
const uploadError = document.querySelector("#upload-error");
const analyzeButton = document.querySelector("#analyze-button");

const maxFileSize = 10 * 1024 * 1024;

function setFile(file) {
  uploadError.textContent = "";

  if (!file) {
    fileInput.value = "";
    filePrompt.textContent = "Drop your resume here";
    analyzeButton.disabled = true;
    return;
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    fileInput.value = "";
    filePrompt.textContent = "Drop your resume here";
    analyzeButton.disabled = true;
    uploadError.textContent = "Please choose a PDF file.";
    return;
  }

  if (file.size > maxFileSize) {
    fileInput.value = "";
    filePrompt.textContent = "Drop your resume here";
    analyzeButton.disabled = true;
    uploadError.textContent = "That file is over 10 MB. Please choose a smaller PDF.";
    return;
  }

  filePrompt.textContent = file.name;
  analyzeButton.disabled = false;
}

fileInput.addEventListener("change", () => {
  setFile(fileInput.files[0]);
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fileInput.click();
  }
});

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
}

dropZone.addEventListener("drop", (event) => {
  setFile(event.dataTransfer.files[0]);
});

analyzeButton.addEventListener("click", () => {
  if (!fileInput.files[0]) return;
  uploadError.textContent = "This is a visual demo. Resume scoring and skill matching aren't connected yet.";
});
