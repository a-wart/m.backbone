// Файл расширения возможностей отдельных объектов JavaScript
define(function() {

	var // Регулярки для
		trimRegex = /^\s+|\s+$/g; // тримирования строки

	// Переводит первый символ строки в верхний регистр
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	if (typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(trimRegex, '');
		};
	}

	if (typeof Function.prototype.bind !== 'function') {
		Function.prototype.bind = function() {
			var __method = this,
				args = Array.prototype.slice.call(arguments),
				object = args.shift();

			return function() {
				return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
			};
		};
	}

	// Добавляем поддержку indexOf массива для всяких IE
	if (!Array.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			for (var i = (start || 0); i < this.length; i++) {
				if (this[i] == obj) {
					return i;
				}
			}
			return -1;
		}
	}

});