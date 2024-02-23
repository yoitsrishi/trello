import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { AuthGuardService } from '../auth/services/authGuard.service';
import { BoardService } from '../shared/services/board.service';
import { InlineFormModule } from '../shared/modules/inlineForm/inlineForm.module';
import { TopBarModule } from '../shared/modules/topBar/topBar.module';

const routes: Routes = [
  {
    path: 'boards',
    component: BoardsComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  declarations: [BoardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InlineFormModule,
    TopBarModule,
  ],
  providers: [BoardService],
})
export class BoardsModule {}
