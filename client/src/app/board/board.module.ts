import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './components/board/board.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/services/authGuard.service';
import { BoardService } from './services/board.service';
import { ColumnsService } from '../shared/services/columns.service';
import { TopBarModule } from '../shared/modules/topBar/topBar.module';
import { InlineFormModule } from '../shared/modules/inlineForm/inlineForm.module';
import { TasksService } from '../shared/services/tasks.service';
import { TaskModalComponent } from './components/tasksModal/tasksModal.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: BoardComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [BoardComponent, TaskModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TopBarModule,
    InlineFormModule,
    ReactiveFormsModule,
  ],
  providers: [BoardService, ColumnsService, TasksService],
})
export class BoardModule {}
