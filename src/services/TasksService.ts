import { Response } from "express";
import { prisma } from "../database/prisma";
import {
  TaskCreate,
  TaskReturn,
  TaskReturnGet,
  TaskUpdate,
} from "../interfaces/task.interfaces";
import { taskReturnGetSchema, taskReturnSchema } from "../schemas";

export class TasksService {
  public create = async (
    { categoryId, ...payload }: TaskCreate,
    res: Response
  ): Promise<TaskReturn> => {
    if (categoryId) {
      const newTask: TaskReturn = await prisma.task.create({
        data: { finished: true, ...payload, categoryId },
      });

      return taskReturnSchema.parse(newTask);
    }
    const newTask: TaskReturn = await prisma.task.create({
      data: { ...payload },
    });
    return taskReturnSchema.parse(newTask);
  };

  public read = async (
    res: Response,
    categoryName?: string
  ): Promise<TaskReturnGet[]> => {
    if (categoryName) {
      const allTasks = await prisma.task.findMany({
        where: { category: { name: categoryName } },
        include: {
          category: true,
        },
      });

      return taskReturnGetSchema.array().parse(allTasks);
    }

    const allTasks = await prisma.task.findMany({
      include: {
        category: true,
      },
    });

    return taskReturnGetSchema.array().parse(allTasks);
  };

  public retrieve = async (taskId: string): Promise<TaskReturnGet | null> => {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { category: true },
    });
    return taskReturnGetSchema.parse(task);
  };

  public update = async (
    taskId: string,
    payload: TaskUpdate
  ): Promise<TaskReturn> => {
    const task = await prisma.task.update({
      data: { finished: true, ...payload },
      where: { id: Number(taskId) },
    });

    return taskReturnSchema.parse(task);
  };

  public delete = async (taskId: string): Promise<void> => {
    await prisma.task.delete({ where: { id: Number(taskId) } });
  };
}
