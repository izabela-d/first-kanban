//kod naszej aplikacji zacznie się wykonywać dopiero po załadowaniu całego drzewa DOM
document.addEventListener('DOMContentLoaded', function() {

	//Funkcja randomString() generuje id (dla karteczek i tablic), które składa się z ciągu 10 losowo wybranych znaków
	function randomString() {
	    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
	    var str = '';
	    for (var i = 0; i < 10; i++) {
	        str += chars[Math.floor(Math.random() * chars.length)];
	    }
	    return str;
	}

	//Generowanie templatek
	function generateTemplate(name, data, basicElement) {
		var template = document.getElementById(name).innerHTML;
		var element = document.createElement(basicElement || 'div');

		Mustache.parse(template);
		element.innerHTML = Mustache.render(template, data);

		return element;
	}

	//Klasa Column
	function Column(name) {
		var self = this;

		this.id = randomString();
		this.name = name;
		this.element = generateTemplate('column-template', { id: this.id, name: this.name });

		//Kasowanie kolumny po kliknięciu w przycisk, dodawanie kolumny po kliknięciu w przycisk
		this.element.querySelector('.column').addEventListener('click', function (event) {
			if (event.target.classList.contains('btn-delete')) {
			    self.removeColumn();
			}

			if (event.target.classList.contains('add-card')) {
			    self.addCard(new Card(prompt("Enter the name of the card")));
			}
		});
	}

	//Metody dla klasy Column
	Column.prototype = {
	    addCard: function(card) {
	      this.element.querySelector('ul').appendChild(card.element);
	    },
	    removeColumn: function() {
	      this.element.parentNode.removeChild(this.element);
	    }
	};

	//Generowanie klasy Card
	function Card(description) {
		var self = this;

		this.id = randomString();
		this.description = description;
		this.element = generateTemplate('card-template', { description: this.description }, 'li');

		  //zdarzenie dla card po kliknięciu
	    this.element.querySelector('.card').addEventListener('click', function (event) {
			event.stopPropagation();

			if (event.target.classList.contains('btn-delete')) {
			    self.removeCard();
			}
		});
	}

	//Metody dla klasy Card
	Card.prototype = {
		removeCard: function() {
			this.element.parentNode.removeChild(this.element);
    	}
	}

	//Obiekt tablica
	var board = {
	    name: 'Kanban Board',
	    addColumn: function(column) {
	    	this.element.appendChild(column.element);
	    	initSortable(column.id); //About this feature we will tell later
	    },
	    element: document.querySelector('#board .column-container')
	};

	//Funkcja: initSortable()( biblioteka Sortable z opcją drag'n'drop, )
	function initSortable(id) {
		var el = document.getElementById(id);
	  	var sortable = Sortable.create(el, {

		  group: {
		    name: 'kanban',
		    put:true,
		       pull: true,
		  },
	    	sort: true
	  	});
	}

	//Dodanie nowej kolumny po kliknięciu
	document.querySelector('#board .create-column').addEventListener('click', function() {
    	var name = prompt('Enter a column name');
    	var column = new Column(name);
    	board.addColumn(column);
	});

	//Tworzenie kolumn
	var todoColumn = new Column('To do');
	var doingColumn = new Column('Doing');
	var doneColumn = new Column('Done');

	//Dodanie kolumn do tablicy
	board.addColumn(todoColumn);
	board.addColumn(doingColumn);
	board.addColumn(doneColumn);

	//Tworzenie kart
	var card1 = new Card('New task');
	var card2 = new Card('Create kanban boards');

	//Dodanie kart do kolumny
	todoColumn.addCard(card1);
	doingColumn.addCard(card2);

});


