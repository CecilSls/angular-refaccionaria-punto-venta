import { NgModule } from '@angular/core';

//* PrimeNg exportaciones
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectButtonModule } from 'primeng/selectbutton';


@NgModule({
  exports: [
    AvatarGroupModule,
    AvatarModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    InputTextModule,
    InputNumberModule,
    KeyFilterModule,
    MenubarModule,
    MenuModule,
    MessagesModule,
    MessageModule,
    PasswordModule,
    TableModule,
    TabMenuModule,
    ToastModule,
    ToolbarModule,
    SelectButtonModule,
  ]
})
export class PrimeNgModule { }
