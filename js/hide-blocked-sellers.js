/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO separate getting sellers list (as content script) and hiding blocked sellers functionality (as toggleable)
$(document).ready(function() {

  let
      blockList,
      loc = window.location.href,
      sellPage = /sell\/list/g,
      sellerPage = /seller/g,
      sellRelease = /sell\/release/g,
      wantsPage = /sell\/mywants/g;

  // Find all instances of sellers in list and hide them
  function hideSellers() {

    // Get current blockList
    blockList = JSON.parse(localStorage.getItem('blockList'));

    // Draxx them sklounst
    blockList.forEach(function(seller) {

      if ($('td.seller_info:contains(' + seller + ')')) {

        $('td.seller_info:contains(' + seller + ')').parent().css({opacity: '0.5'}).addClass('blocked-seller');
      }
    });
  }

  if (loc.match(sellPage) || loc.match(sellRelease) || loc.match(sellerPage) || loc.match(wantsPage)) {

    // Get current list of blocked sellers from the dark side of the extension
    try {

      chrome.runtime.sendMessage({request: 'getBlockedSellers'}, function(response) {

        blockList = response.blockList;

        console.log('blocked sellers response', blockList);

        blockList = JSON.stringify(blockList);

        localStorage.setItem('blockList', blockList);

        // hide when page first loads
        hideSellers();
      });

    } catch(err) {

      // the chrome.runtime method above ^ seems to run twice so suppress error unless it's from something else...
      if (err.message !== 'Invalid arguments to connect.') {

        console.warn('Discogs Enhancer: ', err);
      }
    }

    // Call hideSellers on prev/next clicks
    $('body').on('click', '.pagination_next, .pagination_previous', function() {

      $(document).ajaxSuccess(function() {

        hideSellers();
      });
    });
  }
});