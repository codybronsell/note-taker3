let notezTitle;
let notezText;
let saveBtn;
let newNotez;
let myNotezList;

if (window.location.pathname === '/notes') {
  notezTitle = document.querySelector('.note-title');
  notezText = document.querySelector('.note-textarea');
  saveBtn = document.querySelector('.save-note');
  newNotez = document.querySelector('.new-note');
  myNotezList = document.querySelectorAll('.list-container .list-group');
}
const show = (elem) => {
  elem.style.display = 'inline';
};

const hide = (elem) => {
  elem.style.display = 'none';
};

let activeNote = {};

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveBtn);

  if (activeNote.id) {
    notezTitle.setAttribute('readonly', true);
    notezText.setAttribute('readonly', true);
    notezTitle.value = activeNote.title;
    notezText.value = activeNote.text;
  } else {
    notezTitle.removeAttribute('readonly');
    notezText.removeAttribute('readonly');
    notezTitle.value = '';
    notezText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: notezTitle.value,
    text: notezText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!notezTitle.value.trim() || !notezText.value.trim()) {
    hide(saveBtn);
  } else {
    show(saveBtn);
  }
};

const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    myNotezList.forEach((el) => (el.innerHTML = ''));
  }

  let myNotezListItems = [];

  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    myNotezListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    myNotezListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    myNotezListItems.forEach((note) => myNotezList[0].append(note));
  }
};

const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveBtn.addEventListener('click', handleNoteSave);
  newNotez.addEventListener('click', handleNewNoteView);
  notezTitle.addEventListener('keyup', handleRenderSaveBtn);
  notezText.addEventListener('keyup', handleRenderSaveBtn);
}
lottie.loadAnimation({
  container: document.getElementById('notesz'), // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: './assets/lottie/notesz.json' // the path to the animation json
});
lottie.loadAnimation({
  container: document.getElementById('noteszLogo'), // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: './assets/lottie/notesz.json' // the path to the animation json
});
getAndRenderNotes();