var htmlTemplates = {};

htmlTemplates["dialog"] = "<div class=\"dialog\" role=\"alertdialog\">\n" +
   "	<div class=\"dialog-window\" role=\"document\" tabindex=\"0\" aria-label=\"{{label}}\" aria-describedby=\"dialog-inner\">\n" +
   "		<div id=\"dialog-inner\" class=\"dialog-window-inner\">{{{content}}}</div>\n" +
   "		<div class=\"dialog-window-actions\">\n" +
   "			<button type=\"button\" class=\"dialog-window-actions-close\">OK</button>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>";
