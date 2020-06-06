import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

export interface CreateResourceDialogData {
  name: string;
  hyperlink: string;
}

@Component({
  selector: 'create-resource-dialog',
  templateUrl: 'create-resource-dialog.html',
  styleUrls: []
})
export class CreateResourceDialog {
  constructor(
    public dialogRef: MatDialogRef<CreateResourceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateResourceDialogData,
  ) {}
}
