import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-verify-item',
  templateUrl: './verify-item.component.html',
  styleUrls: ['./verify-item.component.scss'],
})
export class VerifyItemComponent implements OnInit {
  @ViewChild('secretAnswer', { static: false}) secretAnswerPickerRef: ElementRef<HTMLInputElement>;
  @Input() character: number;
  @Output() selectedCharacter = new EventEmitter<any[]>();
  public selectedArray = [];
  constructor() { }

  ngOnInit() {}

  processChange(event: Event) {
    const chosenCharacter = (event.target as HTMLInputElement).value;
    this.selectedArray.push(this.character, chosenCharacter);
    this.selectedCharacter.emit(this.selectedArray);
  }

}
