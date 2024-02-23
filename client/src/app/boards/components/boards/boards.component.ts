import { Component, OnInit } from '@angular/core';
import { BoardInterface } from '../../../shared/types/board.interface';
import { BoardService } from '../../../shared/services/board.service';

@Component({
  selector: 'boards',
  templateUrl: './boards.component.html',
})
export class BoardsComponent implements OnInit {
  boards: BoardInterface[] = [];
  constructor(private boardsService: BoardService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createdBoard) => {
      this.boards = [...this.boards, createdBoard];
    });
  }
}
