/*
youtube api key :
AIzaSyCtN1lqIIdi7ibHkYVCtVtP9vA4oz8j8n8

유튜브 playlist 여행 :
PLlXUbM-Wv86W_pA2wzZgQ7pF1VeHP6At4
*/

const vidList = document.querySelector('.vidList');
const key = 'AIzaSyCtN1lqIIdi7ibHkYVCtVtP9vA4oz8j8n8';
const playList = 'PLlXUbM-Wv86W_pA2wzZgQ7pF1VeHP6At4';
const num = 6; // 재생목록의 불러올 비디오 갯수

const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${key}&playlistId=${playList}&maxResults=${num}`;

fetch(url)
    .then(data => {
      return data.json();
    })
    .then(json => {
      let items = json.items;
      console.log(items);
      let result = '';


      items.map((item) => {

        let title = item.snippet.title;
        if(title.length >= 30) {
          title = title.substr(0, 30) + '...';
        }

        let con = item.snippet.description;
        if(con.length >= 100) {
          con = con.substr(0, 100) + '...';
        }
        
        let date = item.snippet.publishedAt;
        date = date.split('T')[0];

        result += `
          <article>
            <a href="${item.snippet.resourceId.videoId}" class="pic">
              <img src="${item.snippet.thumbnails.medium.url}">
            </a>
            <div class="con">
              <h2>${title}</h2>
              <p>${con}</p>
              <span>${date}</span>
            </div>
          </article>
        `
      })
      vidList.innerHTML = result;
    })

    vidList.addEventListener('click', (e) => {
      e.preventDefault();

      // if(!e.target.closest('a')) return;
      const vidId = e.target.closest('a').getAttribute('href');

      let pop = document.createElement('figure');
      pop.classList.add('pop');

      pop.innerHTML = `<iframe src="https://www.youtube.com/embed/${vidId}" frameborder="0" width="100%" height="100%" allowfullscreen>이 브라우저는 iframe을 지원하지 않습니다.</iframe>
      <span class="btnClose">close</span>
      `;

      vidList.append(pop);
    })

    vidList.addEventListener('click', (e) => {
      const pop = vidList.querySelector('.pop');
      if(pop) {
        const close = pop.querySelector('span');
        if(e.target == close) pop.remove();
      }
    })
