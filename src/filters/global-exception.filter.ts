import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    let message = '';
    if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || 'An error occurred';
    } else {
      message = exceptionResponse as string;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      path: request.url,
    });
  }
}
