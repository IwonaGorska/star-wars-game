import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePageComponent } from './game-page.component';
import { SwapiService } from '../../services/swapi.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

// Mock SwapiService
const mockSwapiService = {
  getPeopleList: jasmine.createSpy('getPeopleList').and.returnValue(of([{ uid: '1', name: 'Luke Skywalker' }])),
  getPersonById: jasmine.createSpy('getPersonById').and.returnValue(of({
    result: { properties: { name: 'Luke Skywalker', mass: '77' } }
  })),
  getStarshipList: jasmine.createSpy('getStarshipList').and.returnValue(of([{ uid: '10', name: 'Millennium Falcon' }])),
  getStarshipById: jasmine.createSpy('getStarshipById').and.returnValue(of({
    result: { properties: { name: 'Millennium Falcon', crew: '4' } }
  }))
};

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule, GamePageComponent],
      providers: [provideHttpClient(), { provide: SwapiService, useValue: mockSwapiService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch two random entities and determine a winner', async () => {
    spyOn(component, 'compareEntities').and.callThrough();

    // Start the game, triggering API calls
    component.startGame();
    fixture.detectChanges();

    // Wait for async operations to complete
    await fixture.whenStable();
    fixture.detectChanges();

    // Debugging output
    console.log('getPeopleList called:', mockSwapiService.getPeopleList.calls.any());
    console.log('getPersonById called:', mockSwapiService.getPersonById.calls.any());
    console.log('getStarshipList called:', mockSwapiService.getStarshipList.calls.any());
    console.log('getStarshipById called:', mockSwapiService.getStarshipById.calls.any());

    // Check that the service methods were called
    expect(mockSwapiService.getPeopleList).toHaveBeenCalled();
    expect(mockSwapiService.getPersonById).toHaveBeenCalled();  // Check if called without specific arguments
    expect(mockSwapiService.getStarshipList).toHaveBeenCalled();
    expect(mockSwapiService.getStarshipById).toHaveBeenCalled(); // Check if called without specific arguments

    // Ensure entity values are set correctly
    expect(component.entity1).toBeDefined();
    expect(component.entity2).toBeDefined();

    // Expect entity names
    expect(component.entity1.name).toEqual('Luke Skywalker');
    expect(component.entity2.name).toEqual('Millennium Falcon');
  });

  it('should correctly compare two entities', () => {
    component.entity1 = { name: 'Luke Skywalker', mass: '77' };
    component.entity2 = { name: 'Millennium Falcon', crew: '4' };

    component.compareEntities();

    expect(component.winner).toContain('Luke Skywalker');  // Assuming Luke's mass > crew
  });
});
