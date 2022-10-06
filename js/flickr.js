/*
key name :
2b77b0bf16caab8d0940ed8495c064dc
*/

const key = '2b77b0bf16caab8d0940ed8495c064dc';
const method1 = 'flickr.interestingness.getList';
const method2 = 'flickr.photos.search';
const base = 'https://www.flickr.com/services/rest?';
const per_page = 20;
const format = 'json';

// URL
const url1 = `${base}method=${method1}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;
const url2 = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=바다&privacy_filter=1`;

// DOM 요소 제어
const body = document.querySelector('body');
const frame = document.querySelector('#list');
const loading = document.querySelector('.loading');
const input = document.querySelector('#search');
const btn = document.querySelector('.btnSearch');

callData(url1);

btn.addEventListener('click', () => {
  let tag = input.value;

  tag = tag.trim(); // 검색값의 공백을 없애는 메서드.

  const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;


  // input value값이 있을 때만 적용되는 코드를 쓰면 되겠죠?
  if(tag != '') {
    callData(url);
  } else {
    frame.innerHTML = '';
    frame.classList.remove('on');
    frame.getElementsByClassName.height = 'auto';

    const errMsgs = frame.parentElement.querySelectorAll('p');
    if(errMsgs.length > 0) frame.parentElement.querySelector('p').remove();

    const errMsg = document.createElement('p');
    errMsg.append('검색어를 입력하세요.');
    frame.parentElement.append(errMsg); // frame은 가상돔으로 만들었고 위에서 없애는 코드를 적었끼 때문에 frame이 아닌 부모에 에러메세지를 만들어야 한다.
  }
})

input.addEventListener('keypress', (e) => {
  if(e.keyCode == 13) {
    let tag = input.value;

    tag = tag.trim(); // 공백을 없애는 메서드

    const url = `${base}method=${method2}&api_key=${key}&per_page=${per_page}&format=${format}&nojsoncallback=1&tags=${tag}&privacy_filter=1`;
    callData(url);

    if(tag != '') {
      callData(url);
    } else {
      frame.innerHTML = '';
      frame.classList.remove('on');
      frame.getElementsByClassName.height = 'auto';
  
      const errMsgs = frame.parentElement.querySelectorAll('p');
      if(errMsgs.length > 0) frame.parentElement.querySelector('p').remove();
  
      const errMsg = document.createElement('p');
      errMsg.append('검색어를 입력하세요.');
      frame.parentElement.append(errMsg); // frame은 가상돔으로 만들었고 위에서 없애는 코드를 적었끼 때문에 frame이 아닌 부모에 에러메세지를 만들어야 한다.
    }
  }
})

frame.addEventListener('click', (e) => {
  e.preventDefault();

  if(e.target == frame) return;

  let target = e.target.closest('.item').querySelector('.thumb');

  if(e.target == target) { 
  let imgSrc = target.parentElement.getAttribute('href');
  let pop = document.createElement('aside');
  pop.classList.add('pop');

  let pops = `
    <img src="${imgSrc}">
    <span class="close">close</span>
  `;
  pop.innerHTML = pops;

  body.append(pop);

  } else {
    return;
  }
})

body.addEventListener('click', (e) => {
  let pop = body.querySelector('.pop');

  if(pop != null) { // pop이 존재한다는 것은 동적으로 pop을 생성한 이후의 선후관계를 명확히 물어보는 논리
    let close = pop.querySelector('.close');
    if(e.target == close) pop.remove();
  }
})


function callData(url) {

  frame.innerHTML = '';
  loading.classList.remove('off');
  frame.classList.remove('on');

  fetch(url)
    .then(data => {
      return data.json();
    })
    .then(json => {
      let items = json.photos.photo;
      if(items.length > 0) {
        createList(items);
        delayLoading();
      } else {
        loading.classList.add('off');

        const errMsgs = frame.parentElement.querySelectorAll('p');
        if(errMsgs.length > 0) frame.parentElement.querySelector('p').remove();
        
        const errMsg = document.createElement('p');
        errMsg.append('검색하신 검색어의 이미지가 없습니다.')
        frame.parentElement.append(errMsg);

        frame.classList.remove('on');
        frame.style.height = 'auto';
      }
    })
}


function createList(items) {
  let htmls = '';
  items.map(el => {
    let imgSrc = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_m.jpg`;

    let imgSrcBig = `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_b.jpg`;
    // size만 다를 뿐이라서 뒤에 m을 b로 고쳐줌.

    htmls += `
      <li class="item">
        <div>
          <a href=${imgSrcBig}>
            <img class="thumb" src=${imgSrc}>
          </a>
          <p>${el.title}</p>
          <span>
            <img class="profile" src="http://farm${el.farm}.staticflickr.com/${el.server}/buddyicons/${el.owner}.jpg">
            <strong>${el.owner}</strong>
          </span>
        </div>
      </li>
    `;

  })
  frame.innerHTML = htmls;

}


function delayLoading() {
  // 이미지들이 다 로딩이 되어있는지 확인하는 작업
  // 동적으로 생성된 이미지의 전체 갯수를 구한다.
  const imgs = frame.querySelectorAll('div a img');
  const len = imgs.length;
  let count = 0;
  for(let el of imgs) {
    // 아래는 el.addEventListener('load')와 같다.
    el.onload = () => {
      count++;
      if(count == len) isoLayout();
    }

    let thumb = el.closest('.item').querySelector('.thumb');
    thumb.onerror = e => {
      // 에러난 상황에서 대체 이미지를 넣는 방법
      e.currentTarget.closest('.item').querySelector('div a img').setAttribute('src', 'img/k1.jpg')
    }

    let profile =  el.closest('.item').querySelector('.profile');
    profile.onerror = e => {
      // e.currentTarget 가장 가까운 .item을 찾아서 그리고 그 안의 div a img를 찾아서 src 속성을 "img/k1.jpg" 대체해달라 - 썸네일 대체하는 코드.
      e.currentTarget.closest('.item').querySelector('div span img').setAttribute('src', 'https://www.flickr.com/images/buddyicon.gif')
    }
  }

}


function isoLayout() {

  loading.classList.add('off');
  frame.classList.add('on');

  new Isotope('#list', {
    itemSelector : '.item',
    columnWidth : '.item',
    transitionDuration : '0.5s'
  })
}
