import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface NestFastifyResponse {
  status(statusCode: number): {
    send(payload: Record<string, unknown>): void;
  };
}

interface NestFastifyRequest {
  url?: string;
  method?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<NestFastifyResponse>();
    const request = ctx.getRequest<NestFastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : 'Internal server error';

    const errorDetails =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : { message: exceptionResponse };

    const safePath = request?.url ?? '/';

    const errorResponse = {
      statusCode: status,
      success: false,
      timestamp: new Date().toISOString(),
      path: safePath,
      ...errorDetails,
    };

    response.status(status).send(errorResponse);
  }
}
