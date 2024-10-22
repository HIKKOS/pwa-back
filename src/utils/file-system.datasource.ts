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
    const todoAsJson = `${JSON.stringify(todo)}\n`;
    await fsp.appendFile(`${this.logPath}/my-log.log`, todoAsJson);
    return todo;
  }
  async deleteLogById(id: number): Promise<void> {
    const logs = await this.getLogsFromFile(this.logPath);
    const newLogs = logs.filter((log) => log.id !== id);
    const logsAsString = newLogs.map((log) => JSON.stringify(log)).join("\n");
    await fsp.writeFile(`${this.logPath}/my-log.log`, logsAsString);
  }

  async updateLogById(id: number, todo: Todo): Promise<Todo> {
    const logs = await this.getLogsFromFile(this.logPath);
    const newLogs = logs.map((log) => {
      if (log.id === id) {
        return todo;
      }
      return log;
    });
    const logsAsString = newLogs.map((log) => JSON.stringify(log)).join("\n");
    await fsp.writeFile(`${this.logPath}/my-log.log`, logsAsString);
    return todo;
  }

  private getLogsFromFile = async (path: string): Promise<Todo[]> => {
    if (!fs.existsSync(path)) {
      return [];
    }
    const content = await fsp.readFile(`${this.logPath}/my-log.log`, "utf-8");
    if (content == "") return [];
    let todos: Todo[] = [];
    const listString = content.split("\n");
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
