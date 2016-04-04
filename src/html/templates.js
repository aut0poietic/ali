var htmlTemplates = {};

htmlTemplates["feedback"] = "<div class=\"feedback\" aria-labelledby=\"feedback-{{count}}\" tabindex=\"-1\">\n" +
   "	<div class=\"feedback-inner\">{{{content}}}</div>\n" +
   "</div>";

htmlTemplates["feedbackContainer"] = "<div role=\"status\" aria-live=\"assertive\" aria-atomic=\"true\"></div>";

htmlTemplates["dialog"] = "<div class=\"dialog\" role=\"alertdialog\" tabindex=\"0\" aria-label=\"{{label}}\" aria-describedby=\"dialog-window\">\n" +
   "	<div id=\"dialog-window\" class=\"dialog-window\" role=\"document\" >\n" +
   "		<div class=\"dialog-window-inner\">{{{content}}}</div>\n" +
   "		<div class=\"dialog-window-actions\">\n" +
   "			<button type=\"button\" class=\"dialog-window-actions-close\">OK</button>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>";
