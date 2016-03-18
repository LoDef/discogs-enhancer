/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 * @discogs: https://www.discogs.com/user/mattsalcido
 *
 */

/**
 *
 * These functions are used exclusively for sorting the
 * user's personal lists.
 *
 */

$(document).ready(function() {

  var
      clicks = 1,
      desc = false,
      sortName,
      storage;

  // Link sorter function
  function compareOptions(a1, a2) {

    var t1 = $(a1).text(),
        t2 = $(a2).text();

    return t1 > t2 ? 1 : (t1 < t2 ? -1 : 0);
  }



  function sortPersonalLists(options, sortDescending) {

    var listOldPick = $('#list_oldpick'),
        optionsArray = [];

    // The options are rewritten everytime the modal is called
    // so we wait 150ms then sort them.
    optionsArray = options.map(function() { return this; }).get();

    optionsArray.sort(compareOptions);

    if (sortDescending) { optionsArray.reverse(); }

    listOldPick.find('option').remove();

    listOldPick.append( $('<option></option>').html('Sorting...') );

    // intentional delay for illustrative purposes only
    setTimeout(function(){

      listOldPick.find('option').remove();

      $(optionsArray).each(function(index) {

        listOldPick.append(optionsArray[index]);
      });

      // Select the first option after reordering
      listOldPick.val( $('#list_oldpick option:first').val() );
    }, 100);
  }


  function setButtonText(elem) {

    if ( elem.text() === 'Sort A-Z') {

      sortName = 'Sort Z-A';

      return sortName;

    } else if ( elem.text() === 'Sort Z-A') {

      sortName = 'Most Recent';

      return sortName;

    } else if ( elem.text() === 'Most Recent') {

      sortName = 'Sort A-Z';

      return sortName;
    }
  }


  // Add new button functionality
  function registerOptionButtonClicks() {

    var listOldPick = $('#list_oldpick');

    $('#sortPLists').click(function() {

      setButtonText($(this));

      clicks++;

      if (clicks > 3) {

        listOldPick.find('option').remove();

        listOldPick.append( $('<option></option>').html('Undoing...') );

        // intentional delay for illustrative purposes only
        setTimeout(function() {

          listOldPick.html(storage.html());
        }, 100);

        clicks = 1;

        $(this).text(sortName);

        return false;

      } else {

        sortPersonalLists( $('#list_oldpick option'), desc );

        desc = !desc;

        $(this).text(sortName);

        return false;
      }
    });

    // Reset our |desc| value when canceled or saved.
    $('.ui-dialog-titlebar-close').click(function() { desc = false; });

    $('.lists_list_add_cancel').click(function() { desc = false; });

    $('.lists_list_add_save').click(function() { desc = false; });
  }



  $('.add_to_list').on('click', function() {

    var findList,
        findAdd,
        sortButton = '<div style="position: absolute; left: 295px; top: 10px;">' +
                     '<button id="sortPLists" ' +
                     'class="button button_blue" ' +
                     'style="margin-bottom: 10px;' +
                     'width: 95px;">Sort A-Z</button>' +
                     '</div>';

    desc = false;

    findList = setInterval(function() {

      // Make sure the select exists
      if ( $('#list_oldpick option').length > 0 ) {

        // fire sorting upon first click
        // (might be cool to make this an option in the menu)
        //sortPersonalLists($('#list_oldpick option'), desc);

        // Insert our sort button
        findAdd = setInterval(function() {

          if ( $('#listadd').length ) {

            clearInterval(findAdd);

            storage = $('#list_oldpick').clone(true);

            $(sortButton).insertAfter( $('#listadd') );

            registerOptionButtonClicks();
          }
        }, 100);

        clearInterval(findList);
      }
    }, 100);
  });

});
