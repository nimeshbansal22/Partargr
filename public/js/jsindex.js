const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileinput");
const browseBtn = document.querySelector(".browsebtn");
const bgprogress = document.querySelector(".bg-progress");
const percentdiv = document.querySelector("#percent");
const progress = document.querySelector(".progress-container");
const fileurl = document.querySelector("#fileURL");
const sharingcontainer = document.querySelector(".sharing-container");
const copybtn = document.querySelector("#copybtn");
const emailform = document.querySelector("#emailform");

const baseURL = "https://innshare.herokuapp.com";
const uploadURL = `${baseURL}/api/files`;
const emailURL = `${baseURL}/api/files/send`;

dropZone.addEventListener("dragover", function(e) {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", function(e) {
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", function(e) {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", function() {
  uploadFile();
});

browseBtn.addEventListener("click", function() {
  fileInput.click();

});

copybtn.addEventListener("click", function() {
  fileurl.select()
  document.execCommand("copy")
});

const uploadFile = function() {
  progress.style.display = "block";
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      console.log(xhr.response);
      showlink(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = function(e) {
    const percentage = (e.loaded / e.total) * 100;
    //console.log(percentage);
    bgprogress.style.width = percentage + "%";
    percentdiv.innerText = Math.round(percentage);
    document.querySelector(".percent-container").style.opacity = percentage + "%";
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};


const showlink = function({
  file
}) {
  console.log(file);
  fileInput.value = "";
  emailform[2].removeAttribute("disabled");
  progress.style.display = "none";
  sharingcontainer.style.display = "block";
  fileurl.value = file;
};

emailform.addEventListener("submit", function(e) {
  e.preventDefault();
  const url = fileurl.value;
  const formdata = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailform.elements["toemail"].value,
    emailFrom: emailform.elements["fromemail"].value
  };
  emailform[2].setAttribute("disabled", "true");
  console.table(formdata);

  fetch(emailURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.success){
        sharingcontainer.style.display = "none";
      }
    });
});
