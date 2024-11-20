import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { PostCategory } from 'src/enums/post.enum';  
import { status } from 'src/enums/poststatus.enum';
import { createPost, updatePost } from 'src/interfaces/post.interface';  
export class updatePostDto implements updatePost {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsEnum(status)
  @IsOptional()
  status?: status = status.inActive;

  @IsEnum(PostCategory)
  @IsOptional()
  category: PostCategory;

  @IsInt()
  @Min(0)
  @IsOptional()
  likes?:number
}
