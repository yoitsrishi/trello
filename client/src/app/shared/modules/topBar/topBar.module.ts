import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopBarComponent } from './components/topBar/topBar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TopBarComponent],
  exports: [TopBarComponent],
})
export class TopBarModule {}
