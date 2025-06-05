import { type Locator, type Page } from "@playwright/test";

export class ToDoPage {
  readonly page: Page;
  readonly todoAppModal: Locator;
  readonly todoAppheading: Locator;
  readonly newTodoInput: Locator;
  readonly addButton: Locator;
  readonly searchField: Locator;
  readonly taskList: Locator;
  readonly clearTasks: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoAppModal = this.page.locator(".panel");
    this.todoAppheading = this.todoAppModal.locator(".panel-heading");
    this.newTodoInput = this.page.locator("#input-add");
    this.addButton = this.page.locator("#add-btn");
    this.searchField = this.page.locator("#search");
    this.taskList = this.page.locator(".todo-item");
    this.clearTasks = this.page.locator("#clear");
    this.errorMessage = this.page.locator(".notification");
  }

  async cickAddButton() {
    await this.addButton.click();
  }

  async clickClearTasks() {
    await this.clearTasks.click();
  }

  async addNewTask(task: string): Promise<void> {
    await this.newTodoInput.fill(task);
    await this.cickAddButton();
  }

  getTaskByName(taskName: string) {
    return this.taskList.filter({ hasText: taskName });
  }

  async markTaskAsCompleted(taskName: string) {
    await this.getTaskByName(taskName).locator(".toggle").click();
  }

  async removeTask(taskName: string) {
    await this.getTaskByName(taskName).locator(".destroy").click();
  }

  async searchForTodoItem(todoItem: string) {
    await this.searchField.fill(todoItem);
  }

  async addMultipleTasksAndReturn(count: number) {
    const tasks: string[] = [];

    for (let i = 1; i <= count; i++) {
      const taskName = `Task ${i}`;
      await this.addNewTask(taskName);
      tasks.push(taskName);
    }
    return tasks;
  }
}
