var API_KEY = "b6acJdZbS7uxCFeDbCv2vFdCFPHTd800RYhqxjRV";
var globalData = ['', '', ''];
var body = document.querySelector('body');
var center = document.querySelector('#center-main');
var centerTitle = document.querySelector('#center-title');
var centerParagraph = document.querySelector('#center-story');
var bgImg = document.querySelector('img#bg-img');
var centerImg = document.querySelector('img#center-img');
var dateInput = document.querySelector('#date-input');
var submitBtn = document.querySelector('#submit');
var favouriteBtn = document.querySelector('#favourite');
var favouritesContainer = document.querySelector('#favourites-container');
function isDate1BeforeDate2(date1, date2) {
    var _a = date1.split('-').map(Number), year1 = _a[0], day1 = _a[1], month1 = _a[2];
    var _b = date2.split('-').map(Number), year2 = _b[0], day2 = _b[1], month2 = _b[2];
    var date1Obj = new Date(year1, month1 - 1, day1);
    var date2Obj = new Date(year2, month2 - 1, day2);
    console.log(date1, date2);
    console.log(date1Obj, date2Obj);
    return date1Obj < date2Obj;
}
function getRandomBackground() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=".concat(API_KEY, "&count=1")).then(function (response) { return response.json(); }).then(function (_data) {
        var data = _data[0];
        if (data.media_type != "image")
            return getRandomBackground();
        globalData[0] = data.title;
        globalData[1] = data.url;
        globalData[2] = data.hdurl;
        bgImg.src = data.url;
        centerImg.src = data.url;
        dateInput.value = data.date;
        centerTitle.innerText = data.title;
        centerParagraph.innerText = data.explanation;
    });
}
center.onclick = function (e) {
    showModal(globalData[2]);
};
function showModal(hdurl) {
    var modalImg = document.getElementById('modal-image');
    var modal = document.getElementById('app-modal');
    modalImg.src = "";
    modalImg.src = hdurl;
    modal.classList.remove('hide');
}
function hideModal() {
    var modal = document.getElementById('app-modal');
    modal.classList.add('hide');
}
submitBtn.onclick = function (e) {
    var today = new Date(Date.now());
    var todaysDate = "".concat(today.getFullYear(), "-").concat(today.getMonth(), "-").concat(today.getDate());
    if (!isDate1BeforeDate2(dateInput.value, todaysDate))
        return showMessage("Invalid date, ".concat(dateInput.value, " is after yesterday"), 3);
    // if(isDate1BeforeDate2(dateInput.value, "1995-06-16")) return showMessage(`Invalid date, minimum date is 1995-06-16`, 3);
    fetch("https://api.nasa.gov/planetary/apod?api_key=".concat(API_KEY, "&date=").concat(dateInput.value)).then(function (response) {
        if (response.status == 400)
            return showMessage("invalid date entered", 3);
        if (response.status != 200)
            return showMessage("an error occurred", 3);
        return response.json();
    }).then(function (_data) {
        var data = _data;
        if (data.media_type != "image")
            return showMessage("the media for ".concat(dateInput.value, " is a Video"), 3);
        globalData[0] = data.title;
        globalData[1] = data.url;
        globalData[2] = data.hdurl;
        bgImg.src = data.url;
        centerImg.src = data.url;
        dateInput.value = data.date;
        centerTitle.innerText = data.title;
        centerParagraph.innerText = data.explanation;
    });
};
window.onload = function (e) {
    getRandomBackground();
    loadFavourites();
};
favouriteBtn.onclick = function (e) {
    pushToStorage.apply(void 0, globalData);
};
function getFavourites() {
    var _a;
    var data = (_a = localStorage.getItem('imageArray')) !== null && _a !== void 0 ? _a : '[]';
    return JSON.parse(data);
}
function loadFavourites() {
    var favs = getFavourites();
    favouritesContainer.innerHTML = '';
    favs.forEach(function (item) {
        var template = "\n      <div class=\"col-12 p-3 col-sm-6 p-sm-2 col-md-4 col-lg-3\">\n            <div class=\"fav-card dbor10 doverh shadow dposr\" onclick=\"showModal('".concat(item['hdurl'], "')\">\n              <img src=\"").concat(item['url'], "\" alt=\"\" class=\"w-100 h-100\" />\n              <div class=\"dposa contents dl0 dt0 h-100 w-100 dflex dfdc djcsb t1 p-2\">\n                <div class=\"\">\n                  <button\n                    class=\"dbtn1 rounded bg1 t2 doutn dborn px-2\"\n                    title=\"remove from favorites\"\n                    onclick=\"removeFromFavourites('").concat(item['url'], "')\"\n                  >\n                    <i class=\"fas fa-heart\"></i>-\n                  </button>\n                </div>\n                <h6>").concat(item['title'], "</h6>\n              </div>\n            </div>\n            </div>\n            ");
        favouritesContainer.innerHTML += template;
    });
}
function pushToStorage(title, url, hdurl) {
    var imageData = {
        url: url,
        hdurl: hdurl,
        title: title,
    };
    var canProceed = true;
    (getFavourites()).forEach(function (element) {
        if (imageData.url == element['url']) {
            canProceed = false;
        }
    });
    if (!canProceed)
        return;
    var imageArray = JSON.parse(localStorage.getItem('imageArray') || '[]');
    imageArray.push(imageData);
    localStorage.setItem('imageArray', JSON.stringify(imageArray));
    loadFavourites();
    showMessage("added \"".concat(title, "\" to favourites"), 3);
}
function clearFavourites() {
    localStorage.removeItem('imageArray');
    loadFavourites();
}
function removeFromFavourites(url) {
    var items = getFavourites();
    var updatedArray = [];
    items.forEach(function (item) {
        if (item['url'] != url) {
            updatedArray.push(item);
        }
    });
    localStorage.setItem('imageArray', JSON.stringify(updatedArray));
    loadFavourites();
}
function showMessage(message, delay) {
    var _a;
    if (delay === void 0) { delay = 0; }
    document.querySelector('.pop p').innerHTML = message;
    (_a = document.querySelector('.pop')) === null || _a === void 0 ? void 0 : _a.classList.add('show');
    if (delay !== 0) {
        setTimeout(function () {
            hideMessage();
        }, delay * 1000);
    }
}
function hideMessage() {
    var _a;
    (_a = document.querySelector('.pop')) === null || _a === void 0 ? void 0 : _a.classList.remove('show');
}
