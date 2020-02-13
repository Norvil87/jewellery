'use strict';

var KeyCodes = {
  ENTER: 'Enter',
  ESC: 'Esc',
  ESC_IE: 'Escape'
};

var Resolutions = {
  MOBILE_MAX: 767
};

var TEL_LENGTH = 14;

var body = document.querySelector('body');

var popupButton = document.querySelector('.header__user-button');

var modalFocus = window.focusTrap('.modal');

var form = document.querySelector('.form__inputs-container');

if (form) {
  var formName = form.querySelector('#name');
  var formTel = form.querySelector('#tel');
  var formTextarea = form.querySelector('#text');
  var formSubmit = form.querySelector('.form__button');
}

var modal = document.querySelector('.modal');

if (modal) {
  var modalForm = modal.querySelector('.modal__inputs-container');
  var modalClose = modalForm.querySelector('.modal__button--close');
  var modalSubmit = modalForm.querySelector('.modal__button--submit');
  var modalName = modalForm.querySelector('#modal-name');
  var modalTel = modalForm.querySelector('#modal-tel');
  var modalTextarea = modalForm.querySelector('#modal-text');
}

function getBodyScrollTop() {
  return self.pageYOffset
  || (document.documentElement && document.documentElement.ScrollTop)
  || (document.body && document.body.scrollTop);
}

function onEscPress(evt) {
  if (evt.key === KeyCodes.ESC || evt.key === KeyCodes.ESC_IE) {
    closePopup();
  }
}

function openPopup() {
  body.dataset.scrollY = getBodyScrollTop();
  body.style.top = -body.dataset.scrollY + 'px';

  modal.classList.add('modal--open');
  modalFocus.activate();
  body.classList.add('no-scrolling');

  document.addEventListener('keydown', onEscPress);

  var telStorage = localStorage.getItem('tel');
  var nameStorage = localStorage.getItem('name');

  if (nameStorage) {
    modalName.value = nameStorage;
    if (telStorage) {
      modalTel.value = telStorage;
      modalTextarea.focus();
    } else {
      modalTel.focus();
    }
  } else {
    modalName.focus();
  }
}

function closePopup() {
  modal.classList.remove('modal--open');
  modalFocus.deactivate();
  body.classList.remove('no-scrolling');

  window.scrollTo(0, body.dataset.scrollY);

  document.removeEventListener('keydown', onEscPress);
}

function onPopupButtonClick() {
  openPopup();
}

function onModalUnderlayClick(evt) {
  if (evt.target === modalClose || evt.target === modal) {
    closePopup();
  }
}

if (popupButton) {
  popupButton.addEventListener('click', onPopupButtonClick);
}

if (modal) {
  modal.addEventListener('click', function (evt) {
    onModalUnderlayClick(evt);
  });
}

function onTelInputChange(key, input) {
  var digitsReg = /^[0-9]$/;

  if (!key.match(digitsReg) || input.value.length === 14) {
    return;
  }

  input.value += key;

  if (input.value.length === 6) {
    input.value += ')';
  }
}

function onTelInputFocus(input) {
  var telStartPattern = '+7(';
  input.value = telStartPattern;

  function onInputKeypress(evt) {
    evt.preventDefault();
    var key = evt.key;
    onTelInputChange(key, input);
  }

  input.addEventListener('keypress', onInputKeypress);

  input.addEventListener('blur', function () {
    input.removeEventListener('keypress', onInputKeypress);
  });
}

if (modalTel) {
  modalTel.addEventListener('focus', function () {
    onTelInputFocus(modalTel);
  });
}

if (formTel) {
  formTel.addEventListener('focus', function () {
    onTelInputFocus(formTel);
  });
}

function validate(input) {
  if (input.value.length < TEL_LENGTH) {
    input.setCustomValidity('Телефонный номер должен состоять из 10 цифр');
  } else {
    input.setCustomValidity('');
  }
}

if (formSubmit) {
  formSubmit.addEventListener('click', function () {
    validate(formTel);
  });
}

if (modalSubmit) {
  modalSubmit.addEventListener('click', function () {
    validate(modalTel);
  });
}

if (form) {
  form.addEventListener('submit', function () {
    localStorage.setItem('name', formName.value);
    localStorage.setItem('tel', formTel.value);
    localStorage.setItem('text', formTextarea.value);
  });
}

if (modalForm) {
  modalForm.addEventListener('submit', function () {
    localStorage.setItem('name', modalName.value);
    localStorage.setItem('tel', modalTel.value);
    localStorage.setItem('text', modalTextarea.value);
  });
}

var footerTop = document.querySelector('.footer--top');
if (footerTop) {
  var footerBlocks = Array.prototype.slice.call(footerTop.querySelectorAll('.footer__nav, .footer__contacts'));
}

function toggleVisibility(block) {
  var foldedBlocks = document.querySelectorAll('.folded');

  if (foldedBlocks.length === 1) {
    footerBlocks.forEach(function (item) {
      item.classList.toggle('folded');
    });
  } else {
    block.classList.toggle('folded');
  }
}

function checkResolution() {
  return document.documentElement.clientWidth > Resolutions.MOBILE_MAX;
}

if (footerTop) {
  footerTop.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.tagName !== 'H3') {
      return;
    }

    if (checkResolution()) {
      return;
    }

    toggleVisibility(target.parentNode);
  });
}

if (!checkResolution() && footerBlocks) {
  footerBlocks[0].classList.add('folded');
}
