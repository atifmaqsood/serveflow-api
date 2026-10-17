import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
  correlationId: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    let message: string | string[] = 'An unexpected error occurred';
    let code = status === 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (exceptionResponse && typeof exceptionResponse === 'object') {
      const record = exceptionResponse as Record<string, unknown>;
      if (typeof record.code === 'string') code = record.code;
      if (typeof record.message === 'string' || Array.isArray(record.message)) {
        message = record.message as string | string[];
      }
    }

    const body: ErrorBody = {
      statusCode: status,
      code,
      message,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
      correlationId: request.correlationId,
    };

    response.status(status).json(body);
  }
}
