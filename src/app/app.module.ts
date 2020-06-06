import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TaskService } from './task-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './login/login.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTaskDialog } from './dialogs/create-task-dialog/create-task-dialog.component';
import { EditTaskDialog } from './dialogs/edit-task-dialog/edit-task-dialog.component';
import { CreateResourceDialog } from './dialogs/create-resource-dialog/create-resource-dialog.component';
import { CreateProjectDialog } from './dialogs/create-project-dialog/create-project-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    LoginComponent,
    CreateTaskDialog,
    EditTaskDialog,
    CreateResourceDialog,
    CreateProjectDialog
  ],
  entryComponents: [
    CreateTaskDialog,
    EditTaskDialog,
    CreateResourceDialog,
    CreateProjectDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule
  ],
  providers: [
    TaskService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
