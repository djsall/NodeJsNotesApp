let send = document.getElementById('send');
let cont = document.getElementById('list-container');
let textArea = document.getElementById('input');
let clear = document.getElementById('clear');

send.addEventListener('click', uploadItem);
clear.addEventListener('click', clearList);
window.addEventListener('keyup', event => {
  if (event.keyCode === 13 && textArea.value != '\n') uploadItem();
  else textArea.value = '';
});

function downloadList() {
  cont.innerHTML = '';
  fetchAsync().then(json => {
    json.forEach(item => {
      cont.innerHTML += '<li>' + item + '</li>';
    });
  });
}
downloadList();

function uploadItem() {
  if (
    textArea.value == '' ||
    textArea.value === undefined ||
    textArea.value == '\n' ||
    textArea.value == '\r'
  ) {
    cont.innerHTML += "<li class='red'>No text was given!</li>";
  } else {
    let response = fetch('/postItem', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: textArea.value
      })
    });
    textArea.value = '';
    downloadList();
  }
}

function clearList() {
  let result = fetch('/clearlist');
  downloadList();
}
async function fetchAsync() {
  let result = await fetch('/getlist');
  let json = await result.json();
  return json;
}
