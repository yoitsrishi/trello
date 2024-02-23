import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineFormComponent } from './components/inlineForm/inlineForm.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [InlineFormComponent],
  exports: [InlineFormComponent],
})
export class InlineFormModule {}
