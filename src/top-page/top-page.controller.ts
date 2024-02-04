import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TOPPAGE_NOT_FOUND_ERROR } from './top-page.constants';

@Controller('top-page')
export class TopPageController {
  constructor(
    @Inject(TopPageService) private readonly topPageService: TopPageService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const findedDocument = await this.topPageService.get(id);

    if (!findedDocument) throw new NotFoundException(TOPPAGE_NOT_FOUND_ERROR);

    return findedDocument;
  }

  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.topPageService.delete(id);
    if (!deletedProduct) {
      throw new NotFoundException(TOPPAGE_NOT_FOUND_ERROR);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedTopPage = await this.topPageService.update(id, dto);
    if (!updatedTopPage) {
      throw new NotFoundException(TOPPAGE_NOT_FOUND_ERROR);
    }
    return updatedTopPage;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {}
}
