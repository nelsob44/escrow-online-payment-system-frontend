import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user.model';
import { Subscription } from 'rxjs';
import { BridgeService } from 'src/app/bridge.service';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() profile: User;
  
  constructor() { }

  ngOnInit() {}

}
