import { Component, input, output } from '@angular/core';

@Component({
  selector: 'crh-crh-email-template-card',
  standalone: false,
  templateUrl: './crh-email-template-card.component.html',
  styleUrl: './crh-email-template-card.component.scss'
})
export class CrhEmailTemplateCardComponent {
  public template_type = input<string>("");
  public selected_email_template = input<string>("");// this variable tracks the "history", like what is the email_template that was selected before, that way a certain card would know if it should render the selected
  //style or not.
  public choosen_template = output<string>();// this variable track the "present", which email_template has been chosen now so that the parent knows, and therefore the parent updates its state but also 
  // the state of the selected property

  public chooseTemplate(email_template:string):void
  {
    console.log("the template is: ",email_template)
    this.choosen_template.emit(email_template);
  }
}
