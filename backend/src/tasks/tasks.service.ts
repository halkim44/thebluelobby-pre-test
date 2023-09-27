import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto, QueryDto, UpdateDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  private async toggleCompletion(
    id: string,
    value: boolean,
  ): Promise<TaskEntity | undefined> {
    try {
      const task = await this.taskRepository.findOneByOrFail({
        id,
      });
      task.isCompleted = value;
      return await this.taskRepository.save(task);
    } catch (error) {
      console.error(`Error toggling completion for task with id ${id}:`, error);
      return undefined;
    }
  }

  create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const newTask = new TaskEntity();
    newTask.description = createTaskDto.description;

    if (createTaskDto?.priority?.length)
      newTask.priority = createTaskDto?.priority;

    return this.taskRepository.save(newTask);
  }

  async updateTask(id: string, updateTaskDto: UpdateDto): Promise<TaskEntity> {
    const existingTask = await this.taskRepository.findOne({
      where: { id: id },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (updateTaskDto.description !== undefined) {
      existingTask.description = updateTaskDto.description;
    }

    if (updateTaskDto.priority !== undefined) {
      existingTask.priority = updateTaskDto.priority;
    }

    return this.taskRepository.save(existingTask);
  }

  async findAll(query: QueryDto): Promise<{
    data: TaskEntity[];
    nextPage?: number;
    previousPage?: number;
    maxPage: number;
    pageSize: number;
  }> {
    const {
      isCompleted,
      order = 'DESC',
      by = 'createdAt',
      pageSize,
    } = query || {};
    let { page } = query || {};
    if (!page || page < 1) {
      page = 1;
    }
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    queryBuilder.skip();

    if (by && order) {
      queryBuilder.orderBy(`task.${by}`, order);
      if (by === 'priority') {
        queryBuilder.addOrderBy('task.createdAt', 'DESC');
      }
    }
    if (isCompleted !== undefined) {
      queryBuilder.andWhere('task.isCompleted = :completed', {
        completed: isCompleted,
      });
    }
    const totalCount = await queryBuilder.getCount();

    const maxPage = Math.ceil(totalCount / pageSize);
    const nextPage = page < maxPage ? page + 1 : undefined;
    const previousPage = page > 1 ? page - 1 : undefined;
    queryBuilder.limit(pageSize);

    const data = await queryBuilder.offset((page - 1) * pageSize).getMany();

    return { data, maxPage, pageSize, nextPage, previousPage };
  }

  complete(id: string): Promise<TaskEntity> {
    return this.toggleCompletion(id, true);
  }

  uncomplete(id: string): Promise<TaskEntity> {
    return this.toggleCompletion(id, false);
  }

  remove(id: string) {
    return this.taskRepository.delete({ id });
  }
}
