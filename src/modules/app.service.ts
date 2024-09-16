import { Body, HttpStatus, Injectable, Res } from '@nestjs/common';

import { AppDto } from './app.dto';
import createPDF from 'src/core/utils/generateInvoice';

@Injectable()
export class AppService {

 async  generateInvoice(@Body() body:AppDto,@Res() res:Response ): Promise<void> {
  


   await createPDF(body,res);
  

  }

}


