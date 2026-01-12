import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-self-evaluation',
  templateUrl: './self-evaluation.component.html',
  styleUrls: ['./self-evaluation.component.css']
})
export class SelfEvaluationComponent {
  evaluationForm: FormGroup;
  certificationForm: FormGroup;
  showTest: boolean = false;
  currentQuestionIndex: number = 0;
  selectedAnswers: any[] = [];
  searchTerm = '';
  learningFields: any = [];
  occupationField: any = [];
  questions: any = [];
  certifications: any = [];
  skillCategories: any = [];

  steps = [
    { label: 'Experience Selection', formControlName: 'experience' },
    { label: 'Field Selection', formControlName: 'learningField' },
    { label: 'Occupation Selection', formControlName: 'occupationField' },
    { label: 'Skills Selection', formControlName: 'selectedSkills' },
    { label: 'Certification Selection', formControlName: 'selectedCertification' }
  ];

  filteredCategories = [...this.skillCategories];

  constructor(private fb: FormBuilder, private route: Router) {
    this.evaluationForm = this.fb.group({
      experience: ['', Validators.required],
      learningField: ['', Validators.required],
      managingPeople: ['', Validators.required],
      occupationField: ['', Validators.required],
      selectedSkills: [[]]
    });

    this.certificationForm = this.fb.group({
      search: [''],
      selectedCertification: ['']
    });
  }

  filterSkills() {
    if (this.searchTerm.trim() === '') {
      this.filteredCategories = [...this.skillCategories];
      return;
    }

    this.filteredCategories = this.skillCategories
      .map((category: { name: string; skills: string[] }) => ({
        name: category.name,
        skills: category.skills.filter((skill: string) =>
          skill.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }))
      .filter((category: { name: string; skills: string[] }) => category.skills.length > 0);
  }

  selectSkill(skill: string) {
    let selectedSkills = this.evaluationForm.get('selectedSkills')?.value || [];

    if (selectedSkills.includes(skill)) {
      selectedSkills = selectedSkills.filter((s: string) => s !== skill);
    } else {
      selectedSkills.push(skill);
    }

    this.evaluationForm.patchValue({ selectedSkills });
    console.log('Selected Skills:', this.evaluationForm.value.selectedSkills);
  }

  onSubmit() {
    if (this.certificationForm.valid) {
      const selectedCert = this.certificationForm.value.selectedCertification;
      console.log('Selected Certification:', selectedCert);

      if (this.evaluationForm) {
        if (!this.evaluationForm.get('selectedCertification')) {
          this.evaluationForm.addControl('selectedCertification', new FormControl(''));
        }

        this.evaluationForm.patchValue({ selectedCertification: selectedCert });

        setTimeout(() => {
          console.log('Updated Form Data:', this.evaluationForm.value);
          this.showTest = true;
        });
      }
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitTest();
    }
  }

  onExperienceSelect(value: string, stepper: any) {
    this.evaluationForm.patchValue({ experience: value });

    if (value === 'fresher') {
      this.learningFields = [
        'Software Development', 'Data & Analytics', 'Information Technology', 'Design',
        'Customer Support', 'Education & Training', 'UI/UX Design', 'Cybersecurity',
        'Game Development', 'Network Engineering'
      ];
      this.occupationField = [
        'Android Developer', 'Front End Web Developer', 'Software Developer',
        'Game Developer', 'UI/UX Designer', 'Web Developer', 'IT Support Specialist',
        'Junior Data Analyst', 'Network Administrator', 'Cybersecurity Analyst'
      ];
      this.skillCategories = [
        { name: 'Software', skills: ['Android Studio', 'Visual Studio Code'] },
        { name: 'Software Frameworks', skills: ['NodeJS', 'Angular'] }
      ];
      this.certifications = [
        { name: 'AWS Certified', description: 'Cloud computing certification' },
      ];
      this.questions = [
        {
          question: "What are the four main components of an Android application?",
          type: "mcq",
          options: [
            "Activity, Fragment, View, Intent", "Activity, Service, Broadcast Receiver, Content Provider",
            "Intent, View, Service, Broadcast Receiver", "Activity, View, Layout, Intent"
          ]
        }
      ]
    }
    else if (value === 'experienced') {
      this.learningFields = [
        'Marketing', 'Finance & Accounting', 'Product & Project Management', 'Business Operations',
        'Human Resources', 'Legal', 'Artificial Intelligence & Machine Learning',
        'Blockchain & Cryptocurrency', 'Public Relations', 'E-commerce'
      ];
      this.occupationField = [
        'Back End Web Developer', 'Full Stack Web Developer', 'Data Engineer',
        'DevOps Engineer', 'Java Developer', 'Machine Learning Engineer',
        'PHP Developer', 'Finance Analyst', 'Project Manager', 'Business Intelligence Analyst',
        'Marketing Specialist', 'HR Specialist', 'Legal Consultant', 'Sales Manager'
      ];
      this.skillCategories = [
        { name: 'Software', skills: ['Xcode', 'Visual Studio', 'IntelliJ IDEA'] },
        { name: 'Software Frameworks', skills: ['Express.js', 'Spring Boot'] },
      ];
      this.certifications = [
        { name: 'PMP', description: 'Project management certification' },
      ];
      this.questions = [
        {
          question: "What is the difference between Intent and PendingIntent?",
          type: "mcq",
          options: ["true", "false"]
        }
      ]
    }
    this.filteredCategories = [...this.skillCategories];
    stepper.next();
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitTest() {
    console.log("User Answers:", this.selectedAnswers);
    Swal.fire({
      title: 'Uh hooo!',
      text: 'You have successfully submitted the Self-Evolution form. Our team will get in touch with you shortly.',
      showConfirmButton: true,
      confirmButtonText: 'View Roadmap'
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigate(['/roadmap']);
      }
    });
    this.showTest = false;
  }
}