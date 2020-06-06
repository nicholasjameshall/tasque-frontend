import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/models/project';

export interface CreateTaskDialogData {
  project: Project;
  description: string;
  priority: number;
  resourceName: string;
  resourceLink: string;
}

@Component({
  selector: 'create-task-dialog',
  templateUrl: 'create-task-dialog.html',
  styleUrls: []
})
export class CreateTaskDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTaskDialogData,
  ) {}
}
