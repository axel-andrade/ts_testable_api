import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('v1/result-games')
export class ResultGameController {
  @Get('')
  public getGamesByDateForgeLoggedUser(_: Request, res: Response): void {
    res.send({});
  }
}
