/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview ㊙
 * ---------------------------------------------------------------------------
 *
 * This will count the number of friends you have in your friend list. It stops
 * counting after 50 and just lists "50+" at that point. It is always enabled
 * when using this extension and it's not listed as a feature. I personally
 * find it useful but I'm not sure it has much value for anyone else so it's
 * a secret to everybody!
 */

window.addEventListener('load', function() {

  let href = window.location.href,
      friendPage = href.includes('/users/friends');

  if ( friendPage ) {

    let count = document.querySelectorAll('.linked_username').length,
        max = '50+',
        total = count > 50 ? max : count;

    document.querySelector('#page_content h1').textContent += ` (${total})`;
  }
});
