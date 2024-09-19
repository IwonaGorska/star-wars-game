import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, GamePageComponent],
})
export class AppComponent {
  title = 'star-wars-game';
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // Make sure to provide HTTP client here
  ]
}).catch(err => console.error(err));
