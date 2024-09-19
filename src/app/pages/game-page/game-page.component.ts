import { Component, OnDestroy } from '@angular/core';
import { SwapiService } from '../../services/swapi.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
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
  private subscriptions: Subscription[] = [];

  constructor(private swapiService: SwapiService) {}

  startGame(): void {
    this.isLoading = true;
    this.winner = '';

    // Fetch two random entities (either person or starship)
    this.subscriptions.push(
      this.getRandomEntity().subscribe(entity1 => {
        this.entity1 = entity1;
        this.subscriptions.push(
          this.getRandomEntity().subscribe(entity2 => {
            this.entity2 = entity2;
            this.compareEntities();
            this.isLoading = false;
          })
        );
      })
    );
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

  // Compare the two entities and update the winner
  compareEntities(): void {
    const entity1Value = this.getComparisonValue(this.entity1);
    const entity2Value = this.getComparisonValue(this.entity2);

    if (entity1Value > entity2Value) {
      this.winner = `Left Entity (${this.entity1.name || this.entity1.model}) wins!`;
      this.leftWins++;  // Increment left side wins
    } else if (entity2Value > entity1Value) {
      this.winner = `Right Entity (${this.entity2.name || this.entity2.model}) wins!`;
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
