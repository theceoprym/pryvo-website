/* Language lives in the URL so crawlers and visitors see the same content. */
(function () {
  'use strict';
  var language = new URLSearchParams(window.location.search).get('lang');
  var english = window.location.pathname.indexOf('/en/') === 0;
  if ((language === 'en' && !english) || (language === 'de' && english)) {
    window.location.replace((language === 'en' ? '/en/' : '/') + window.location.hash);
    return;
  }
  document.querySelectorAll('.lang a').forEach(function (link) {
    link.addEventListener('click', function () {
      link.hash = window.location.hash;
    });
  });
})();
