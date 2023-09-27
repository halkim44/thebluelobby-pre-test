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
import { CreateTaskDto, QueryDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.tasksService.findAll(query);
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
