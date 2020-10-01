function ScrollBox(appointment_container, nameEvent) {
	// имя события прокрутки
	this.nameEvent = nameEvent;
	// родительский элемент в котором находится контент и скроллбар
	this.viewport = appointment_container.querySelector('.viewport');
	// элемент с контентом
	this.content = this.viewport.querySelector('.content');
	// высоты полученных элементов
	this.viewportHeight = this.viewport.offsetHeight;
	this.contentHeight = this.content.scrollHeight;
	// возможная максимальная прокрутка контента, имеет отрицательное
	// значение, т.к. контент позиционируется относительно верхнего
	// края вьюпорта и при прокрутке расположен над ним
	this.max = this.viewport.clientHeight - this.contentHeight;
	// соотношение между высотами вьюпорта и контента
	this.ratio = this.viewportHeight / this.contentHeight;
	// минимальная высота ползунка скроллбара
	this.scrollerHeightMin = 25;
	// шаг прокручивания контента при наступлении события 'wheel'
	this.step = 20;
	// флаг нажатия на левую кнопку мыши
	this.pressed = false;
}
 
fn.init = function() {
	// если высота контента меньше или равна высоте вьюпорта,
	// выходим из функции
	if (this.viewportHeight >= this.contentHeight) return;
	// формируем полосу прокрутки и ползунок
	this.createScrollbar();
	// устанавливаем обработчики событий
	this.registerEventsHandler();
};
 
fn.createScrollbar = function() {
	// создаём новые DOM-элементы DIV из которых будет
	// сформирован скроллбар
	let scrollbar = document.createElement('div'),
		scroller = document.createElement('div');
 
	// присваиваем созданным элементам соответствующие классы
	scrollbar.className = 'scrollbar';
	scroller.className = 'scroller';
 
	// вставляем созданные элементы в document
	scrollbar.appendChild(scroller);
	this.viewport.appendChild(scrollbar);
 
	// получаем DOM-объект ползунка полосы прокрутки, вычисляем и
	// устанавливаем его высоту
	this.scroller = this.viewport.querySelector('.scroller');
	this.scrollerHeight = parseInt(this.ratio * this.viewportHeight);
	this.scrollerHeight = (this.scrollerHeight < this.scrollerHeightMin) ? this.scrollerHeightMin : this.scrollerHeight;
	this.scroller.style.height = this.scrollerHeight + 'px';
	// вычисляем максимально возможное смещение ползунка от верхней границы вьюпорта
	// это смещение зависит от высоты вьюпорта и высоты самого ползунка
	this.scrollerMaxOffset = this.viewportHeight - this.scroller.offsetHeight;
};


fn.registerEventsHandler = function(e) {
	// вращение колёсика мыши
	this.viewport.addEventListener('wheel', this.scroll.bind(this));

	// нажатие на левую кнопку мыши
	this.scroller.addEventListener('mousedown', e => {
		// координата по оси Y нажатия левой кнопки мыши
		this.start = e.clientY;
		// устанавливаем флаг, информирующий о нажатии левой кнопки мыши
		this.pressed = true;
	});

	// перемещение мыши
	document.addEventListener('mousemove', this.drop.bind(this));

	// отпускание левой кнопки мыши
	// сбрасываем флаг, информирующий о нажатии левой кнопки мыши
	document.addEventListener('mouseup', () => this.pressed = false);
};

fn.scroll = function(e) {
	e.preventDefault();
	// направление вращения колёсика мыши
	let dir = -Math.sign(e.deltaY);
	// шаг прокручивания контента, в зависимости от прокручивания
	// колёсика мыши
	let	step = (Math.abs(e.deltaY) >= 3) ? this.step * dir : 0;
 
	// управляем позиционированием контента
	this.content.style.top = (this.content.offsetTop + step) + 'px';
	// ограничиваем прокручивание контента вверх и вниз
	if (this.content.offsetTop > 0) this.content.style.top = '0px';
	if (this.content.offsetTop < this.max) this.content.style.top = this.max + 'px';
 
	// перемещаем ползунок пропорционально прокручиванию контента
	this.scroller.style.top = (-this.content.offsetTop * this.ratio) + 'px';
};

// для сокращения записи, создадим переменную, которая будет ссылаться
// на прототип 'ScrollBox'
const fn = ScrollBox.prototype;
 
// выбираем все блоки на странице, в которых может понадобиться
// прокрутка контента
const containers = document.querySelectorAll('[data-control]');
// перебираем полученную коллекцию элементов
for (const container of containers) {
	// имя события, используемого для прокручивания контента
	let nameEvent = container.getAttribute('data-control');
	// с помощью конструктора 'ScrollBox' создаём экземпляр объекта,
	// в котором будем прокручивать контент
	let scrollbox = new ScrollBox(container, nameEvent);
	// создание скроллбара, исходя из полученных в конструкторе высот
	// контента и вьюпорта текущего блока, регистрация обработчиков событий
	scrollbox.init();
}