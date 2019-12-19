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
  statusSteps = 'process';
  selectedDateInCalendar = new Date();
  selectedCourt: number = null;
  bookingsByUser: [BookingModel];
  bookedHoursList: [BookingModel];
  normalizedHours: [];
  selectedHour: string;
  lastStep = 'Reserva finalizada!';
  responseStatus = null;
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
      this.bookingsByUser = null;
      console.log(error);

    });
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
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
    console.log('time', new Date(this.selectedDateInCalendar.toDateString() + ' ' + this.selectedHour));
    this.bookingRestService.postNewBooking({
      courtid: this.selectedCourt,
      rsvdatetime: new Date(this.selectedDateInCalendar.toDateString() + ' ' + this.selectedHour).getTime()
    })
      .subscribe(res => {
        console.log(res);
        this.lastStep = 'Reserva finalizada!';
      }, error => {
        this.lastStep = 'Error en la reserva';
        this.statusSteps = 'error';
        this.responseStatus = this.bookingRestService.makeBookingTextError(error);
      });
  }

  goHome(): void {
    this.lastStep = 'Reserva finalizada!';
    this.statusSteps = 'process';
    this.current = 0;
    this.selectedHour = null;
  }

  selectChange(select: Date): void {
    this.selectedDateInCalendar = select;
    this.selectedHour = null;
  }

  selectCourt(courtId: number) {
    this.selectedCourt = courtId;
    this.normalizedHours = this.getHoursList(this.bookedHoursList, courtId);
    this.selectedHour = null;
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
