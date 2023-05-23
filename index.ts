const API_KEY : string = "b6acJdZbS7uxCFeDbCv2vFdCFPHTd800RYhqxjRV";
const globalData : [string, string, string] = ['','',''];

const body = document.querySelector('body')!;
const center = document.querySelector('#center-main') as HTMLDivElement;
const centerTitle = document.querySelector('#center-title') as HTMLHeadingElement;
const centerParagraph = document.querySelector('#center-story') as HTMLParagraphElement;
const bgImg = document.querySelector('img#bg-img') as HTMLImageElement;
const centerImg = document.querySelector('img#center-img') as HTMLImageElement;

const dateInput = document.querySelector('#date-input') as HTMLDataElement;
const submitBtn = document.querySelector('#submit') as HTMLButtonElement;
const favouriteBtn = document.querySelector('#favourite') as HTMLButtonElement;
const favouritesContainer = document.querySelector('#favourites-container') as HTMLDivElement;

type ApiResult={
  title: string,
  url: string,
  hdurl: string,
  date:string,
  explanation:string,
  media_type:string,
}

function getRandomBackground() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`).then(response => response.json() ).then(_data => {
    const data = _data[0] as ApiResult;    
    globalData[0] = data.title;
    globalData[1] = data.url;
    globalData[2] = data.hdurl;
    bgImg.src = data.url;
    centerImg.src = data.url;
    dateInput.value = data.date;
    centerTitle.innerText = data.title;
    centerParagraph.innerText = data.explanation;
  })
}

submitBtn.onclick = e => {
  console.log(dateInput.value);
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateInput.value}`).then(response => response.json() ).then(_data => {
    const data = _data as ApiResult;    
    
    globalData[0] = data.title;
    globalData[1] = data.url;
    globalData[2] = data.hdurl;
    bgImg.src = data.url;
    centerImg.src = data.url;
    dateInput.value = data.date;
    centerTitle.innerText = data.title;
    centerParagraph.innerText = data.explanation;
  })
}

window.onload = e => {
  getRandomBackground();
  // clearFavourites()
  loadFavourites();
}

favouriteBtn.onclick = e =>{
  pushToStorage(...globalData)
}
function getFavourites() : object[] {
  const data = localStorage.getItem('imageArray') ?? '[]';
  return JSON.parse(data) as object[];
}
  function loadFavourites() {
    const favs = getFavourites();
    favouritesContainer.innerHTML = '';
    favs.forEach(item => {
      
      let template = `
      <div class="col-12 p-3 col-sm-6 p-sm-2 col-md-4 col-lg-3">
            <div class="fav-card dbor10 doverh shadow dposr">
              <img src="${item['url']}" alt="" class="w-100 h-100" />
              <div class="dposa dl0 dt0 h-100 w-100 dflex dfdc djcsb t1 p-2">
                <div class="">
                  <button
                    class="dbtn1 rounded bg1 t2 doutn dborn px-2"
                    title="remove from favorites"
                    id=""
                    data-url=""
                    onclick="removeFromFavourites('${item['url']}')"
                  >
                    <i class="fas fa-heart"></i>-
                  </button>
                </div>
                <h6>${item['title']}</h6>
              </div>
            </div>
            </div>
            `;
            favouritesContainer.innerHTML += template;
          });
  }
function pushToStorage( title: string,url: string, hdurl: string,): void {
  const imageData = {
    url: url,
    hdurl: hdurl,
    title: title,
  }



  
  let canProceed = true;
  (getFavourites()).forEach(element => {
    if (imageData.url == element['url']) {
      canProceed = false;
    }
  });

  if(!canProceed) return;

  const imageArray: any[] = JSON.parse(localStorage.getItem('imageArray') || '[]');
  imageArray.push(imageData);
  localStorage.setItem('imageArray', JSON.stringify(imageArray));
  loadFavourites()
  
}

function clearFavourites() {
  localStorage.removeItem('imageArray');
}

function removeFromFavourites(url: string): void {
  const items = getFavourites();
  let updatedArray : object[] = [];
  items.forEach(item => {
    if(item['url'] != url){
      updatedArray.push(item);
    }
  }); 
  localStorage.setItem('imageArray', JSON.stringify(updatedArray));
  loadFavourites();
}