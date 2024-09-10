import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


    @Post('create-payment-session')
    createPaymentSession(
      @Body() paymentSessionDto: PaymentSessionDto
    ){
      return this.paymentsService.createPaymentSession(paymentSessionDto);
    }

    @Get('success')
    success(){
      return {
        ok: true,
        message: 'payment successful',
      };
    }

    @Get('cancel')
    cancel(){
      return {
        ok: false,
        message: 'payment cancelled',
      };
    }

    @Post('webhook')
    webhook(@Req() req: Request, @Res() res: Response){
      return this.paymentsService.handleWebhook(req, res);
    }

}
