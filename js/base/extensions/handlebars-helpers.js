// Различные хэлперы для Handlebars
define(['handlebars'], function(Handlebars) {
	// Конвертирует символы строки в нижний регистр
	Handlebars.registerHelper('toLowerCase', function(string) {
		return string.toLowerCase();
	});

	// Отрисовывает options
	Handlebars.registerHelper('options', function(data) {
		var directory = data.hash.directory,
			key = data.hash.key,
			options = data.hash.insertBlank ? '<options></options>' : '';

		if (directory) {
			for (var i = 0, length = directory.length, item; i < length; i++) {
				item = directory[i];
				options += '<option value="' + item.Key + '"' + (item.Key === key ? ' selected="selected"' : '') + '>' + item.Name + '</option>';
			}
		}

		return options;
	});

	// Выводит значение словаря по ключу
	Handlebars.registerHelper('directoryValue', function(data) {
		var directory = data.hash.directory,
			key = data.hash.key,
			value;

		if (directory) {
			for (var i = 0, length = directory.length, item; i < length; i++) {
				item = directory[i];

				if (item.Key == key) {
					value = item.Name;
					break;
				}
			}
		}

		return value;
	});
});