/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

let analytics = localStorage.getItem('analytics') || true;

analytics = JSON.parse(analytics);

if (analytics) {

  var _gaq = _gaq || [];

  _gaq.push(['_setAccount', 'UA-75073435-1']);

  _gaq.push(['_trackPageview']);

  (function() {

    var ga = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];

    ga.type = 'text/javascript';

    ga.async = true;

    ga.src = 'https://ssl.google-analytics.com/ga.js';

    s.parentNode.insertBefore(ga, s);
  }());
}
