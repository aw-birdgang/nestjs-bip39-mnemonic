import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(AllExceptionsFilter.name);

  async catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // const response = ctx.getResponse<Response>();
    // const statusCode = exception.getStatus();
    // let message = exception.getResponse() as {
    //   key: string;
    //   args: Record<string, unknown>;
    // };

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    this.logger.log(
      `response :: ${ctx.getResponse().toString} , response body :: ${
        responseBody.toString
      } , http status :: ${httpStatus.toString}`,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    //response.status(statusCode).json({ statusCode, message });
  }
}
