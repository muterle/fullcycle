import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  async create(@Body() createRouteDto: CreateRouteDto) {
    return await this.routesService.create(createRouteDto);
  }

  @Get()
  async findAll() {
    return await this.routesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.routesService.findOne(id);
  }
}
