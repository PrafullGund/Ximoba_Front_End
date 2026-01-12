import { Component } from '@angular/core';

interface Forum {
  topic: string;
  category: string;
  subCategory: string;
  type: string;
  publishDate: string;
  publisher: string;
}

@Component({
  selector: 'app-trainer-forum-data',
  templateUrl: './trainer-forum-data.component.html',
  styleUrls: ['./trainer-forum-data.component.css']
})
export class TrainerForumDataComponent {
  displayedColumns: string[] = [
    'srNo',
    'topic',
    'category',
    'subCategory',
    'type',
    'publishDate',
    'publisher',
    'action',
  ];

  forums: Forum[] = [
    {
      topic: 'Why JS is important for front-end and back-end development',
      category: 'Development',
      subCategory: 'Web Development',
      type: 'Internal',
      publishDate: 'DD/MM/YYYY',
      publisher: 'Amit Bhaj',
    },
  ];

  editForum(forum: Forum) {
    console.log('Edit', forum);
  }

  saveAsDraft(forum: Forum) {
    console.log('Save as Draft', forum);
  }

  deleteForum(forum: Forum) {
    console.log('Delete', forum);
  }
}