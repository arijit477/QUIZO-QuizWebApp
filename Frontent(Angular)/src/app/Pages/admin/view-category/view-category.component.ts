import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { NgFor } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryService } from '../../../service/category.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-category',
  imports: [MatDividerModule,MatButtonModule,MatIconModule, MatCardModule, MatListModule ,RouterLink],
  templateUrl: './view-category.component.html',
  styleUrl: './view-category.component.css',
})
export class ViewCategoryComponent {
  categories = [{ title: '', description: '' }];
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.categoryService.categories().subscribe(
      (data: any) => {
        this.categories = data;
        console.log(this.categories);
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error in loading data!',
        });
      }
    );
  }
}
