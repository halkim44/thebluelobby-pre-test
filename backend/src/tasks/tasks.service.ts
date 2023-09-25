import { Injectable } from '@nestjs/common';
import { CreateTaskDto, FilterDto, SortDto } from './dto/task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  private toggleCompletion(id: string, value: boolean) {
    return this.taskRepository
      .findOneByOrFail({
        id,
      })
      .then((task) => {
        task.isCompleted = value;
        return this.taskRepository.save(task);
      });
  }

  create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const newTask = new TaskEntity();
    newTask.description = createTaskDto.description;

    if (createTaskDto?.priority?.length)
      newTask.priority = createTaskDto?.priority;

    return this.taskRepository.save(newTask);
  }

  async findAll(
    sort?: SortDto,
    filter?: FilterDto,
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: TaskEntity[];
    nextPage?: number;
    previousPage?: number;
    maxPage: number;
    pageSize: number;
  }> {
    if (!page || page < 1) {
      page = 1;
    }
    console.log({ page, pageSize });
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    const { by = 'createdAt', order = 'DESC' } = sort || {};

    queryBuilder.skip();

    if (by && order) {
      queryBuilder.orderBy(`task.${by}`, order);
      if (by === 'priority') {
        queryBuilder.addOrderBy('task.createdAt', 'DESC');
      }
    }
    if (filter?.isCompleted !== undefined) {
      queryBuilder.andWhere('task.isCompleted = :completed', {
        completed: filter.isCompleted,
      });
    }
    const totalCount = await queryBuilder.getCount();

    const maxPage = Math.ceil(totalCount / pageSize);
    const nextPage = page < maxPage ? page + 1 : undefined;
    const previousPage = page > 1 ? page - 1 : undefined;
    // queryBuilder.skip((page - 1) * pageSize);
    queryBuilder.limit(pageSize);

    const data = await queryBuilder.offset((page - 1) * pageSize).getMany();
    // const data = await queryBuilder.take(pageSize).getMany();

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
