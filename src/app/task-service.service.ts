import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Project } from './models/project';
import { Task } from './models/task';
import { Resource } from './models/resource';
import { CreateTaskRequest } from './models/createtaskrequest';
import { CreateResourceRequest } from './models/createresourcerequest';
import { CreateProjectRequest } from './models/createprojectrequest';
import { UrlBuilder } from './models/urlbuilder';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  DOMAIN = 'localhost:8000';
  PROJECTS = 'projects';
  TASKS = 'tasks';
  RESOURCES = 'resources';

  buildHeaders() {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', this.getCookie("csrftoken"))
      .set('Authorization', 'Token ' + token);

    let options = {
      'withCredentials': true,
      'headers': headers
    }

    return options;
  }

  getCookie(cname: string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  getProjects(queryParams: any[]): Observable<Project[]> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.PROJECTS);
    ub.addParameters(queryParams);
    let url = ub.build();

    return this._get(url).pipe(
      map((projects: any[]) => projects
        .map(
          project => new Project(project)
        )
      )
    );
  }

  _get(url: string) {
    let options = this.buildHeaders();
    return this.http.get(
      url,
      options
    );
  }

  deleteTask(task: Task): Observable<any> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(task.id.toString());
    let url = ub.build();
    return this._delete(url);
  }

  _delete(url: string) {
    let options = this.buildHeaders();
    return this.http.delete(
      url,
      options
    );
  }

  createProject(name: string, domain: string): Observable<Project> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.PROJECTS);
    let url = ub.build();
    let createProjectRequest = new CreateProjectRequest(
      name,
      domain
    );

    return this._post(url, createProjectRequest).pipe(
      map(json => new Project(json))
    );
  }

  createTask(createTaskRequest: CreateTaskRequest): Observable<Task> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    let url = ub.build();

    return this._post(url, createTaskRequest).pipe(
      map(json => new Task(json))
    );
  }

  createResource(createResourceRequest: CreateResourceRequest):
    Observable<Resource> {
      let ub = new UrlBuilder();
      ub.addDomain(this.DOMAIN);
      ub.addPath(this.RESOURCES);
      let url = ub.build();

    return this._post(url, createResourceRequest).pipe(
      map(json => new Resource(json))
    );
  }

  _post(url: string, resource: any): Observable<object> {
    let options = this.buildHeaders();

    return this.http.post(
      url,
      resource,
      options
    );
  }

  setTaskTaken(taskId: number): Observable<Task> {
    const TASK_TAKEN = "taken";
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(taskId.toString());
    let url = ub.build();

    let patch = {
      'status': TASK_TAKEN
    }

    return this._patch(url, patch).pipe(
      map(json => new Task(json))
    );
  }

  setTaskCompleted(taskId: number): Observable<Task> {
    const TASK_COMPLETED = "completed";
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(taskId.toString());
    let url = ub.build();
    let taskEndedDate = new Date();
    let patch = {
      'status': TASK_COMPLETED,
      'end_date': taskEndedDate.toJSON()
    }

    return this._patch(url, patch).pipe(
      map(json => new Task(json))
    );
  }

  setTaskPriority(taskId: number, priority: number): Observable<Task> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(taskId.toString());
    let url = ub.build();
    let patch = {
      'priority': priority
    }

    return this._patch(url, patch).pipe(
      map(json => new Task(json))
    );
  }

  setTaskDescription(taskId: number, description: string): Observable<Task> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(taskId.toString());
    let url = ub.build();
    let patch = {
      'description': description
    }

    return this._patch(url, patch).pipe(
      map(json => new Task(json))
    );
  }

  setTaskOpen(taskId: number): Observable<Task> {
    const TASK_OPEN = "new";
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.TASKS);
    ub.addPath(taskId.toString());
    let url = ub.build();
    let patch = {
      'status': TASK_OPEN
    }

    return this._patch(url, patch).pipe(
      map(json => new Task(json))
    );
  }

  _patch(url: string, patch: object): Observable<object> {
    let options = this.buildHeaders();
    return this.http.patch(
      url,
      patch,
      options
    );
  }


  constructor(
    private http: HttpClient
  ) { }
}
