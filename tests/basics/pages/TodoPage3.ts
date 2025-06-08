import { type Locator, type Page } from "playwright/test";

export class TodoPage3 {
  readonly page: Page;
  readonly todoListPanel: Locator;
  readonly header: Locator;
  readonly newInput: Locator;
  readonly addBtn: Locator;
  readonly searchBar: Locator;
  readonly allTasks: Locator;
  readonly taskComplete: Locator;
  readonly taskDelete: Locator;
  readonly clearBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoListPanel = page.locator(".panel");
    this.header = page.locator(".panel-heading");
    this.newInput = page.locator("#input-add");
    this.addBtn = page.locator("#add-btn");
    this.searchBar = page.locator("#search");
    this.allTasks = page.locator(".todo-item");
    this.taskComplete = page.locator(".toggle");
    this.taskDelete = page.locator(".destroy");
    this.clearBtn = page.locator("#clear");
    this.errorMessage = page.locator(".is-danger");
  }

  async clickAddBtn() {
    await this.addBtn.click();
  }

  async addTask(taskName: string) {
    await this.newInput.fill(taskName);
    await this.clickAddBtn();
  }

  async getTaskByName(taskName: string) {
    return this.allTasks.filter({ hasText: taskName });
  }

  async deleteTaskByName(taskName: string) {
    await (await this.getTaskByName(taskName)).locator(".destroy").click();
  }

  async completeTaskByName(taskName: string) {
    await (await this.getTaskByName(taskName)).locator(".toggle").click();
  }

  async clickClearBtn() {
    await this.clearBtn.click();
  }
}
