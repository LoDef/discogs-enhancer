/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

// TODO add buttons to list comments $('.textedit_content')

// TODO move appending functionality into a method so it can be called
// via reply links/events in comments, etc.

$(document).ready(function() {

  // this timeout insures that this code executes after
  // jquery has been extended so that calls to `getCursorPosition`
  // and `selectRange` will work correctly. Also, the comments field
  // doesn't seem to be part of the DOM even after the document onDOMContentLoaded
  // event has fired. So I'm waiting 500ms before executing this block.
  setTimeout(function() {

    let t = document.getElementsByTagName('textarea'),
        hasTextarea = false;

    // see if any review boxes exist on the page
    if ( t.length ) {

      for ( let i in t ) {

        // reviews
        if ( t[i].id === 'review' ) {
          hasTextarea = true;
        }

        // comments
        if ( t[i].name === 'comment' ) {
          hasTextarea = true;
        }

        // new threads in groups/forums
        if ( t[i].id === 'text' ) {
          hasTextarea = true;
        }

        // forum/group replies
        if ( t[i].className && t[i].className.includes('forum_reply') ) {
          hasTextarea = true;
        }
      }
    } else {

      return;
    }

    // inject markup if necessary
    if ( hasTextarea && !!$.prototype.getCursorPosition && !!$.prototype.getSelectedText ) {

      let selected = '',
          markup = '<div class="quick-menu">' +
                      '<button class="quick-button quick-link" title="Insert url">' +
                        '<i class="icon icon-chain"></i>' +
                      '</button>' +
                      '<button class="quick-button quick-bold" title="Insert bold code">B</button>' +
                      '<button class="quick-button quick-italic" title="Insert italic code">I</button>' +
                      '<button class="quick-button quick-strikethrough" title="Insert strikethrough code">S</button>' +
                      '<button class="quick-button quick-underline" title="Insert underline code">U</button>' +
                    '</div>';

      // Inject buttons into DOM
      $(markup).insertAfter( $('textarea') );

      // maintain selected text
      $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').mousedown(function(event) {

        selected = $(this).parent().siblings('textarea').getSelectedText();
      });

      // bold, italic, strikethrough and underline
      $('.quick-bold, .quick-italic, .quick-strikethrough, .quick-underline').click(function(event) {

        let
            closer,
            opener,
            textarea = $(this).parent().siblings('textarea'),
            syntax,
            position = textarea.getCursorPosition(),
            text = textarea.val();

        event.preventDefault();

        if ( $(this).hasClass('quick-bold') ) {

          opener = '[b]';
          closer = '[/b]';

        } else if ( $(this).hasClass('quick-italic') ) {

          opener = '[i]';
          closer = '[/i]';

        } else if ( $(this).hasClass('quick-strikethrough') ) {

          opener = '[s]';
          closer = '[/s]';

        } else if ( $(this).hasClass('quick-underline') ) {

          opener = '[u]';
          closer = '[/u]';
        }

        // Either wrap the selected text with the markup or insert it by itself
        syntax = selected ? opener + selected + closer : opener + closer;

        // insert appropriate tag syntax
        textarea.val( text.substr(0, position) + syntax + text.substr(position + selected.length) );

        // adjust cursor position to fit between the tags
        textarea.selectRange( position + 3 );

        // set the focus
        textarea.focus().change();
      });

      // URLs
      $('.quick-button.quick-link').click(function(event) {

        let
            textarea = $(this).parent().siblings('textarea'),
            discogs = 'https://www.discogs.com',
            guideline = /(\d+\.+\d*)/g,
            link = window.prompt('Paste your link or guideline number (ie: 1.2.3) here:'),
            position = textarea.getCursorPosition(),
            syntax,
            text = textarea.val();

        event.preventDefault();

        // artists
        if ( link.includes('/artist/') && link.includes(discogs) ) {

          let artist = resourceLibrary.parseURL(link);
          syntax = '[a' + artist + ']';

        // guidelines
        } else if ( guideline.test(link) && !link.includes(discogs) && !link.includes('http') ) {

          syntax = '[g' + link + ']';

        // labels
        } else if ( link.includes('/label/') && link.includes(discogs) ) {

          let label = resourceLibrary.parseURL(link);
          syntax = '[l' + label + ']';

        // masters
        } else if ( link.includes('/master/') && link.includes(discogs) ) {

          let master = resourceLibrary.parseURL(link);
          syntax = '[m' + master + ']';

        // releases
        } else if ( link.includes('/release/') && link.includes(discogs) ) {

          let release = resourceLibrary.parseURL(link);
          syntax = '[r' + release + ']';

        // topics
        } else if ( link.includes('/forum/thread/') && link.includes(discogs) ) {

          let topic = resourceLibrary.parseURL(link);
          syntax = '[t=' + topic + ']';

        // user
        } else if ( link.includes('/user/') && link.includes(discogs) ) {

          syntax = '[u=' + link.split('/')[link.split('/').length - 1] + ']';

        // non-discogs urls
        } else if (link.includes('http') ) {

          syntax = '[url=' + link + '][/url]';

          // insert appropriate tag syntax
          textarea.val( text.substr(0, position) + syntax + text.substr(position) );

          // adjust cursor position to fit between URL tags
          textarea.selectRange(position + (link.length + 6));

          // set the focus
          textarea.focus().change();

          return;

        } else {
          // 'a link has no name...'
          alert('A valid link or guideline number was not recognized. \nPlease make sure links begin with http:// or https:// and guidelines are in an x.x.x format. \n\nYou can learn more about the requirements by clicking "About" from the Discogs Enhancer popup menu and reading the section called "Text Format Shortcuts".');

          return;
        }

        // insert appropriate tag syntax
        textarea.val( text.substr(0, position) + syntax + text.substr(position) );

        // adjust cursor position to end of the inserted tag
        textarea.selectRange( position + syntax.length );

        // set the focus
        textarea.focus().change();
      });
    }
  }, 500);
});
