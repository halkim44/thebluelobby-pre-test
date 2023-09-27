import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, FilterDto, SortDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query('sort') sort: SortDto,
    @Query('filter') filter: FilterDto,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.tasksService.findAll(
      sort,
      filter,
      ...[
        !Number.isNaN(+page) ? +page : undefined,
        !Number.isNaN(+pageSize) ? +pageSize : undefined,
      ],
    );
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.tasksService.complete(id);
  }

  @Patch(':id/uncomplete')
  uncomplete(@Param('id') id: string) {
    return this.tasksService.uncomplete(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
