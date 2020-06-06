import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task-service.service'
import { LoginService } from '../login.service'
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Project } from '../models/project';
import { Task } from '../models/task';
import { Router } from '@angular/router';
import { CreateProjectDialog } from
  '../dialogs/create-project-dialog/create-project-dialog.component';
import { CreateResourceDialog } from
  '../dialogs/create-resource-dialog/create-resource-dialog.component';
import { EditTaskDialog } from
  '../dialogs/edit-task-dialog/edit-task-dialog.component';

import { CreateTaskDialog } from
  '../dialogs/create-task-dialog/create-task-dialog.component';
import { CreateTaskRequest } from
  '../models/createtaskrequest';
import { CreateResourceRequest } from '../models/createresourcerequest';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  projects: Project[];
  title: string = 'Tasque';
  loading: boolean = true;
  domain: string;
  RESULTS = {
    "LOGOUT_SUCCESS": "Successfully logged out.",
    "LOGOUT_FAILURE": "Logout unsuccessful.",
    "DESCRIPTION_UPDATE_SUCCESS": "Task description successfully changed.",
    "DESCRIPTION_UPDATE_FAILURE": "Task description could not be updated.",
    "PRIORITY_UPDATE_SUCCESS": "Priority successfully updated.",
    "PRIORITY_UPDATE_FAILURE": "Priority could not be updated.",
    "TASK_OPENED_SUCCESS": "Task re-opened.",
    "TASK_OPENED_FAILURE": "Task could not be re-opened.",
    "TASK_TAKEN_SUCCESS": "Task taken.",
    "TASK_TAKEN_FAILURE": "Task could not be taken.",
    "TASK_COMPLETED_SUCCESS": "Task set as completed.",
    "TASK_COMPLETED_FAILURE": "Task could not be set as completed.",
    "RESOURCE_CREATION_SUCCESS": "Resource successfully created",
    "RESOURCE_CREATION_FAILURE": "Resource could not be created.",
    "TASK_DELETION_SUCCESS": "Task successfully deleted.",
    "TASK_DELETION_FAILURE": "Task could not be deleted.",
    "TASK_CREATION_SUCCESS": "Task successfully created",
    "TASK_CREATION_FAILURE": "Task could not be created.",
    "PROJECT_CREATION_SUCCESS": "Project successfully created",
    "PROJECT_CREATION_FAILURE": "Project could not be created.",
    "GET_PROJECTS_SUCCESS": "Successfully retrieved projects.",
    "GET_PROJECTS_FAILURE": "Failed to get projects.",
    "LOGIN": "Please log in."
    }
  ACTIONS = {
    "CLOSE": "CLOSE"
  }
  HTTP_STATUS = {
    "OKAY": 200,
    "UNAUTHORIZED": 401
  }

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let DOMAIN = "personal";
    this.getProjects(DOMAIN);
  }

  logout(): void {
    this.loginService.logout()
      .subscribe(
        result => {
          this.openSnackBar(this.RESULTS.LOGOUT_SUCCESS, this.ACTIONS.CLOSE);
          this.redirectUser();
        },
        error => {
          this.openSnackBar(this.RESULTS.LOGOUT_FAILURE, this.ACTIONS.CLOSE);
        }
      )
  }

  redirectUser() {
    this.router.navigate(['login']);
  }

  sortTasksByPriority(tasks: Task[]): Task[] {
    const TASK_TAKEN = "taken";
    const TASK_NEW = "new";

    return tasks.sort((a: Task, b: Task) => {
      if(a.status == TASK_TAKEN && b.status == TASK_TAKEN) {
        return a.startDate < b.startDate ? 1 : -1;
      } else if(a.status == TASK_NEW && b.status == TASK_NEW) {
        return a.startDate < b.startDate ? 1 : -1;
      } else if(a.status == TASK_TAKEN && b.status == TASK_NEW) {
        return -1;
      } else if(!a.completed && b.completed) {
        return -1;
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 6000,
    });
  }

  openCreateTaskDialog(project: Project) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'project': project,
      'description': '',
      'priority': '',
      'resourceName': '',
      'resourceLink': 'http://'
    }

    const dialogRef = this.dialog.open(
      CreateTaskDialog,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      let createTaskRequest = new CreateTaskRequest(
        result.project.id,
        result.description,
        result.priority
      )

      this.createTask(createTaskRequest, project,
        result.resourceName, result.resourceLink);
    });
  }

  openEditTaskDialog(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      'description': task.description
    };

    const dialogRef = this.dialog.open(
      EditTaskDialog,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      if(task.description != result.description) {
        this.changeTaskDescription(task, result.description);
      }
    });

  }

  openCreateProjectDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { 'name': '' };

    const dialogRef = this.dialog.open(
      CreateProjectDialog,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      if(result.name != "") {
        this.createProject(result.name);
      }
    });

  }

  openCreateResourceDialog(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      'name': '',
      'hyperlink': 'http://',
    };

    const dialogRef = this.dialog.open(
      CreateResourceDialog,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      if(result.name != undefined && result.hyperlink != undefined) {
        let createResourceRequest = new CreateResourceRequest(
          task.id,
          result.name,
          result.hyperlink
        );
        this._createResource(createResourceRequest, task);
      }
    });
  }

  changeTaskDescription(task: Task, description: string) {
    this.loading = true;
    return this.taskService.setTaskDescription(task.id, description)
      .subscribe(
        result => {
          task.description = description;
          this.openSnackBar(
            this.RESULTS.DESCRIPTION_UPDATE_SUCCESS,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
          return new Task(result);
        },
        error => {
          this.openSnackBar(
            this.RESULTS.DESCRIPTION_UPDATE_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        }
      );
  }

  getProjects(domain: string): Observable<Array<Project>>{
    this.loading = true;
    let queryParams = [
      ['domain', domain]
    ]
    this.taskService.getProjects(queryParams)
      .subscribe(
        projects => {
          this.projects = projects;
        },
        error => {
          if(error.status == this.HTTP_STATUS.UNAUTHORIZED) {
            this.redirectUser();
            this.openSnackBar(this.RESULTS.LOGIN, this.ACTIONS.CLOSE);
          } else {
            this.openSnackBar(
              this.RESULTS.GET_PROJECTS_FAILURE,
              this.ACTIONS.CLOSE
            );
          }
        });
    this.domain = domain;
    this.loading = false;
    return;
  }

  changeTaskPriority(task: Task) {
    this.loading = true;
    let newPriority: number;
    if(task.priority == 1) {
      newPriority = 3;
    } else {
      newPriority = task.priority - 1;
    }

    return this.taskService.setTaskPriority(task.id, newPriority)
      .subscribe(
        result => {
          task.priority = newPriority;
          this.openSnackBar(
            this.RESULTS.PRIORITY_UPDATE_SUCCESS,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
          return new Task(result);
        },
        error => {
          this.openSnackBar(
            this.RESULTS.PRIORITY_UPDATE_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        }
      );
  }

  createProject(name: string) {
    this.loading = true;
    return this.taskService.createProject(name, this.domain)
      .subscribe(
        project => {
          this.openSnackBar(
            this.RESULTS.PROJECT_CREATION_SUCCESS + ": " + project.name,
            this.ACTIONS.CLOSE
          );
          this.projects.push(new Project(project));
          this.loading = false;
        },
        error => {
          this.openSnackBar(
            this.RESULTS.PROJECT_CREATION_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        }
      )
  }

  createTask(
    createTaskRequest: CreateTaskRequest,
    project: Project,
    resourceName: string,
    resourceLink: string
  ) {
    this.loading = true;
    if(createTaskRequest.isValid) {
      return this.taskService.createTask(createTaskRequest)
        .subscribe(
          task => {
            if(typeof resourceName != 'undefined'
              && typeof resourceLink != 'undefined') {

              let createResourceRequest = new CreateResourceRequest(
                task.id,
                resourceName,
                resourceLink
              )

              this._createResource(createResourceRequest, task);
            }
            this.openSnackBar(
              this.RESULTS.TASK_CREATION_SUCCESS + ": " + task.description,
              this.ACTIONS.CLOSE
            );
            project.tasks.unshift(task);
            this.loading = false;
          },
          error => {
            this.openSnackBar(
              this.RESULTS.TASK_CREATION_FAILURE + ": " + error.error.detail,
              this.ACTIONS.CLOSE
            );
            this.loading = false;
          }
        )
    }
  }

  deleteTask(task: Task, project: Project, index: number) {
    this.loading = true;

    this.taskService.deleteTask(task)
      .subscribe(
        result => {
          project.tasks.splice(index, 1);
          this.openSnackBar(
            this.RESULTS.TASK_DELETION_SUCCESS,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        },
        error => {
          this.openSnackBar(
            this.RESULTS.TASK_DELETION_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        }
      )
  }

  _createResource(createResourceRequest: CreateResourceRequest, task: Task) {
    if(createResourceRequest.isValid) {
      return this.taskService.createResource(createResourceRequest)
        .subscribe(
          resource => {
            if(task.resources.length > 0) {
              task.resources.push(resource);
            } else {
              task.resources = [resource];
            }
          }
        )
    }
  }

  setTaskCompleted(task: Task) {
    this.loading = true;
    this.taskService.setTaskCompleted(task.id)
      .subscribe(
        result => {
          task.status = result.status;
          task.endDate = result.endDate;
          this.openSnackBar(
            this.RESULTS.TASK_COMPLETED_SUCCESS,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        },
        error => {
          this.openSnackBar(
            this.RESULTS.TASK_COMPLETED_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        });
  }

  setTaskTaken(task: Task) {
    this.loading = true;
    this.taskService.setTaskTaken(task.id)
      .subscribe(
        result => {
          task.status = result.status;
          task.endDate = result.endDate;
          this.openSnackBar(
            this.RESULTS.TASK_TAKEN_SUCCESS,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        },
        error => {
          this.openSnackBar(
            this.RESULTS.TASK_TAKEN_FAILURE,
            this.ACTIONS.CLOSE
          );
          this.loading = false;
        });
  }

  setTaskOpen(task: Task) {
    this.loading = true;
    this.taskService.setTaskOpen(task.id)
    .subscribe(
      result => {
        task.status = result.status;
        task.endDate = result.endDate;
        this.openSnackBar(
          this.RESULTS.TASK_OPENED_SUCCESS,
          this.ACTIONS.CLOSE
        );
        this.loading = false;
      },
      error => {
        this.openSnackBar(
          this.RESULTS.TASK_OPENED_FAILURE,
          this.ACTIONS.CLOSE
        );
        this.loading = false;
      });
  }
}
