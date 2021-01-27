if (localStorage.getItem('cookieSeen') != 'shown') {
  $('.cookie-banner').delay(2000).fadeIn();
  localStorage.setItem('cookieSeen','shown');
};
$('.close').click(function() {
  $('.cookie-banner').fadeOut();
})