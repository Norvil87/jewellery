'use strict';

var KeyCodes = {
  ESC: 'Esc',
  ESC_IE: 'Escape'
};

var Resolutions = {
  DESKTOP: 1024
};

var GALLERY_STEP = 100;

var body = document.querySelector('body');

var addItemOpenButton = document.querySelector('.item__button');
var addItemModal = document.querySelector('.addItem');
if (addItemModal) {
  var addItemCloseButton = addItemModal.querySelector('.addItem__button-close');
}
var carousel = document.querySelector('.new');
if (carousel) {
  var carouselBackwardsButton = carousel.querySelector('.new__control-button--backwards');
  var carouselForwardButton = carousel.querySelector('.new__control-button--forward');
  var carouselList = carousel.querySelector('.new__gallery-list');
}
var faq = document.querySelector('.faq');
var filter = document.querySelector('.filter');
if (filter) {
  var filterForm = filter.querySelector('.filter__form');
  var filterShowButton = filter.querySelector('.filter__show-button');
  var filterCloseButton = filter.querySelector('.filter__button--close');
}
var mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenu) {
  var menuCloseButton = mobileMenu.querySelector('.header__menu-button');
  var menuLoginButton = mobileMenu.querySelector('.mobile-menu__user-button');
}
var menuOpenButton = document.querySelector('.header__menu-button');
var loginOpenButton = document.querySelector('.header__user-button');
var loginModal = document.querySelector('.login');
if (loginModal) {
  var loginCloseButton = loginModal.querySelector('.login__button--close');
  var loginEmailInput = loginModal.querySelector('#login-email');
  var loginPasswordInput = loginModal.querySelector('#login-password');
}

var maxGalleryShift = isDesktopResolution() ? -200 : -500;
var galleryPosition = 0;

var popupFocus;
var escPressHandler;

function isDesktopResolution() {
  return body.clientWidth >= Resolutions.DESKTOP;
}

function getBodyScrollTop() {
  return self.pageYOffset
  || (document.documentElement && document.documentElement.ScrollTop)
  || (document.body && document.body.scrollTop);
}

function toggleVisibility(block) {
  block.classList.toggle('hidden');
}

function toggleFold(block) {
  block.classList.toggle('unfolded');
}

function onEscPress(evt, popup) {
  if (evt.key === KeyCodes.ESC || evt.key === KeyCodes.ESC_IE) {
    closePopup(popup);
  }
}

function openPopup(popup) {
  body.dataset.scrollY = getBodyScrollTop();
  body.style.top = -body.dataset.scrollY + 'px';

  popup.classList.remove('hidden');

  if (popup.classList.contains('login')) {
    popupFocus = window.focusTrap('.login');
    popupFocus.activate();
  }

  body.classList.add('body-locked');

  escPressHandler = document.addEventListener('keydown', function (evt) {
    onEscPress(evt, popup);
  });

  handleLocalStorage();
}

function handleLocalStorage() {
  var emailStorage = localStorage.getItem('email');

  if (emailStorage) {
    loginEmailInput.value = emailStorage;
    loginPasswordInput.focus();
  } else {
    loginEmailInput.focus();
  }
}

function closePopup(popup) {
  popup.classList.add('hidden');

  if (popupFocus) {
    popupFocus.deactivate();
  }

  body.classList.remove('body-locked');

  window.scrollTo(0, body.dataset.scrollY);

  document.removeEventListener('keydown', escPressHandler);
}

function onMenuCloseButtonClick() {
  toggleVisibility(mobileMenu);
}

function onMenuOpenButtonClick() {
  toggleVisibility(mobileMenu);
}

function onloginOpenButtonClick() {
  openPopup(loginModal);
}

function onMenuLoginButtonClick() {
  openPopup(loginModal);
}

function onloginModalClick(evt) {
  if (evt.target === loginCloseButton || evt.target === loginModal) {
    closePopup(loginModal);
  }
}

function onfilterShowButtonClick() {
  toggleVisibility(filterForm);
}

function onfilterCloseButtonClick() {
  toggleVisibility(filterForm);
}

function onAddItemOpenButtonClick() {
  openPopup(addItemModal);
}

function onAddItemModalClick(evt) {
  if (evt.target === addItemCloseButton || evt.target === addItemModal) {
    closePopup(addItemModal);
  }
}

if (menuOpenButton) {
  menuOpenButton.addEventListener('click', onMenuOpenButtonClick);
}

if (menuCloseButton) {
  menuCloseButton.addEventListener('click', onMenuCloseButtonClick);
}

if (loginOpenButton) {
  loginOpenButton.addEventListener('click', onloginOpenButtonClick);
}

if (menuLoginButton) {
  menuLoginButton.addEventListener('click', onMenuLoginButtonClick);
}

if (loginModal) {
  loginModal.addEventListener('click', function (evt) {
    onloginModalClick(evt);
  });
}

if (loginModal) {
  loginModal.addEventListener('submit', function () {
    localStorage.setItem('email', loginEmailInput.value);
  });
}

if (faq) {
  faq.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.tagName !== 'H3') {
      return;
    }

    toggleFold(target.parentNode);
  });
}

if (filterForm) {
  filterForm.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.tagName !== 'H3') {
      return;
    }

    toggleFold(target.parentNode);
  });
}

if (filterShowButton) {
  filterShowButton.addEventListener('click', onfilterShowButtonClick);
}

if (filterCloseButton) {
  filterCloseButton.addEventListener('click', onfilterCloseButtonClick);
}

if (addItemOpenButton) {
  addItemOpenButton.addEventListener('click', onAddItemOpenButtonClick);
}

if (addItemModal) {
  addItemModal.addEventListener('click', onAddItemModalClick);
}

if (carouselBackwardsButton) {
  carouselBackwardsButton.addEventListener('click', function () {
    if (galleryPosition <= maxGalleryShift) {
      return;
    }
    galleryPosition -= GALLERY_STEP;

    carouselList.style.marginLeft = galleryPosition + '%';
  });
}

if (carouselForwardButton) {
  carouselForwardButton.addEventListener('click', function () {
    if (galleryPosition >= 0) {
      return;
    }
    galleryPosition += GALLERY_STEP;

    carouselList.style.marginLeft = galleryPosition + '%';
  });
}

window.addEventListener('resize', function () {
  maxGalleryShift = isDesktopResolution() ? -200 : -500;
  galleryPosition = 0;

  if (carouselList) {
    carouselList.style.marginLeft = 0;
  }

  if (isDesktopResolution() && !mobileMenu.classList.contains('hidden')) {
    toggleVisibility(mobileMenu);
  }

  if (filter) {
    if (isDesktopResolution() && filterForm.classList.contains('hidden')) {
      filterForm.classList.remove('hidden');
    }

    if (!isDesktopResolution()) {
      filterForm.classList.add('hidden');
    }
  }
});

function initialize() {
  if (mobileMenu.classList.contains('no-js')) {
    mobileMenu.classList.remove('no-js');
  }

  if (!filterForm) {
    return;
  }

  if (!isDesktopResolution() && !filterForm.classList.contains('hidden')) {
    filterForm.classList.add('hidden');
  }
}

initialize();
