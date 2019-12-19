import {Component, OnInit} from '@angular/core';
import {BookingRestService} from '../../core/services/booking.service';
import {BookingModel} from '../../core/models/booking.model';
import * as R from 'ramda';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  current = 0;
  index = 'one';
  selectedDateInCalendar = new Date();
  selectedCourt: number = null;
  bookingsByUser: [BookingModel];
  bookedHoursList: [BookingModel];
  normalizedHours: [];
  selectedHour: string;
  listDataMap = {
    1: [
      {type: 'warning', content: 'This is warning event.'},
      {type: 'success', content: 'This is usual event.'}
    ]
  };

  constructor(private bookingRestService: BookingRestService) {
  }

  ngOnInit() {
    this.bookingRestService.getBookingsByUser().subscribe((res: [BookingModel]) => {
      console.log(res);
      this.bookingsByUser = res;
    }, error => {
      console.log(error);
      this.bookingsByUser = null;
    });
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
    this.bookingRestService.getBookingList(new Date(this.selectedDateInCalendar).getTime()).subscribe((res: [BookingModel]) => {
      console.log(res);
      this.bookedHoursList = res;
      if (this.selectedCourt) {
        this.selectCourt(this.selectedCourt);
      }
    }, error => {
      console.log(error);
      this.bookedHoursList = null;
    });

  }

  done(): void {
    this.current += 1;
    this.bookingRestService.postNewBooking({courtid: this.selectedCourt, rsvdatetime: 1577876400000}).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'one';
        break;
      }
      case 1: {
        this.index = 'two';
        break;
      }
      case 2: {
        this.index = 'three';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

  selectChange(select: Date): void {
    this.selectedDateInCalendar = select;
    this.selectedHour = null;
  }

  selectCourt(courtId: number) {
    this.selectedCourt = courtId;
    this.normalizedHours = this.getHoursList(this.bookedHoursList, courtId);

  }

  selectHour(hour: string) {
    this.selectedHour = hour;

  }

  freeHoursList() {
    // tslint:disable-next-line:prefer-const
    let acc = [];
    for (let i = 10; i <= 21; i++) {
      acc.push(`${i}:00`);
    }
    // @ts-ignore
    return acc;
  }

  private getHoursList(res: [BookingModel], courtId: number) {
    const isSameCourt = b => b.courtId === courtId;
    const filteredListById = R.filter(isSameCourt, res);
    const freeHours = this.freeHoursList();
    const isNotInclude = f => !filteredListById.find(x => x.rsvtime === f);
    return R.filter(isNotInclude, freeHours);
  }


}
