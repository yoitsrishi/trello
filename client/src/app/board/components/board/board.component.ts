import { Component, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  NavigationStart,
  Route,
  Router,
} from '@angular/router';
import { BoardsService } from '../../../shared/services/board.service';
import { BoardService } from '../../services/board.service';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { BoardInterface } from '../../../shared/types/board.interface';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';
import { ColumnsService } from './../../../shared/services/columns.service';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { ColumnInputInterface } from '../../../shared/types/columnInput.interface';
import { TaskInterface } from '../../../shared/types/task.interface';
import { TasksService } from '../../../shared/services/tasks.service';
import { TaskInputInterface } from '../../../shared/types/taskInput.interface';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnsService: ColumnsService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cant get boardID from url');
    }

    this.boardId = boardId;
    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks,
      }))
    );
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });

    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });

    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .subscribe((task) => {
        this.boardService.addTask(task);
      });
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
    this.columnsService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
    this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnsService.createColumn(columnInput);
  }

  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      boardId: this.boardId,
      columnId,
    };
    this.tasksService.createTask(taskInput);
  }

  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }
}

// @Component({
//   selector: 'board',
//   templateUrl: './board.component.html',
// })
// export class BoardComponent {
//   boardId: string;
//   // board$!: Observable<BoardInterface>;
//   // columns$:Observable<ColumnInterface[]>
//   data$: Observable<{
//     board: BoardInterface;
//     columns: ColumnInterface[];
//     tasks: TaskInterface[];
//   }>;
//   constructor(
//     private boardsSerivce: BoardsService,
//     private route: ActivatedRoute,
//     private boardService: BoardService,
//     private socketService: SocketService,
//     private router: Router,
//     private columnsService: ColumnsService,
//     private tasksService: TasksService
//   ) {
//     const boardId = this.route.snapshot.paramMap.get('boardId');
//     if (!boardId) {
//       throw new Error('Cant get boardID from url');
//     }
//     this.boardId = boardId;
//     // this.board$ = this.boardService.board$.pipe(filter(Boolean)); //it will filter null values
//     // this.columns$ = this.boardService.columns$
//     this.data$ = combineLatest([
//       this.boardService.board$.pipe(filter(Boolean)),
//       this.boardService.columns$,
//       this.boardService.tasks$,
//     ]).pipe(
//       map(([board, columns, tasks]) => ({
//         board,
//         columns,
//         tasks,
//       }))
//     );
//   }
//   ngOnInit(): void {
//     this.socketService.emit(SocketEventsEnum.boardsJoin, {
//       boardId: this.boardId,
//     });
//     this.fetchData();
//     this.initializeListeners();
//   }

//   initializeListeners(): void {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationStart) {
//         console.log('leaving a page');
//         this.boardService.leaveBoard(this.boardId);
//       }
//     });
//     //adding for prompt reloading of page after column creation
//     this.socketService
//       .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
//       .subscribe((column) => {
//         // console.log('column', column);
//         this.boardService.addColumn(column);
//       });

//     this.socketService
//       .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
//       .subscribe((task) => {
//         // console.log('column', column);
//         this.boardService.addTask(task);
//       });
//   }

//   fetchData(): void {
//     this.boardsSerivce.getBoard(this.boardId).subscribe((board) => {
//       this.boardService.setBoard(board);
//     });
//     this.columnsService.getColumns(this.boardId).subscribe((columns) => {
//       this.boardService.setColumns(columns);
//     });
//     this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
//       this.boardService.setTasks(tasks);
//     });
//   }

//   createColumn(title: string) {
//     const columnInput: ColumnInputInterface = {
//       title,
//       boardId: this.boardId,
//     };
//     this.columnsService.createColumn(columnInput);
//   }

//   createTask(title: string, columnId: string) {
//     const taskInput: TaskInputInterface = {
//       title,
//       boardId: this.boardId,
//       columnId,
//     };
//     this.tasksService.createTask(taskInput);
//   }

//   getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
//     return tasks.filter((task) => task.columnId === columnId);
//   }
// }
// // test(): void {
// //   this.socketService.emit('columns:create', {
// //     boardId: this.boardId,
// //     title: 'foo',
// //   });
// // }
