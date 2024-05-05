import { Component, HostListener, OnInit } from '@angular/core';
import { Task, TimeSpent } from '../shared/task';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @HostListener('window:storage')
  onStorageChange() {
    this.setTotalTimeSpent();
  }
  totalTimeSpent: TimeSpent = { hours: 0, mins: 0 };

  ngOnInit(): void {
    this.setTotalTimeSpent();
  }

  setTotalTimeSpent() {
    const tasks: Task[] = Object.values(
      JSON.parse(localStorage.getItem('tasks') as string)
    );
    const timeSpent: TimeSpent = tasks.reduce(
      (acc: TimeSpent, task: Task) => {
        acc.hours += task.timeElapsed?.hours || 0;
        acc.mins += task.timeElapsed?.minutes || 0;
        return acc;
      },
      { hours: 0, mins: 0 }
    );
    if (timeSpent.mins > 60) {
      const hours = Math.floor(timeSpent.mins / 60);
      timeSpent.hours += hours;
      timeSpent.mins -= hours * 60;
    } else if (timeSpent.mins === 60) {
      timeSpent.hours += 1;
      timeSpent.mins = 0;
    }
    this.totalTimeSpent = timeSpent;
  }
}
