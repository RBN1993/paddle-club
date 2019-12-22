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
  now = new Date();
  statusSteps = 'process';
  selectedDateInCalendar = new Date();
  selectedCourt: number = null;
  bookingsByUser: [BookingModel];
  bookedHoursList: [BookingModel];
  normalizedHours: [];
  selectedHour: string;
  lastStep = 'Reserva finalizada!';
  responseStatus = null;
  availableHours = [];
  bookingListByDay = [];

  constructor(private bookingRestService: BookingRestService) {
  }

  ngOnInit() {
    this.bookingRestService.getBookingsByUser().subscribe((res) => {
      console.log(res);
      this.bookingsByUser = this.bookingRestService.processResponse(res);
      this.availableHours = this.makeAvailableHourList();
      this.makeListToShowByMonth();
    }, error => {
      this.bookingRestService.processResponse(error);
      this.bookingsByUser = null;
      console.log(error);
    });


  }

  private makeListToShowByMonth() {
    // @ts-ignore
    this.bookingListByDay = this.bookingsByUser.reduce((acc: {}, booking: {
      rsvdateTime: any;
      rsvtime: string;
      courtId: string;
      rsvday: string;
    }) => {
      if (acc[new Date(booking.rsvdateTime).toLocaleDateString()]) {
        return R.assoc(new Date(booking.rsvdateTime).toLocaleDateString(),
          [...acc[new Date(booking.rsvdateTime).toLocaleDateString()], {content: `Pista ${booking.courtId} a las ${booking.rsvtime}`}]
          , acc);
      }
      return R.assoc(new Date(booking.rsvdateTime).toLocaleDateString(),
        [{content: `Pista ${booking.courtId} a las ${booking.rsvtime}`}],
        acc);
    }, {});
    console.log(JSON.stringify(this.bookingListByDay, null, 2));
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
    this.bookingRestService.getBookingList(new Date(this.selectedDateInCalendar).getTime()).subscribe((res) => {
      console.log(res);
      this.bookedHoursList = this.bookingRestService.processResponse(res);
      if (this.selectedCourt) {
        this.selectCourt(this.selectedCourt);
      }
    }, error => {
      console.log(error);
      this.bookingRestService.processResponse(error);
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
    this.normalizedHours = this.getFreeHours(this.bookedHoursList, courtId);
    this.selectedHour = null;
  }

  selectHour(hour: string) {
    this.selectedHour = hour;

  }

  makeAvailableHourList() {
    // tslint:disable-next-line:prefer-const
    let acc = [];
    for (let i = 10; i <= 21; i++) {
      acc.push(`${i}:00`);
    }
    // @ts-ignore
    return acc;
  }

  private getFreeHours(res: [BookingModel], courtId: number) {
    const isSameCourt = b => b.courtId === courtId;
    const filteredListById = R.filter(isSameCourt, res);
    const isNotInclude = h => !filteredListById.find(x => x.rsvtime === h);
    if (this.selectedDateInCalendar.toLocaleDateString() === this.now.toLocaleDateString()) {
      const isMinor = h => !(parseInt(h, 10) <= new Date().getHours());
      return R.pipe(
        R.filter(isNotInclude),
        R.filter(isMinor)
      )(this.availableHours);
    }
    return R.filter(isNotInclude, this.availableHours);
  }


  canSelectDay(): boolean {
    return this.selectedDateInCalendar.getTime() >= this.now.getTime();
  }
}
