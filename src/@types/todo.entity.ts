export class TodoEntity {
  public completed: boolean;
  public id: number;
  public description: string;
  public title: string;

  constructor(options: any) {
    const { id, title, description, completed } = options;
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
  }

  private static hasValidData(options: any): boolean {
    const { id, title, description, completed } = options;

    if (!id) {
      return false;
    }
    if (!title) {
      return false;
    }
    if (!description) {
      return false;
    }
    if (!completed && typeof completed !== "boolean") {
      return false;
    }

    return true;
  }
  static fromJson = (json: string): TodoEntity => {
    const todo = JSON.parse(json);
    console.log({ object: todo });
    const hasValidData = this.hasValidData(todo);
    if (!hasValidData) {
      throw new Error("Error de sintaxis");
    }

    return todo;
  };

  static fromObject = (object: { [key: string]: any }): TodoEntity => {
    const { level, message, createdAt, origin } = object;
    const hasValidData = this.hasValidData({
      level,
      message,
      createdAt,
      origin,
    });
    if (!hasValidData) {
      throw new Error("Error de sintasix");
    }
    const log = new TodoEntity({
      message,
      level,
      origin,
      createdAt,
    });
    return log;
  };
}
