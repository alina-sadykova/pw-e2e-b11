import { expect, test } from "@playwright/test";

import { TodoPage3 } from "../../../pages/homework/TodoPage3";

test.describe("Todo project", () => {
  let todoPage: TodoPage3;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage3(page);
    await page.goto("https://www.techglobal-training.com/frontend/todo-list");
  });

  /**
   * 1. Navigate to https://techglobal-training.com/frontend/project-6.
   * 2. Confirm that the todo-app modal is visible with the title "My Tasks."
   * 3. Validate that the New todo input field is enabled for text entry.
   * 4. Validate ADD button is enabled.
   * 5. Validate Search field is enabled.
   * 6. Validate that the task list is empty, displaying the message "No tasks found!"
   */

  test("Test Case 01 - Todo-App Modal Verification", async ({ page }) => {
    await expect(todoPage.todoListPanel).toBeVisible();
    await expect(todoPage.header).toBeVisible();
    await expect(todoPage.header).toHaveText("My Tasks");
    await expect(todoPage.addBtn).toBeEnabled();
    await expect(todoPage.searchBar).toBeEnabled();
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("No tasks found!");
  });

  /**
   * 1. Navigate to https://techglobal-training.com/frontend/todo-list
   * 2. Enter a new task in the todo input field and add it to the list.
   * 3. Validate that the new task appears in the task list.
   * 4. Validate that the number of tasks in the list is exactly one.
   * 5. Mark the task as completed by clicking on it.
   * 6. Validate item is marked as completed.
   * 7. Click on the button to remove the item you have added.
   * 8. Remove the completed task by clicking the designated removal button.
   * 9. Validate that the task list is empty, displaying the message "No tasks found!".
   */

  test("Test Case 02 - Single Task Addition and Removal", async ({ page }) => {
    await todoPage.addTask("Task 1");
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("Task 1");

    await todoPage.completeTaskByName("Task 1");

    let completedTaskPanel = (await todoPage.getTaskByName("Task 1")).locator(
      ".panel-icon:not(.destroy)"
    );
    await expect(completedTaskPanel).toHaveCount(1);
    await expect(completedTaskPanel).toHaveClass(/has-text-success/);

    const completedTaskText = (await todoPage.getTaskByName("Task 1")).locator(
      ".toggle>span:not(.panel-icon)"
    );
    await expect(completedTaskText).toHaveCSS(
      "text-decoration",
      /line-through/
    );

    await todoPage.deleteTaskByName("Task 1");
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("No tasks found!");
  });

  /**
   * 1. Navigate to https://techglobal-training.com/frontend/todo-list
   * 2. Enter and add 5 to-do items individually.
   * 3. Validate that all added items match the items displayed on the list.
   * 4. Mark all the tasks as completed by clicking on them.
   * 5. Click on the "Remove completed tasks!" button to clear them.
   * 6. Validate that the task list is empty, displaying the message "No tasks found!".
   */

  test("Test Case 03 - Multiple Task Operations", async ({ page }) => {
    const tasks = ["task1", "task2", "task3", "task4", "task5"];

    for (const task of tasks) {
      await todoPage.addTask(task);
    }

    await expect(todoPage.allTasks).toHaveText(tasks);

    for (const task of tasks) {
      await todoPage.completeTaskByName(task);
    }

    await todoPage.clickClearBtn();

    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("No tasks found!");
  });

  /**
   * 1. Navigate to https://techglobal-training.com/frontend/todo-list
   * 2. Attempt to add an empty task to the to-do list.
   * 3. Validate that the task list is empty, displaying the message "No task found!".
   * 4. Enter an item name exceeding 30 characters into the list.
   * 5. Validate error message appears and says "Error: Todo cannot be more than 30 characters!".
   * 6. Add a valid item name to the list.
   * 7. Validate that the active task count is exactly one.
   * 8. Try to enter an item with the same name already present on the list.
   * 9. Validate that an error message is displayed, indicating "Error: You already have {ITEM} in your todo list.".
   */
  test("Test Case 05 - Task Validation and Error Handling", async ({
    page,
  }) => {
    await todoPage.addTask("");
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("No tasks found!");

    await todoPage.addTask("This is a task the exceeds thirty characters long");
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText("No tasks found!");
    await expect(todoPage.errorMessage).toBeVisible();
    await expect(todoPage.errorMessage).toHaveText(
      "Error: Todo cannot be more than 30 characters!"
    );

    const newtask = "Task1";
    await todoPage.addTask(newtask);
    await expect(todoPage.allTasks).toHaveCount(1);
    await expect(todoPage.allTasks).toHaveText(newtask);
    await todoPage.addTask(newtask);
    await expect(todoPage.errorMessage).toBeVisible();
    await expect(todoPage.errorMessage).toHaveText(
      `Error: You already have ${newtask} in your todo list.`
    );
  });
});
