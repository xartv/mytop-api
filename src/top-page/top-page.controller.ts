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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import {
  TOPPAGE_ALIAS_NOT_FOUND_ERROR,
  TOPPAGE_CATEGORY_NOT_FOUND_ERROR,
  TOPPAGE_NOT_FOUND_ERROR,
} from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(
    @Inject(TopPageService) private readonly topPageService: TopPageService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const findedDocument = await this.topPageService.get(id);

    if (!findedDocument) throw new NotFoundException(TOPPAGE_NOT_FOUND_ERROR);

    return findedDocument;
  }

  @UsePipes(new ValidationPipe())
  @Get('/byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const findedDocument = await this.topPageService.getByAlias(alias);

    if (!findedDocument)
      throw new NotFoundException(TOPPAGE_ALIAS_NOT_FOUND_ERROR);

    return findedDocument;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('findByCategory')
  async getByCategory(@Body() dto: FindTopPageDto) {
    const findedDocument = await this.topPageService.getByCategory(dto);

    if (!findedDocument)
      throw new NotFoundException(TOPPAGE_CATEGORY_NOT_FOUND_ERROR);

    return findedDocument;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.delete(id);
    if (!deletedTopPage) {
      throw new NotFoundException(TOPPAGE_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
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
}
