/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

document.addEventListener('DOMContentLoaded', function () {

  let
      config = JSON.parse(localStorage.getItem('readability')) || setDefaultConfig(),
      indexTracks = document.getElementById('toggleIndexTracks'),
      nth = document.getElementById('nth'),
      otherMedia = document.getElementById('toggleOtherMedia'),
      otherThreshold = document.getElementById('otherMediaThreshold'),
      size = document.getElementById('size'),
      vc = document.getElementById('toggleVCreleases'),
      vcThreshold = document.getElementById('vcThreshold');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Appends options to select elements
   *
   * @method   addOptions
   * @param    {object}   targetId
   * @param    {number}   total
   * @return   {object}
   */
  function addOptions(targetId, total) {

    let fragment = document.createDocumentFragment();

    for (let i = 1; i <= total; i++) {

      let option = document.createElement('option');

      option.text = i;
      option.value = i;
      fragment.appendChild(option);
    }

    return targetId.appendChild(fragment.cloneNode(true));
  }

  /**
   * Updates the config object to include a `size` property
   * for existing users who do not yet have this prop in their
   * config object.
   *
   * @TODO delete this some time in the future
   * @method insertDividerSizeProperty
   * @return {object}
   */
  function insertDividerSizeProperty() {

    if ( !config.size ) {

      let newConfig = JSON.parse(localStorage.getItem('readability'));

      newConfig.size = 0.5;
      localStorage.setItem('readability', JSON.stringify(newConfig));

      return config = JSON.parse(localStorage.getItem('readability'));
    }
  }

  /**
   * Sets default values in the config object
   *
   * @method setDefaultConfig
   * @return {object}
   */
  function setDefaultConfig() {

    let defaults = {
          indexTracks: false,
          nth: 10,
          otherMediaReadability: false,
          otherMediaThreshold: 15,
          size: 0.5,
          vcReadability: true,
          vcThreshold: 8
        };

    localStorage.setItem('readability', JSON.stringify(defaults));

    return JSON.parse(localStorage.getItem('readability'));
  }

  // Add new size property if necessary
  // TODO: delete this at some point in the future
  insertDividerSizeProperty();

  // ========================================================
  // DOM setup
  // ========================================================

  // Set values based on config
  vc.checked = config.vcReadability;
  otherMedia.checked = config.otherMediaReadability;
  indexTracks.checked = config.indexTracks;
  size.value = config.size;

  addOptions(vcThreshold, 30);
  vcThreshold.value = config.vcThreshold;

  addOptions(otherThreshold, 30);
  otherThreshold.value = config.otherMediaThreshold;

  addOptions(nth, 30);
  nth.value = config.nth;

  // ==============================================
  // UI functionality
  // ==============================================

  // Vinyl, cassette, box sets, etc ...

  document.getElementById('toggleVCreleases').addEventListener('click', function() {

    config.vcReadability = event.target.checked;

    localStorage.setItem('readability', JSON.stringify(config));
  });

  // Single CD, digital, etc ...
  document.getElementById('toggleOtherMedia').addEventListener('click', function() {

    config.otherMediaReadability = event.target.checked;

    localStorage.setItem('readability', JSON.stringify(config));
  });

  // Classical releases
  document.getElementById('toggleIndexTracks').addEventListener('click', function() {

    config.indexTracks = event.target.checked;

    localStorage.setItem('readability', JSON.stringify(config));
  });

  // Value changes
  [...document.getElementsByTagName('select')].forEach(function(select) {

    select.addEventListener('change', function(event) {

      config[event.target.id] = event.target.value;

      localStorage.setItem('readability', JSON.stringify(config));
    });
  });
});
