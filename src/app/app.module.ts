import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/**
 * Angular Modules Router
 */
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

/**
 * Angular Modules component
*/
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';

/**
 * Angular Modules Angular Material
 */
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/**
 * Angular FormsModule & ReactiveFormsModule
 */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Angular HttpClientModule
 */
import { HttpClientModule } from '@angular/common/http';

/**
 * Angular Animations
 */
import { provideAnimations } from '@angular/platform-browser/animations';

/**
 * Angular Services
 */
import { ClienteService } from './clientes/cliente.service';
import { ModalService } from './clientes/detalle/modal.service';
import { FacturaService } from './facturas/services/factura.service';

/**
 * Angular i18n Locale es
 */
import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeES, 'es');

const routes: Routes = [
  /*
   * Redirección por defecto
   */
  {
    path: '',
    redirectTo: '/clientes',
    pathMatch: 'full'
  },

  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:page', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent },
  { path: 'clientes/form/:id', component: FormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'factura/:id', component: DetalleFacturaComponent },
  { path: 'facturas/form/:cliente', component: FacturasComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],

  providers: [
    ClienteService,
    FacturaService,
    ModalService,
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
