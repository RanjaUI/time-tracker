import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Task,
  TaskEventTypes,
  TaskIntervals,
  TaskTimerHistory,
  TaskWithLogs,
} from '../shared/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, OnDestroy {
  task: Task = {
    title: '',
    id: '',
    timeElapsed: null,
    isActive: false,
    timerHistory: [],
  };
  taskTitle: string = '';
  isModalVisible = false;
  isTaskTitleEmpty = false;
  taskList: Task[] = [];
  taskLogs: TaskWithLogs = {};
  taskIntervals: TaskIntervals = {};
  taskEventTypes: TaskEventTypes = {};
  taskTimerHistory: TaskTimerHistory = {};
  isShowError = false;
  constructor() {}

  ngOnInit(): void {
    this.taskList = Object.values(
      JSON.parse(localStorage.getItem('tasks') as string) || []
    );
    this.taskList.forEach((task: Task) => {
      this.taskEventTypes[task.id] = task.isActive ? 'Stop' : 'Start';
      if (task.isActive) {
        this.startStopTimer('Start', task.id, true);
      }
      this.taskLogs[task.id] = task.timeElapsed || {
        seconds: 0,
        minutes: 0,
        hours: 0,
      };
      this.taskTimerHistory[task.id] = task.timerHistory;
    });
  }

  startStopTimer(eventType: string, taskId: string, isInit?: boolean) {
    const tasks = JSON.parse(localStorage.getItem('tasks') as string);
    if (eventType === 'Start') {
      if (!isInit) {
        this.taskEventTypes[taskId] = 'Stop';
        tasks[taskId].isActive = true;
        tasks[taskId].timerHistory = [
          { startedAt: Date.now(), stoppedAt: null },
          ...tasks[taskId].timerHistory,
        ];
        this.taskTimerHistory[taskId] = tasks[taskId].timerHistory;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      this.taskIntervals[taskId] = setInterval(() => {
        let updateTimeSpent = false;
        this.taskLogs[taskId].seconds += 1;
        if (this.taskLogs[taskId].seconds === 60) {
          updateTimeSpent = true;
          this.taskLogs[taskId].seconds = 0;
          this.taskLogs[taskId].minutes += 1;
        }
        if (this.taskLogs[taskId].minutes === 60) {
          updateTimeSpent = true;
          this.taskLogs[taskId].minutes = 0;
          this.taskLogs[taskId].hours += 1;
        }
        const updatedTasks = JSON.parse(
          localStorage.getItem('tasks') as string
        );
        updatedTasks[taskId].timeElapsed = this.taskLogs[taskId];
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        if (updateTimeSpent) {
          window.dispatchEvent(new Event('storage'));
        }
      }, 1000);
    } else if (eventType === 'Stop') {
      this.taskEventTypes[taskId] = 'Start';
      clearInterval(this.taskIntervals[taskId]);
      tasks[taskId].isActive = false;
      tasks[taskId].timerHistory.forEach((timer: any) => {
        if (timer.startedAt && timer.stoppedAt === null) {
          timer.stoppedAt = Date.now();
        }
      });
      this.taskTimerHistory[taskId] = tasks[taskId].timerHistory;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  removeTask(taskId: string) {
    const taskList = JSON.parse(localStorage.getItem('tasks') as string) || {};
    delete taskList[taskId];
    this.taskList = Object.values(taskList);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    window.dispatchEvent(new Event('storage'));
    clearInterval(this.taskIntervals[taskId]);
  }

  saveTask() {
    if (this.taskTitle.trim() !== '') {
      this.task.id = crypto.randomUUID();
      const tasks = JSON.parse(localStorage.getItem('tasks') as string) || {};
      tasks[this.task.id] = { ...this.task, title: this.taskTitle };
      this.taskEventTypes[this.task.id] = 'Start';
      this.taskLogs[this.task.id] = { seconds: 0, minutes: 0, hours: 0 };
      this.taskList = Object.values(tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.isModalVisible = false;
      this.task.id = '';
      this.task.title = '';
      this.taskTitle = '';
      this.isShowError = false;
    } else {
      this.isShowError = true;
    }
  }

  openAddTaskModal() {
    this.isModalVisible = true;
  }

  ngOnDestroy(): void {
    this.taskList.forEach((task) => {
      clearInterval(this.taskIntervals[task.id]);
    });
  }
}
