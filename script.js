/**
 * Todoo sovellus
 * Tekijä: saku (saku.lol)
 * Lisenssi: MIT
 * 14.9.2022 - 15.9.2022
 */



/**
 * Save state of todos to local storage so that it can be loaded later.
 */
function saveState() {
	let todos = [];
	document.querySelectorAll('.todo-container').forEach(function(el) {
		todos.push({
			checked: el.querySelector('input').checked,
			text: el.querySelector('.todo-text').value,
			flagged: el.querySelector('.todo-flag').classList.contains('todo-active')
		});
	})
	
	localStorage.setItem('todos', JSON.stringify(todos));
}



/**
 * Filter the grid of items based on the search term.
 * Reused from own 0x00011/neumorphism-grid
 * @param {string} input 
 */
function filterGrid(input) {
	if (input == "" || input == null) {
		document.querySelectorAll('.todo-container').forEach(function(el) {
			el.style.display = "flex";
		});
		return;
	}

	var filter = input.toUpperCase();
	var todoElements = document.getElementsByClassName('todo-container');
	
	for (i = 0; i < todoElements.length; i++) {
		if (todoElements[i].querySelector('.todo-text').value.toUpperCase().includes(filter)) {
			todoElements[i].style.display = 'flex';
		} else {
			todoElements[i].style.display = 'none';
		}
	}
}



/**
 * Show popup modal and wait for user input to remove a todo.
 * @param {Element} element 
 * @param {string} todoName 
 */
function onTodoDoubleClick(element, todoName) {
	let popup = document.createElement('div');

	popup.classList.add('popup');
	popup.innerHTML = `
		<div class="popup-content">
			<div class="popup-question">Haluatko varmasti poistaa tehtävän<br>${todoName ? '"' + todoName + '"' : ''}?</div>
			<div class="popup-buttons">
				<button class="popup-yes">Kyllä</button>
				<button class="popup-no">En</button>
			</div>
		</div>
	`;

	popup.querySelector('.popup-no').addEventListener('click', () => popup.remove());
	popup.querySelector('.popup-yes').addEventListener('click', () => {
		popup.remove(); element.remove();
		saveState();
	});

	document.body.appendChild(popup);
}



/**
 * Create a new todo element and add it to the grid when the user clicks the add button.
 */
document.querySelector('.add-container').addEventListener('click', function(e) {
	e.preventDefault();
	
	let todoId = Math.floor(Math.random() * 100000);
	let todo = document.querySelector('.todo-template').cloneNode(true);
	
	todo.classList = 'todo-container';
	todo.querySelector('input').setAttribute('id', `todo-${todoId}`);	
	todo.querySelector('label').setAttribute('for', `todo-${todoId}`);
	
	todo.querySelector('.todo-text').addEventListener('input', function(e) {
		e.preventDefault();
		saveState();
	})
	
	todo.querySelector('.todo-flag').addEventListener('click', function(e) {
		e.preventDefault();
		this.classList.toggle('todo-active');
		saveState();
	})
	
	todo.querySelector('.todo-input input').addEventListener('input', function(e) {
		e.preventDefault();

		if (this.checked) {
			this.parentNode.parentElement.classList.remove("todo-animate");
			setTimeout(() => this.parentNode.parentElement.classList.add("todo-animate"), 0);
		} else {
			this.parentNode.parentElement.classList.remove("todo-animate");
		}

		saveState();
	})
	
	document.querySelector('.container').appendChild(todo);
	filterGrid(document.getElementById('search'));
})




// When search query is changed, filter the grid to show only todos with searched name.
document.getElementById('search').addEventListener('input', (e) => {
	filterGrid(e.data)
})



// When the page is loaded, load todos from local storage.
window.addEventListener('load', function() {
	let todos = JSON.parse(localStorage.getItem('todos'));
	todos.sort((a, b) => {
		if (a.flagged && !b.flagged) return -1;
		if (!a.flagged && b.flagged) return 1;
		return 0;
	})

	if (todos) {
		todos.forEach(function(data) {
			let todoId = Math.floor(Math.random() * 100000);
			let todo = document.querySelector('.todo-template').cloneNode(true);

			todo.classList = 'todo-container';
			todo.querySelector('input').setAttribute('id', `todo-${todoId}`);	
			todo.querySelector('label').setAttribute('for', `todo-${todoId}`);
			todo.querySelector('input').checked = data.checked;
			
			if (data.checked) todo.classList.add('todo-animate');
			if (data.flagged) todo.querySelector('.todo-flag').classList.add('todo-active');

			todo.querySelector('.todo-text').value = data.text;
			todo.querySelector('.todo-text').addEventListener('input', function(e) {
				e.preventDefault();
				saveState();
			})
			
			todo.querySelector('.todo-flag').addEventListener('click', function(e) {
				e.preventDefault();
				this.classList.toggle('todo-active');
				saveState();
			})

			todo.addEventListener('dblclick', function(e) {
				e.preventDefault();
				onTodoDoubleClick(this, todo.querySelector('.todo-text').value);
			})
			
			todo.querySelector('.todo-input input').addEventListener('input', function(e) {
				e.preventDefault();
		
				if (this.checked) {
					this.parentNode.parentElement.classList.remove("todo-animate");
					setTimeout(() => this.parentNode.parentElement.classList.add("todo-animate"), 0);
				} else {
					this.parentNode.parentElement.classList.remove("todo-animate");
				}
		
				saveState();
			})

			document.querySelector('.container').appendChild(todo);
		})
	}
})