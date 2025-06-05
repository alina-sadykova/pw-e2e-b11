import { expect, test } from "@playwright/test";

import { ToDoPage1 } from "../pages/TodoPage1";
import { TodoTaskData } from "../data/toDoTaskData";

let todoTaskPage: ToDoPage1;

test.describe("Todo Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.techglobal-training.com/frontend/todo-list");
    todoTaskPage = new ToDoPage1(page);
  });

  test("Test Case 01 - Todo-App Modal Verification", async () => {
    await expect(todoTaskPage.todoTaskModal).toBeVisible();
    await expect(todoTaskPage.todoTaskheader).toHaveText(
      TodoTaskData.taskHeader
    );

    await expect(todoTaskPage.inputField).toBeEnabled();
    await expect(todoTaskPage.addButton).toBeEnabled();
    await expect(todoTaskPage.searchInputField).toBeEnabled();
    await expect(todoTaskPage.taskEmptyMessage).toHaveText(
      TodoTaskData.taskEmptyMessage
    );
  });
  test("Test Case 02 - Single Task Addition and Removal", async () => {
    await todoTaskPage.enterandValidateNewTodo("Read a book");
    await expect(todoTaskPage.addedTodo).toHaveCount(1);
    await todoTaskPage.markTodoCompleted("Read a book");
    await todoTaskPage.removeCompletedTodo();
    await expect(todoTaskPage.taskEmptyMessage).toBeVisible();
  });
  test("Test Case 03 - Multiple Task Operations", async () => {
    const todoList = TodoTaskData.todoList;

    // enter new tasks
    for (let task of todoList) {
      await todoTaskPage.enterandValidateNewTodo(task);
    }
    const displayedTodos = await todoTaskPage.addedTodo.allTextContents();

    // validate added tasks match displayed tasks
    expect(todoList).toEqual(displayedTodos);

    // mark task as completed
    for (let task of displayedTodos) {
      await todoTaskPage.markTodoCompleted(task);
    }

    // remove completed tasks
    await todoTaskPage.removeCompletedTodo();

    await expect(todoTaskPage.taskEmptyMessage).toBeVisible();
  });
  test("Test Case 04 - Search and Filter Functionality in todo App", async () => {
    const todoList = TodoTaskData.todoList;

    // enter new tasks
    for (let task of todoList) {
      await todoTaskPage.enterandValidateNewTodo(task);
    }
    const displayedTodos = await todoTaskPage.addedTodo.allTextContents();

    // validate added tasks match displayed tasks
    expect(todoList).toEqual(displayedTodos);

    const lastTask = displayedTodos.at(-1);
    if (lastTask) {
      await todoTaskPage.enterSearchInputField(lastTask);
      const text = await todoTaskPage.addedTodo.allTextContents();
      await expect(todoTaskPage.addedTodoContainer).toHaveCount(1);
      expect(text).toEqual([lastTask]);
    }
  });
  test("Test Case 05 - Task Validation and Error Handling", async () => {
    await expect(todoTaskPage.taskEmptyMessage).toHaveText(
      TodoTaskData.taskEmptyMessage
    );
    await todoTaskPage.inputField.fill(
      "Make a list of groceries, go to the store, and so on"
    );
    await todoTaskPage.addButton.click();

    await todoTaskPage.renderErrorMessageTooManyChar(
      TodoTaskData.errorrMessageTooManyChar
    );

    await todoTaskPage.enterandValidateNewTodo(TodoTaskData.todoList[0]);

    await expect(todoTaskPage.addedTodoContainer).toHaveCount(1);

    await todoTaskPage.enterandValidateNewTodo(TodoTaskData.todoList[0]);

    await todoTaskPage.renderErrorMessageAlreadyExist(TodoTaskData.todoList[0]);
  });
});
