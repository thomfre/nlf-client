import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NlfConfluenceComponent } from './confluence.component';
import { NlfAuthGuard } from '../services/auth/auth.guard';

const nlfConfluenceRoutes: Routes = [{ path: '', component: NlfConfluenceComponent, canActivate: [NlfAuthGuard]}];


@NgModule({
  imports: [ RouterModule.forRoot(nlfConfluenceRoutes)],
  exports: [ RouterModule],
  declarations: []
})
export class NlfConfluenceRoutingModule { }