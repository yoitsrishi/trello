import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class BoardService {
  constructor(private http: HttpClient) {}
  getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<BoardInterface[]>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<BoardInterface>(url, { title });
  }
}
