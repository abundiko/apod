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
function isDate1BeforeDate2(date1:string, date2:string) : boolean {
  const [year1, day1, month1 ] = date1.split('-').map(Number);
  const [year2, day2, month2 ] = date2.split('-').map(Number);

  const date1Obj = new Date(year1, month1 - 1, day1);
  const date2Obj = new Date(year2, month2 - 1, day2);

  console.log(date1, date2);
  console.log(date1Obj, date2Obj);
  

  return date1Obj < date2Obj;
}

function getRandomBackground() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1`).then(response => response.json() ).then(_data => {
    const data = _data[0] as ApiResult;  
    if(data.media_type != "image") return getRandomBackground();  
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

center.onclick=e=>{
  showModal(globalData[2]);
}

function showModal(hdurl:string) {
  const modalImg = document.getElementById('modal-image') as HTMLImageElement;
  const modal = document.getElementById('app-modal') as HTMLDivElement;
  modalImg.src = "";
  modalImg.src = hdurl;
  modal.classList.remove('hide')
}

function hideModal() {
  const modal = document.getElementById('app-modal') as HTMLDivElement;
  modal.classList.add('hide');
}

submitBtn.onclick = e => {
  const today = new Date(Date.now());
  const todaysDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  if(!isDate1BeforeDate2(dateInput.value, todaysDate)) return showMessage(`Invalid date, ${dateInput.value} is after yesterday`, 3);
  // if(isDate1BeforeDate2(dateInput.value, "1995-06-16")) return showMessage(`Invalid date, minimum date is 1995-06-16`, 3);
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateInput.value}`).then(response => {
    if(response.status == 400)  return showMessage(`invalid date entered`, 3);
    if(response.status != 200)  return showMessage(`an error occurred`, 3);
    return response.json();
  } ).then(_data => {
    const data = _data as ApiResult;    
    if(data.media_type != "image") return showMessage(`the media for ${dateInput.value} is a Video`, 3);  
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
            <div class="fav-card dbor10 doverh shadow dposr" onclick="showModal('${item['hdurl']}')">
              <img src="${item['url']}" alt="" class="w-100 h-100" />
              <div class="dposa contents dl0 dt0 h-100 w-100 dflex dfdc djcsb t1 p-2">
                <div class="">
                  <button
                    class="dbtn1 rounded bg1 t2 doutn dborn px-2"
                    title="remove from favorites"
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
  showMessage(`added "${title}" to favourites`, 3);
}

function clearFavourites() {
  localStorage.removeItem('imageArray');
  loadFavourites();

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

function showMessage(message:string, delay:number = 0) {
  document.querySelector('.pop p')!.innerHTML = message;
  document.querySelector('.pop')?.classList.add('show');
  if(delay !== 0){
    setTimeout(() => {
      hideMessage();
    }, delay * 1000);
  }
}

function hideMessage() {
  document.querySelector('.pop')?.classList.remove('show');
}