import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BOOKS_CMD, RMQService } from 'src/constants';
import { CreateBooksDTO } from './dto/create-books.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { BooksInterface } from './interfaces/books.interface';
import { BooksQueryDto } from './dto/books-query.dto';
import { PaginationResponseInterface } from 'src/interfaces/pagination.interface';
import { BooksEntity } from './entities/books.entity';
import { UpdateBookDTO } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @Inject(RMQService.BOOKS) private readonly booksServiceRMQ: ClientProxy,
  ) {}

  createBook(body: CreateBooksDTO): Observable<CreateBooksDTO> {
    return this.booksServiceRMQ.emit(
      {
        cmd: BOOKS_CMD,
        method: 'create-book',
      },
      body,
    );
  }

  async getBookName(bookName: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-by-bookName',
        },
        bookName,
      ),
    );
  }

  async getBookById(bookId: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-book-by-id',
        },
        bookId,
      ),
    );
  }

  async getAllBooks(): Promise<BooksInterface[]> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'get-all-books',
        },
        {},
      ),
    );
  }

  updateBook(bookId: string, update: UpdateBookDTO): Observable<UpdateBookDTO> {
    return this.booksServiceRMQ.emit(
      {
        cmd: BOOKS_CMD,
        method: 'update-book',
      },
      {
        bookId,
        update,
      },
    );
  }

  async deleteBook(bookId: string): Promise<BooksInterface> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'delete-book',
        },
        bookId,
      ),
    );
  }

  async getPagination(
    query: BooksQueryDto,
  ): Promise<PaginationResponseInterface<BooksEntity>> {
    return lastValueFrom(
      this.booksServiceRMQ.send(
        {
          cmd: BOOKS_CMD,
          method: 'getPagination',
        },
        query,
      ),
    );
  }
}
