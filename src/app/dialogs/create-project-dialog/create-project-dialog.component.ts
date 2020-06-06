import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/project';

export interface CreateProjectDialogData {
  name: string;
}

@Component({
  selector: 'create-project-dialog',
  templateUrl: 'create-project-dialog.html',
  styleUrls: []
})
export class CreateProjectDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateProjectDialogData,
  ) {}
}
