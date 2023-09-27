import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Priority } from '../entities/task.entity';
import { Transform, Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Please provide description for the task.' })
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
export class UpdateDto {
  @IsString()
  @IsNotEmpty({ message: 'Please provide description for the task.' })
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}

export class QueryDto {
  @IsOptional()
  @IsIn(['createdAt', 'dueDate', 'priority'])
  by?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => [true, 'true'].includes(value))
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;
}
