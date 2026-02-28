import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  model = { name: '', email: '', content: '' };
  sending = false;
  success = false;
  error = '';

  constructor(private svc: MessageService) {}

  send() {
    if (!this.validateForm()) {
      this.error = 'Please fill in all fields with valid information.';
      return;
    }

    this.sending = true;
    this.error = '';
    this.success = false;

    this.svc.send(this.model).subscribe({
      next: () => {
        this.success = true;
        this.model = { name: '', email: '', content: '' };
        this.sending = false;
        setTimeout(() => (this.success = false), 5000); // Hide success message after 5 seconds
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to send message. Please try again.';
        this.sending = false;
      },
    });
  }

  private validateForm(): boolean {
    return (
      this.model.name.trim().length > 0 &&
      this.isValidEmail(this.model.email) &&
      this.model.content.trim().length > 0
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

