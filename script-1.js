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