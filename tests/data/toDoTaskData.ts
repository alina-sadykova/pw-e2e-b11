export const TodoTaskData = {
  modalHeader: "TODO List",
  taskHeader: "My Tasks",
  addButton: "ADD",
  taskEmptyMessage: "No tasks found!",
  inputFieldPlaceholderText: "New todo",
  searchBarPlacehodler: "Type to search",
  todoList: [
    "Read a book",
    "Cook dinner",
    "Do laundry",
    "Study Playwright",
    "Pack lunch",
  ],
  errorrMessageTooManyCha: "Error: Todo cannot be more than 30 characters!",
  getErrorMessageAlreadyExist(task: string): string {
    return `Error: You already have ${task} in your todo list.`;
  },
};
