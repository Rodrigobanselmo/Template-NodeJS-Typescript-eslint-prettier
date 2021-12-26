import { Request, Response } from 'express';

class HomeController {
  async handle(request: Request, response: Response): Promise<Response> {
    return response.send('Hello World!');
  }
}

export { HomeController };
