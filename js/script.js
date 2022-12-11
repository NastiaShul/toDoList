const input = document.querySelector(".new-task__input"),
	submit = document.querySelector(".new-task__btn"),
	taskParent = document.querySelector(".todo-list__tasks"),
	message = document.querySelector(".todo-list__message"),
	sort = document.querySelector('.sort');

let taskList = [];

submit.addEventListener("click", addNote);

input.addEventListener("keyup", e => {
	e.code === "Enter" ? addNote(e) : null;
});

sort.addEventListener("click", sortTasks);


function addNote(e) {
	const date = new Date().toString().slice(0, 24),
		value = document.querySelector(".new-task__input").value;

	if (input.value !== "") {
		const id = taskList.length;
		const uncheckedTasks = taskList.filter(task => !task.checked);
		const checkedTasks = taskList.filter(task => task.checked);
		uncheckedTasks.push({ id, date, value, checked: false });
		taskList = [].concat(uncheckedTasks).concat(checkedTasks);

		message.remove();
		input.value = "";
	}
	createTask();
	handleTasks();
	addDropEvent();
}



function handleTasks(e) {
	const taskBlock = document.querySelectorAll(".task__block"),
		text = document.querySelectorAll(".text"),
		confirm = document.querySelectorAll(".confirm");
	for (let i = 0; i < taskBlock.length; i++) {
		taskBlock[i].addEventListener("click", (e) => {
			const checkMark = e.target,
				id = +checkMark.parentNode.parentNode.id;

			if (checkMark.classList.contains("check")) {
				taskList = taskList.map((task) => {
					if (task.id === id) {
						task.checked = !task.checked;
					}
					return task;
				});
				const text = checkMark.nextElementSibling;
				checkMark.classList.toggle("checked");
				text.classList.toggle("completed");
			} else if (checkMark.classList.contains("edit")) {
				text[i].setAttribute("contentEditable", true);
				text[i].addEventListener("input", (e) => changeText(e, i), false);

			} else if (checkMark.classList.contains("delete")) {
				confirm[i].classList.add("active");
			} else if (checkMark.classList.contains("confirm__yes")) {
				const indexDeleted = taskList.findIndex(task => task.id === id);
				taskList.splice(indexDeleted, 1);
				checkMark.parentNode.parentNode.parentNode.parentNode.remove();
			} else if (checkMark.classList.contains("confirm__no")) {
				confirm[i].classList.remove("active");
			}
		})
	}
}


function changeText(e, index) {
	const target = e.target,
		newText = e.target.innerText;
	document.addEventListener("keydown", (e) => {
		if (e.code === "Enter" && target.getAttribute("contentEditable", true)) {
			target.removeAttribute("contentEditable");
		}
	});
	document.addEventListener("click", () => {
		if (!target || target.getAttribute("contentEditable", true)) {
			target.removeAttribute("contentEditable");
		}
	});
	taskList[index].value = newText;
	toLocal();
}


function sortTasks(e) {
	const target = e.target,
		uncheckedTasks = taskList.filter(task => !task.checked),
		checkedTasks = taskList.filter(task => task.checked);
	if (target.classList.contains("sort-name")) {
		uncheckedTasks.sort((taskA, taskB) => {
			return taskA.value.localeCompare(taskB.value)
		});
		taskList = [].concat(uncheckedTasks).concat(checkedTasks);
		createTask();
		addDropEvent();
		handleTasks();
	} else if (target.classList.contains("sort-date")) {
		uncheckedTasks.sort((taskA, taskB) => {
			return new Date(taskA.date) - new Date(taskB.date);
		});
		taskList = [].concat(uncheckedTasks).concat(checkedTasks);
		createTask();
		addDropEvent();
		handleTasks();
	}
}



function createTask() {
	taskParent.innerHTML = "";

	taskList.forEach(({ id, date, value, checked }) => {
		taskParent.innerHTML += `
	<li class="task" draggable="true">
		<div class="time"></div>
		<div class="task" draggable="true">
			<div class="time">${date}</div>
			<div id=${id} class="task__block">
				<label class="label">
					<input type="checkbox" class="checkbox">
					<span class="check ${checked && 'checked'}"></span>
					<span class="text ${checked && 'completed'}" spellcheck="false">${value}</span>
				</label>
				<div class="btns">
					<button><img class="edit" src="./img/edit.svg" alt=""></button>
					<button><img class="delete" src="./img/Plus.svg" alt=""></button>
					<div class="confirm">
						<h3>delete?</h3>
						<button class="confirm__yes">Yes</button>
						<button class="confirm__no">No</button>
					</div>
				</div>
			</div>
		</div>
	</li>
`;
	})
}


function addDropEvent() {
	let task = document.querySelectorAll(".task");

	function dragStart(e) {
		this.style.opacity = "0.4";

		dragSrcElem = this;

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html", this.innerHTML);
	}

	function dragEnd(e) {
		this.style.opacity = "1";

		task.forEach(item => {
			item.classList.remove("over");
		});
	}

	function dragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		return false;
	}

	function dragEnter(e) {
		this.classList.add("over");
	}

	function dragLeave(e) {
		this.classList.remove("over");
	}

	function drop(e) {
		e.stopPropagation();
		if (dragSrcElem !== this) {
			dragSrcElem.innerHTML = this.innerHTML;
			this.innerHTML = e.dataTransfer.getData("text/html");
		}
		handleTasks();
		return false;
	}

	task.forEach(item => {
		item.addEventListener("dragstart", dragStart);
		item.addEventListener("dragover", dragOver);
		item.addEventListener("dragenter", dragEnter);
		item.addEventListener("dragleave", dragLeave)
		item.addEventListener("dragend", dragEnd);
		item.addEventListener("drop", drop);
	});



}