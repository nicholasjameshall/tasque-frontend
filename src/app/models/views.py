from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login as auth_login

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework import generics

from .serializers import (CustomFieldSerializer, HyperlinkResourceSerializer,
    MilestoneSerializer, UserSerializer, TaskSerializer, ProjectSerializer)
from .models import Milestone, Task, Project, CustomField, HyperlinkResource

import json
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def index(request):
    return None

@csrf_exempt
def login(request):
    body = json.loads(request.body)
    username = body["username"]
    password = body["password"]
    user = authenticate(username=username, password=password)
    if user is not None:
        auth_login(request, user)
        return HttpResponse({
            "It worked!"
        })
    else:
        return HttpResponse({
            "Problem"
        })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

class HyperlinkResourceViewSet(viewsets.ModelViewSet):
    queryset = HyperlinkResource.objects.all()
    serializer_class = HyperlinkResourceSerializer

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer

class TaskViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    """def get_queryset(self):
        project_id = self.kwargs['project_id']
        project = Project.objects.get(pk=project_id)
        queryset = project.task_set.all()
        return queryset"""

class ProjectViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
