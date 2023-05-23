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
function getRandomBackground() {
    fetch("https://api.nasa.gov/planetary/apod?api_key=".concat(API_KEY, "&count=1")).then(function (response) { return response.json(); }).then(function (_data) {
        var data = _data[0];
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
submitBtn.onclick = function (e) {
    console.log(dateInput.value);
    fetch("https://api.nasa.gov/planetary/apod?api_key=".concat(API_KEY, "&date=").concat(dateInput.value)).then(function (response) { return response.json(); }).then(function (_data) {
        var data = _data;
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
    // clearFavourites()
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
        var template = "\n      <div class=\"col-12 p-3 col-sm-6 p-sm-2 col-md-4 col-lg-3\">\n            <div class=\"fav-card dbor10 doverh shadow dposr\">\n              <img src=\"".concat(item['url'], "\" alt=\"\" class=\"w-100 h-100\" />\n              <div class=\"dposa dl0 dt0 h-100 w-100 dflex dfdc djcsb t1 p-2\">\n                <div class=\"\">\n                  <button\n                    class=\"dbtn1 rounded bg1 t2 doutn dborn px-2\"\n                    title=\"remove from favorites\"\n                    id=\"\"\n                    data-url=\"\"\n                    onclick=\"removeFromFavourites('").concat(item['url'], "')\"\n                  >\n                    <i class=\"fas fa-heart\"></i>-\n                  </button>\n                </div>\n                <h6>").concat(item['title'], "</h6>\n              </div>\n            </div>\n            </div>\n            ");
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
}
function clearFavourites() {
    localStorage.removeItem('imageArray');
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
