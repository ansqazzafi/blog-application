import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { PostCategory } from 'src/enums/post.enum';  
import { createPost } from 'src/interfaces/post.interface';  
export class CreatePostDto implements createPost {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean = false;

  @IsEnum(PostCategory)
  @IsNotEmpty()
  category: PostCategory;

  @IsInt()
  @Min(0)
  @IsOptional()
  likes?: number = 0;
}
