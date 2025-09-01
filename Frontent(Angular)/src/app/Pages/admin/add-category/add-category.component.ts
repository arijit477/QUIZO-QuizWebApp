import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CategoryService } from '../../../service/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  imports: [
    FormsModule,
    MatButtonModule,
    TextFieldModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
})
export class AddCategoryComponent {
  category = {
    title: '',
    description: '',
  };

  constructor(
    private _category: CategoryService,
    private _snack: MatSnackBar
  ) {}
  formSubmit() {
    if (this.category.title.trim() == '' || this.category.title == null) {
      this._snack.open('Please enter category title!', '', {
        duration: 2000,
      });
      return;
    }
    //all done
    this._category.addCategory(this.category).subscribe(
        (data:any) => {
          this.category.title='',
          this.category.description='',
          Swal.fire("Success !!",'Category added successfully','success')
  },
  (error) => {
    Swal.fire('Error !!','Category not added','error')
  })
}
}
