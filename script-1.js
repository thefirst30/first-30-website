const menu=document.querySelector('#menu'),nav=document.querySelector('#navlinks');
function closeMenu(restoreFocus=false){
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  if(restoreFocus) menu.focus();
}
menu.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav.classList.contains('open')){
    event.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('focusin',event=>{
  if(nav.classList.contains('open')&&!nav.contains(event.target)&&!menu.contains(event.target)){
    closeMenu();
  }
});

const introFilm = document.querySelector('#intro-film');
const filmFallback = document.querySelector('#intro-film-fallback');

function showFilmFallback() {
  introFilm.replaceWith(filmFallback);
  filmFallback.hidden = false;
}

introFilm.addEventListener('error', showFilmFallback, { once: true });
if (introFilm.error || typeof introFilm.play !== 'function') showFilmFallback();
