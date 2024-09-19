import { Component, OnDestroy } from '@angular/core';
import { SwapiService } from '../../services/swapi.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { map, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    FormsModule
  ],
  providers: [SwapiService],
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnDestroy {
  entity1: any = null;
  entity2: any = null;
  winner: string = '';
  isLoading: boolean = false;
  leftWins: number = 0;  // Track wins for the left player
  rightWins: number = 0; // Track wins for the right player
  selectedOption: string = 'mix'; // Selected option: 'person', 'starship', or 'mix'
  private subscriptions: Subscription[] = [];

  constructor(private swapiService: SwapiService) {}

  startGame(): void {
    this.isLoading = true;
    this.winner = '';

    // Fetch two random entities based on the user's selection
    this.subscriptions.push(
      this.getEntity(this.selectedOption).subscribe(entity1 => {
        this.entity1 = entity1;
        this.subscriptions.push(
          this.getEntity(this.selectedOption).subscribe(entity2 => {
            this.entity2 = entity2;
            this.compareEntities();
            this.isLoading = false;
          })
        );
      })
    );
  }

  // Fetch an entity based on the selected resource option
  getEntity(option: string) {
    if (option === 'person') {
      return this.getRandomPerson();
    } else if (option === 'starship') {
      return this.getRandomStarship();
    } else {
      return this.getRandomEntity();
    }
  }

  // Fetch either a person or a starship at random
  getRandomEntity() {
    const randomChoice = Math.random() < 0.5 ? 'person' : 'starship';
    return randomChoice === 'person' ? this.getRandomPerson() : this.getRandomStarship();
  }

  // Fetch a random person
  getRandomPerson() {
    return this.swapiService.getPeopleList().pipe(
      switchMap(response => {
        const peopleList = response;
        const randomIndex = Math.floor(Math.random() * peopleList.length);
        const randomPersonId = peopleList[randomIndex].uid;
        return this.swapiService.getPersonById(randomPersonId);
      }),
      map(personResponse => personResponse.result.properties)
    );
  }

  // Fetch a random starship
  getRandomStarship() {
    return this.swapiService.getStarshipList().pipe(
      switchMap(response => {
        const starshipList = response;
        const randomIndex = Math.floor(Math.random() * starshipList.length);
        const randomStarshipId = starshipList[randomIndex].uid;
        return this.swapiService.getStarshipById(randomStarshipId);
      }),
      map(starshipResponse => starshipResponse.result.properties)
    );
  }

  // Compare the two players and update the winner
  compareEntities(): void {
    const entity1Value = this.getComparisonValue(this.entity1);
    const entity2Value = this.getComparisonValue(this.entity2);

    if (entity1Value > entity2Value) {
      this.winner = `Left Player (${this.entity1.name || this.entity1.model}) wins!`;
      this.leftWins++;  // Increment left side wins
    } else if (entity2Value > entity1Value) {
      this.winner = `Right Player (${this.entity2.name || this.entity2.model}) wins!`;
      this.rightWins++; // Increment right side wins
    } else {
      this.winner = 'It’s a tie!';
    }
  }

  getComparisonValue(entity: any): number {
    if (entity.mass) {
      return parseFloat(entity.mass);
    } else if (entity.crew) {
      return parseFloat(entity.crew);
    } else {
      return 0; // Fallback if neither mass nor crew is available
    }
  }

  resetGame(): void {
    this.entity1 = null;
    this.entity2 = null;
    this.winner = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
