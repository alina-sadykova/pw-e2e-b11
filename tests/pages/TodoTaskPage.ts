import { Locator, Page, expect } from "@playwright/test";

export class ToDoTaskPage {
  todoTaskModal: Locator;
  todoTaskheader: Locator;
  inputField: Locator;
  addButton: Locator;
  searchInputField: Locator;
  taskEmptyMessage: Locator;
  addedTodoText: Locator;
  checkIcon: Locator;
  addedTodoContainer: Locator;
  addedTodo: Locator;
  removeCompletedTodoButton: Locator;
  notificationMessage: Locator;

  constructor(private page: Page) {
    this.todoTaskModal = this.page.locator(".section");
    this.todoTaskheader = this.page.locator(".panel-heading");
    this.inputField = this.page.locator("#input-add");
    this.addButton = this.page.locator("#add-btn");
    this.searchInputField = this.page.locator("#search");
    this.taskEmptyMessage = this.page.locator("[class*='todo-item'] p");
    this.addedTodoText = this.page.locator("[class*='ml-1'] span").last();
    this.checkIcon = this.page.locator("[class*='ml-1'] span").first();
    this.addedTodoContainer = this.page.locator("#panel .panel-block");
    this.addedTodo = this.page.locator("[class*='ml-1']:visible");
    this.removeCompletedTodoButton = this.page.locator("#clear");
    this.notificationMessage = this.page.locator(".notification");
  }

  async enterandValidateNewTodo(task: string) {
    await this.inputField.fill(task);
    await this.addButton.click();
    await this.addedTodoText.waitFor({ state: "visible" });
  }

  async markTodoCompleted(task: string) {
    const todoTextLocator = this.page.locator("[class*='ml-1']", {
      hasText: task,
    });
    await todoTextLocator.click();

    const checkIcon = todoTextLocator.locator("span").first();
    await expect(checkIcon).toHaveClass(/has-text-success/);
  }

  async removeCompletedTodo() {
    await this.removeCompletedTodoButton.click();
  }

  async enterSearchInputField(task: string) {
    await this.searchInputField.fill(task);
  }
}
