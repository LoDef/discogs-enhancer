/**
 * Suggested Prices feature
 */

import { applySave, fadeOut } from '../utils';

// ========================================================
// getCurrency
// ========================================================
 /**
  * Gets and saves currency preferences
  * @method   getCurrency
  * @return   {undefined}
  */
 export function getCurrency() {

   let togglePrices = document.getElementById('togglePrices'),
       userCurrency = document.getElementById('currency');

   chrome.storage.sync.get('prefs', function(result) {

     // if there is a saved value, set the select with it
     if (result.prefs.userCurrency) {
       userCurrency.value = result.prefs.userCurrency;

       // validation
       if (userCurrency.value !== '-' && togglePrices.checked === true) {
         userCurrency.disabled = true;
       }

     } else {

       togglePrices.checked = false;
       userCurrency.disabled = false;
     }
   });
 }

// ========================================================
// showPrices
// ========================================================
 /**
  * Toggles price comparisons and displays an Error
  * if a currency value is not selected.
  * @method   showPrices
  * @param    {Object}   event [The event object]
  * @return   {undefined}
  */
 export function showPrices(event) {

   let togglePrices = document.getElementById('togglePrices'),
       userCurrency = document.getElementById('currency');

   if (event.target.checked && userCurrency.value !== '-') {

       userCurrency.disabled = true;
       togglePrices.checked = true;
       userCurrency.className = '';

       applySave('refresh', event);

     }

     else if (userCurrency.value === '-') {

       let message =  'Please choose a currency from the select box first.',
           notifications = document.getElementsByClassName('notifications')[0];

       document.getElementById('notify').textContent = message;

       notifications.addClasses('show');

       setTimeout(() => { fadeOut(notifications); }, 1500);

       togglePrices.checked = false;
       userCurrency.className = 'alert';
       return;

     } else {

       userCurrency.disabled = false;
       applySave('refresh', event);
   }
 }
