
const API_KEY = '38400499-9377fca084918dc6c22b9bff8';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const mes = document.querySelector('.end-message');

let searchQuery = '';
let page = 1;
function showErrorNotification(message) {
    Notiflix.Notify.failure(message);
}
async function searchImages() {
  if (!searchQuery) {
    showErrorNotification('Please enter a search query.');
    return;
  }

  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    searchQuery
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.totalHits === 0) {
      if (page === 1) {
        showErrorNotification(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        showErrorNotification(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.display = 'none'; 
      }
    } else {
      if (page === 1) {
        gallery.innerHTML = ''; 
      }

      data.hits.forEach((image) => {
        const card = createPhotoCard(image);
        gallery.appendChild(card);
      });

      if (data.totalHits <= page * 40) {
        loadMoreBtn.style.display = 'none'; 
       
        mes.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'flex'; 
        mes.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    //showErrorNotification('Failed to fetch images. Please try again later.');
  }
}


function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

  info.appendChild(likes);
  info.appendChild(views);
  info.appendChild(comments);
  info.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}



form.addEventListener('submit', (e) => {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;
    searchImages();
    
});

loadMoreBtn.addEventListener('click', () => {
  page += 1;
    searchImages();
        
});