import { expect, test } from "@playwright/test";

import { ToDoPage } from "../pages/TodoPage";
import { TodoTaskData } from "../data/toDoTaskData";

let todoPage: ToDoPage;
test.describe("ToDo Page", () => {
  test.beforeEach(async ({ page }) => {
    todoPage = new ToDoPage(page);
    await page.goto("https://www.techglobal-training.com/frontend/todo-list");
  });

  test("Test Case 01 - Todo-App Modal Verification", async () => {
    await expect(todoPage.todoAppModal).toBeVisible();
    await expect(todoPage.todoAppheading).toHaveText(TodoTaskData.taskHeader);
    await expect(todoPage.newTodoInput).toBeEnabled();
    await expect(todoPage.addButton).toBeEnabled();
    await expect(todoPage.searchField).toBeEnabled();
    await expect(todoPage.taskList).toHaveText(TodoTaskData.taskEmptyMessage);
  });
  test("Test Case 02 - Single Task Addition and Removal", async () => {
    const taskName = "Read a book";
    await todoPage.addNewTask(taskName);
    await expect(todoPage.taskList).toHaveText(taskName);
    await expect(todoPage.taskList).toHaveCount(1);

    await todoPage.markTaskAsCompleted(taskName);

    const completedTask = todoPage
      .getTaskByName(taskName)
      .locator(".panel-icon:not(.destroy)");

    await expect(completedTask).toHaveClass(/has-text-success/);

    await todoPage.removeTask(taskName);
    await expect(todoPage.taskList).toHaveText(TodoTaskData.taskEmptyMessage);
  });

  test("Test Case 03 - Multiple Task Operations", async () => {
    const taskCount = 5;
    const tasks = await todoPage.addMultipleTasksAndReturn(taskCount);

    // validate added tasks match displayed tasks
    expect(todoPage.taskList).toHaveText(tasks);

    // mark task as completed
    for (let task of tasks) {
      await todoPage.markTaskAsCompleted(task);
    }

    // remove completed tasks
    await todoPage.clickClearTasks();

    // validate no tasks left
    await expect(todoPage.taskList).toBeVisible();
  });

  test("Test Case 04 - Search and Filter Functionality in todo App", async () => {
    const taskName = "Task 1";
    const taskCount = 5;
    const tasks = await todoPage.addMultipleTasksAndReturn(taskCount);

    await expect(todoPage.taskList).toHaveText(tasks);

    await todoPage.searchForTodoItem(taskName);

    await expect(todoPage.taskList).toHaveText(taskName);

    await expect(todoPage.taskList).toHaveCount(1);
  });

  test("Test Case 05 - Task Validation and Error Handling", async () => {
    await todoPage.addNewTask("");
    await expect(todoPage.taskList).toHaveText(TodoTaskData.taskEmptyMessage);

    const longTask = "This is a task with more than 30 chatacters...";
    await todoPage.addNewTask(longTask);
    await expect(todoPage.errorMessage).toHaveText(
      TodoTaskData.errorrMessageTooManyChar
    );

    const taskName = "Read a book";

    await todoPage.addNewTask(taskName);
    await expect(todoPage.taskList).toHaveText(taskName);
    await expect(todoPage.taskList).toHaveCount(1);

    await todoPage.addNewTask(taskName);
    await expect(todoPage.errorMessage).toHaveText(
      `Error: You already have ${taskName} in your todo list.`
    );
  });
});
