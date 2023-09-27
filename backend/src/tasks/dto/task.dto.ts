import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from '../entities/task.entity';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Please provide description for the task.' })
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}

export class SortDto {
  @IsOptional()
  @IsIn(['createdAt', 'dueDate', 'priority'])
  by?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}

export class FilterDto {
  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  isCompleted?: boolean;
}
