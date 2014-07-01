describe('Modals', function () {

	//
	// Helper Functions
	//

	/**
	 * Inserts markup into DOM
	 */
	var injectElem = function () {
		var elem =
			'<a data-modal="#modal" href="#">Modal Toggle</a>' +
			'<div class="modal" data-modal-window id="modal">' +
				'<a class="close" data-modal-close>x</a>' +
				'<h3>Modal</h3>' +
				'<p>Modal content</p>' +
				'<button data-modal-close>Close</button>' +
			'</div>';
		document.body.innerHTML = elem;
	};

	/**
	 * Triggers an event
	 * @param  {String} type Type of event (ex. 'click')
	 * @param  {Element} elem The element that triggered the event
	 * @link http://stackoverflow.com/a/2490876
	 */
	var trigger = function (type, elem) {
		var event; // The custom event that will be created

		if (document.createEvent) {
			event = document.createEvent('HTMLEvents');
			event.initEvent(type, true, true);
		} else {
			event = document.createEventObject();
			event.eventType = type;
		}

		if (document.createEvent) {
			elem.dispatchEvent(event);
		} else {
			elem.fireEvent("on" + event.eventType, event);
		}
	};

	/**
	 * Bind polyfill for PhantomJS
	 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = Array.prototype.slice.call(arguments, 1);
			var fToBind = this;
			var fNOP = function () {};
			var fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
			};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}


	//
	// Init
	//

	describe('Should initialize plugin', function () {

		beforeEach(function () {
			modals.init();
		});

		it('Document should include the modals module', function () {
			expect(!!modals).toBe(true);
		});

	});

	describe('Should merge user options into defaults', function () {

		var toggle, content, doc;

		beforeEach(function () {
			injectElem();
			modals.init({
				modalActiveClass: 'modal-active',
				callbackBeforeOpen: function () { document.documentElement.classList.add('callback-before'); },
				callbackAfterOpen: function () { document.documentElement.classList.add('callback-after'); }
			});
			toggle = document.querySelector('[data-modal]');
			content = document.querySelector( toggle.getAttribute('data-modal') );
			doc = document.documentElement;
		});

		it('User options should be merged into defaults', function () {
			trigger('click', toggle);
			expect(content.classList.contains('modal-active')).toBe(true);
			expect(doc.classList.contains('callback-before')).toBe(true);
			expect(doc.classList.contains('callback-after')).toBe(true);
		});

	});


	//
	// Events
	//

	describe('Should open modal on click', function () {

		var toggle, content;

		beforeEach(function () {
			injectElem();
			modals.init();
			toggle = document.querySelector('[data-modal]');
			content = document.querySelector( toggle.getAttribute('data-modal') );
		});

		it('Modal should have ".active" class on click', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
		});

		it('Modal background should exist and have ".modal-bg" class on click', function () {
			trigger('click', toggle);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
		});

	});

	describe('Should close modal when body or close button is clicked', function () {

		var toggle, content, close, doc;

		beforeEach(function () {
			injectElem();
			modals.init();
			toggle = document.querySelector('[data-modal]');
			content = document.querySelector( toggle.getAttribute('data-modal') );
			close = document.querySelector('[data-modal-close]');
			doc = document.documentElement;
		});

		it('Modal should not have ".active" class on close button click', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
			trigger('click', close);
			expect(content.classList.contains('active')).toBe(false);
		});

		it('Modal background should not exist on close button click', function () {
			trigger('click', toggle);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
			trigger('click', close);
			expect(document.querySelector('.modal-bg')).toBe(null);
		});

		it('Modal should not have ".active" class on body click', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
			trigger('click', doc);
			expect(content.classList.contains('active')).toBe(false);
		});

		it('Modal background should not exist on body click', function () {
			trigger('click', toggle);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
			trigger('click', doc);
			expect(document.querySelector('.modal-bg')).toBe(null);
		});

		it('Modal should still ".active" class on modal content click', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
			trigger('click', content);
			expect(content.classList.contains('active')).toBe(true);
		});

		it('Modal background should still exist on modal content click', function () {
			trigger('click', toggle);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
			trigger('click', content);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
		});

	});


	//
	// APIs
	//

	describe('Should open from public API', function () {

		var toggle, modalID, content;

		beforeEach(function () {
			injectElem();
			toggle = document.querySelector('[data-modal]');
			modalID = toggle.getAttribute('data-modal');
			content = document.querySelector(modalID);
			modals.openModal(toggle, modalID, null, null);
		});

		it('Modal should have ".active" class', function () {
			expect(content.classList.contains('active')).toBe(true);
		});

		it('Modal background should exist and have ".modal-bg" class', function () {
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
		});

	});

	describe('Should close from public API', function () {

		var toggle, content;

		beforeEach(function () {
			injectElem();
			modals.init();
			toggle = document.querySelector('[data-modal]');
			modalID = toggle.getAttribute('data-modal');
			content = document.querySelector(modalID);
		});

		it('Modal should not have ".active" class on click', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
			modals.closeModals();
			expect(content.classList.contains('active')).toBe(false);
		});

		it('Modal background should not exist', function () {
			trigger('click', toggle);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
			modals.closeModals();
			expect(document.querySelector('.modal-bg')).toBe(null);
		});

	});

	describe('Should remove initialized plugin', function () {

		var toggle, content, doc;

		beforeEach(function () {
			injectElem();
			modals.init();
			toggle = document.querySelector('[data-modal]');
			content = document.querySelector( toggle.getAttribute('data-modal') );
		});

		it('Modals should be uninitialized', function () {
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(true);
			expect(document.querySelector('.modal-bg').length).not.toBe(0);
			trigger('click', document.documentElement);
			expect(content.classList.contains('active')).toBe(false);
			expect(document.querySelector('.modal-bg')).toBe(null);
			modals.destroy();
			trigger('click', toggle);
			expect(content.classList.contains('active')).toBe(false);
			expect(document.querySelector('.modal-bg')).toBe(null);
		});

	});

});
