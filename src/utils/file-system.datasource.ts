import fs from "fs";
import fsp from "fs/promises";
import Todo from "../@types/todo";
import { TodoEntity } from "../@types/todo.entity";

export class FileSystemDatasource {
  private readonly logPath = `logs/`;

  constructor() {
    console.log("FileSystemDatasource");
    this.createLogsFile();
  }
  private createLogsFile = () => {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath);
    }

    if (!fs.existsSync(`${this.logPath}/my-log.log`)) {
      fs.writeFileSync(`${this.logPath}/my-log.log`, "");
    }
  };

  async saveLogs(todo: Todo): Promise<Todo> {
    const todoAsJson = `${JSON.stringify(todo)}%`;
    await fsp.appendFile(`${this.logPath}/my-log.log`, todoAsJson);
    return todo;
  }
  async deleteLogById(id: number): Promise<void> {
    const logs = await this.getLogsFromFile(this.logPath);
    const newLogs = logs.filter((log) => log.id !== id);
    fs.writeFileSync(`${this.logPath}/my-log.log`, "");
    newLogs.forEach(async (log) => await this.saveLogs(log));
  }

  async updateLogById(id: number, todo: Todo): Promise<Todo> {
    const logs = await this.getLogsFromFile(this.logPath);
    for (const log of logs) {
      if (log.id === id) {
        log.completed = todo.completed;
        log.description = todo.description;
        log.title = todo.title;
      }
    }
    fs.writeFileSync(`${this.logPath}/my-log.log`, "");
    logs.forEach(async (log) => await this.saveLogs(log));

    return todo;
  }

  private getLogsFromFile = async (path: string): Promise<Todo[]> => {
    if (!fs.existsSync(path)) {
      return [];
    }
    const content = await fsp.readFile(`${this.logPath}/my-log.log`, "utf-8");
    if (content == "") return [];
    let todos: Todo[] = [];
    const listString = content.split("%");
    for (const string of listString) {
      if (string == "") {
        continue;
      }
      const todo = TodoEntity.fromJson(string);
      todos.push(todo);
    }
    return todos;
  };
  async getLogs(): Promise<Todo[]> {
    const logs = await this.getLogsFromFile(this.logPath);
    return logs;
  }
}
