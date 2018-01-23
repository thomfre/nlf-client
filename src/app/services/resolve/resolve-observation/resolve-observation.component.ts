import { ApiOptionsInterface } from './../../../api/api.interface';
import { Component, Input, OnInit } from '@angular/core';
import { ApiObservationsService } from '../../../api/api-observations.service';

@Component({
  selector: 'nlf-resolve-observation',
  templateUrl: './resolve-observation.component.html',
  styleUrls: ['./resolve-observation.component.css']
})
export class NlfResolveObservationComponent implements OnInit {

  @Input() id: number;
  @Input() link?: boolean;
  @Input() title?: boolean;
  @Input() ask?: boolean;
  @Input() state?: string;
  @Input() popover?: boolean;
  @Input() acl?: boolean;

  dataReady = false;
  observation = { title: '', id: 0, _id: '' };

  constructor(private orsService: ApiObservationsService) { }

  ngOnInit() {


    /**let options: ApiOptionsInterface = {
      query: { projection: { id: 1, tags: 1, 'workflow.state': 1 } }
    };

    this.orsService.getObservation(this.id, options).subscribe(**/
    this.orsService.getObservation(this.id).subscribe(
      data => {
        this.observation.id = data.id;
        this.observation._id = data._id;
        if (!!data.tags) {
          this.observation.title = data.tags.join(' ');
        } else {
          this.observation.title = 'No title';
        }
      },
      err => {
        this.observation.title = 'Ukjent observasjon (' + this.id + ')';
        this.id = 0;
      },
      () => this.dataReady = true
    );

  }

}