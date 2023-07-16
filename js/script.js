const books = [];
const RENDER_BOOK = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    saveBook();
  });
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBook();
  });
  searchForm.addEventListener('reset', function () {
    resetSearch();
  });
  if (supportStorage()) {
    loadDataFromLocalStorage();
  }
});

function resetSearch() {
  document.getElementById('answer').innerHTML = '';
  document.dispatchEvent(new Event(RENDER_BOOK));
}

function searchBook() {
  const searchValue = document.getElementById('searchBookTitle').value.toLowerCase();
  let countBooks = 0;
  const answerSection = document.getElementById('answer');
  answerSection.innerHTML = '';
  const idBookList = [];
  for (let i = 0; i < books.length; i++) {
    if (books[i].title.slice(0).toLowerCase().includes(searchValue)) {
      idBookList.push(books[i]);
      countBooks += 1;
    }
  }
  const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
  incompleteBookshelf.innerHTML = '';
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
  for (const bookItem of idBookList) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelf.append(bookElement);
    }
  }
  if (countBooks === 0) {
    const message = document.createElement('p');
    message.innerHTML = '<i>Judul buku tidak ditemukan</i>';
    answerSection.append(message);
    message.style.color = 'white';
  }
}

function saveBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const bookIsComplete = check;
  const bookId = generateId();
  const bookObject = makeBookObject(bookId, bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
  alert('Buku ' + bookObject.title + ' telah tersimpan di rak ' + document.querySelector('span').innerText);
}

const checkBox = document.getElementById('inputBookIsComplete');
let check = true;
checkBox.addEventListener('change', function () {
  if (checkBox.checked) {
    check = true;
    document.querySelector('span').innerText = 'Selesai dibaca';
  } else {
    check = false;
    document.querySelector('span').innerText = 'Belum selesai dibaca';
  }
});

function generateId() {
  return +new Date();
}

function makeBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_BOOK, function () {
  const incompleteBookshelf = document.getElementById('incompleteBookshelfList');
  incompleteBookshelf.innerHTML = '';
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelf.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis: ' + bookObject.author;
  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun :' + bookObject.year;
  const buttonFinishedReading = document.createElement('button');
  buttonFinishedReading.innerText = 'Selesai dibaca';
  buttonFinishedReading.classList.add('action_button');
  buttonFinishedReading.addEventListener('click', function () {
    saveToCompleteBookshelf(bookObject.id);
  });
  const buttonNotFinishedReading = document.createElement('button');
  buttonNotFinishedReading.innerText = 'Belum selesai dibaca';
  buttonNotFinishedReading.classList.add('action_button');
  buttonNotFinishedReading.addEventListener('click', function () {
    saveToInCompleteBookshelf(bookObject.id);
  });
  const buttonDeleteBook = document.createElement('button');
  buttonDeleteBook.classList.add('action_button');
  buttonDeleteBook.setAttribute('id', 'buttonDeleteBook' + bookObject.id);
  buttonDeleteBook.innerText = 'Hapus';
  buttonDeleteBook.addEventListener('click', function () {
    deleteDialog(bookObject.id);
  });
  const buttonEditBook = document.createElement('button');
  buttonEditBook.innerText = 'Edit';
  buttonEditBook.classList.add('action_button');
  buttonEditBook.setAttribute('id', 'buttonEditBook' + bookObject.id);
  buttonEditBook.addEventListener('click', function () {
    formEditBook(bookObject.id);
    const editForm = document.getElementById('editBook');
    editForm.addEventListener('submit', function (event) {
      event.preventDefault();
      editBook(bookObject.id);
    });
  });
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  if (bookObject.isComplete) {
    buttonContainer.append(buttonNotFinishedReading);
  } else {
    buttonContainer.append(buttonFinishedReading);
  }
  const dialogBox = document.createElement('div');
  dialogBox.setAttribute('id', 'dialogBox' + bookObject.id);
  dialogBox.classList.add('action');

  buttonContainer.append(buttonDeleteBook, buttonEditBook, dialogBox);
  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, buttonContainer);
  container.setAttribute('id', bookObject.id);
  return container;
}

function formEditBook(bookId) {
  const headEditBook = document.createElement('h2');
  headEditBook.innerText = 'Edit Buku';
  const editTitleContainer = document.createElement('div');
  editTitleContainer.classList.add('input');
  const labelEditBookTitle = document.createElement('label');
  labelEditBookTitle.innerText = 'Judul ';
  const inputEditBookTitle = document.createElement('input');
  inputEditBookTitle.setAttribute('type', 'text');
  inputEditBookTitle.setAttribute('required', true);
  inputEditBookTitle.setAttribute('id', 'newInputBookTitle');
  editTitleContainer.append(labelEditBookTitle, inputEditBookTitle);

  const editAuthorContainer = document.createElement('div');
  editAuthorContainer.classList.add('input');
  const labelEditBookAuthor = document.createElement('label');
  labelEditBookAuthor.innerText = 'Penulis ';
  const inputEditBookAuthor = document.createElement('input');
  inputEditBookAuthor.setAttribute('type', 'text');
  inputEditBookAuthor.setAttribute('required', true);
  inputEditBookAuthor.setAttribute('id', 'newInputBookAuthor');
  editAuthorContainer.append(labelEditBookAuthor, inputEditBookAuthor);

  const editYearContainer = document.createElement('div');
  editYearContainer.classList.add('input');
  const labelEditBookYear = document.createElement('label');
  labelEditBookYear.innerText = 'Tahun ';
  const inputEditBookYear = document.createElement('input');
  inputEditBookYear.setAttribute('type', 'number');
  inputEditBookYear.setAttribute('required', true);
  inputEditBookYear.setAttribute('id', 'newInputBookYear');
  editYearContainer.append(labelEditBookYear, inputEditBookYear);

  const buttonSaveEditedBook = document.createElement('button');
  buttonSaveEditedBook.innerText = 'Simpan';

  const buttonCancelEdit = document.createElement('button');
  buttonCancelEdit.innerText = 'Batal';
  buttonCancelEdit.classList.add('button_cancel');
  buttonCancelEdit.addEventListener('click', function () {
    document.dispatchEvent(new Event(RENDER_BOOK));
  });

  const formEditBookContainer = document.createElement('form');
  formEditBookContainer.append(headEditBook, editTitleContainer, editAuthorContainer, editYearContainer, buttonSaveEditedBook);
  formEditBookContainer.setAttribute('id', 'editBook');

  const editSection = document.createElement('section');
  editSection.setAttribute('id', 'editSection');
  editSection.classList.add('input_section');
  editSection.append(formEditBookContainer, buttonCancelEdit);

  const buttonEditBook = document.getElementById('buttonEditBook' + bookId);
  buttonEditBook.setAttribute('hidden', true);

  const editBookItem = document.getElementById(bookId);
  editBookItem.append(editSection);
}

function editBook(bookId) {
  const editBookTitle = document.getElementById('newInputBookTitle').value;
  const editBookAuthor = document.getElementById('newInputBookAuthor').value;
  const editBookYear = document.getElementById('newInputBookYear').value;

  const bookTarget = findBook(bookId);
  bookTarget.title = editBookTitle;
  bookTarget.author = editBookAuthor;
  bookTarget.year = editBookYear;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function saveToCompleteBookshelf(bookId) {
  const bookTarget = findBook(bookId);
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function saveToInCompleteBookshelf(bookId) {
  const bookTarget = findBook(bookId);
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function deleteDialog(bookId) {
  const bookIndexTarget = findBookIndex(bookId);
  const question = document.createElement('p');
  question.innerText = 'Apa kamu yakin menghapus buku ' + books[bookIndexTarget].title + '?';
  const buttonNo = document.createElement('button');
  buttonNo.innerText = 'Tidak';
  buttonNo.classList.add('action_button');
  buttonNo.addEventListener('click', function () {
    boxBookItem.innerHTML = '';
  });
  const buttonYes = document.createElement('button');
  buttonYes.innerText = 'Iya';
  buttonYes.classList.add('action_button');
  buttonYes.addEventListener('click', function () {
    removeBookFromBookshelf(bookId);
  });

  const boxBookItem = document.getElementById('dialogBox' + bookId);
  boxBookItem.innerHTML = '';
  boxBookItem.append(question, buttonNo, buttonYes);
}

function removeBookFromBookshelf(bookId) {
  bookIndexTarget = findBookIndex(bookId);

  books.splice(bookIndexTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPs';

function saveData() {
  if (supportStorage()) {
    const textData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, textData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function supportStorage() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local storage');
    return false;
  }
  return true;
}

function loadDataFromLocalStorage() {
  const dataFromLocalStorage = localStorage.getItem(STORAGE_KEY);
  let objectData = JSON.parse(dataFromLocalStorage);

  if (objectData !== null) {
    for (const bookItem of objectData) {
      books.push(bookItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_BOOK));
}
