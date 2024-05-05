import { Component, HostListener, OnInit } from '@angular/core';
import { Task, TimeSpent } from '../shared/task';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  /**
   * On any changes in local storage , Total time spent need to be update in header component
   */
  @HostListener('window:storage')
  onStorageChange() {
    this.setTotalTimeSpent();
  }
  totalTimeSpent: TimeSpent = { hours: 0, mins: 0 };

  ngOnInit(): void {
    this.setTotalTimeSpent();
  }
  /**
   * To Show total Time spent
   */
  setTotalTimeSpent() {
    //Getting  task list from Local storage
    const tasks: Task[] = Object.values(
      JSON.parse(localStorage.getItem('tasks') as string)
    );
    //Updating total time spent in hours and minutes
    const timeSpent: TimeSpent = tasks.reduce(
      (acc: TimeSpent, task: Task) => {
        acc.hours += task.timeElapsed?.hours || 0;
        acc.mins += task.timeElapsed?.minutes || 0;
        return acc;
      },
      { hours: 0, mins: 0 }
    );
    //Calculating and updating minutes and hours
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
