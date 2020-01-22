import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class Place {
    constructor(
        public name?: string,
        public id?: string,
        public userCount?: number,
    ) { }
}
export class PlaceService {

    constructor() { }

    place: Place;
}
