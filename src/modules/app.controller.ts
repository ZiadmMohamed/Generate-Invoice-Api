import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AppDto } from './app.dto';

@Controller("/generate-invoice")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  generateInvoice(@Body() body:AppDto , @Res() res:Response): Promise<void> {
    return this.appService.generateInvoice(body,res);
  }
}
