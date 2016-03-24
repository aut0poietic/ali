/*!
 * --------------------------------------------------------------------------
 * Ali - Accessible Learning Interactions (
 * Copyright 2016 Jer Brand / Irresponsible Art
 * Licensed GPL (https://github.com/aut0poietic/ali/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

"use strict";

jQuery(function ($) {
  if (window.ali_ManualInit === undefined) {
    $('[data-ali="accordion"]').accordion();
  }
});
