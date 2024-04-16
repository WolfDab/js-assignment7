(async () => {

	const button = document.querySelector('button')
	const input = document.querySelector('input')
	const ul = document.querySelector('ul')

	const getTodos = async () => {
		const response = await fetch('/api/todos')
		const todos = await response.json()
		return todos
	}
		
	const toggleTodo = async (id, complete) => {
		const response = await fetch(`/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ complete })
		})
	
		return await response.json()
	}
	
	const displayTodos = todos => {
		ul.innerHTML = ''
		todos.forEach(({ _id, item, complete }) => {
			const li = document.createElement('li')
			ul.appendChild(li)

			const span = document.createElement('span')
			span.textContent = item
			li.appendChild(span)

			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = complete
			checkbox.addEventListener('change', async () => {
				await toggleTodo(_id, checkbox.checked)
				displayTodos(await getTodos())
			})
			li.appendChild(checkbox)
		})
	}

	displayTodos(await getTodos())

	button.addEventListener('click', async () => {
		const response = await fetch('/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ item: input.value, complete: false })
		})

		input.value = ''
		displayTodos(await getTodos())
	})

})()
