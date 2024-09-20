
import { TestBed } from '@angular/core/testing';
import { SwapiService } from './swapi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SwapiService]
    });
    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding HTTP requests
  });

  it('should fetch people list', () => {
    const mockResponse = {
      results: [{ uid: '1', name: 'Luke Skywalker' }, { uid: '2', name: 'Darth Vader' }]
    };

    service.getPeopleList().subscribe((data) => {
      expect(data.length).toBe(2); // Expecting the length of the array to be 2
    });

    const req = httpMock.expectOne('https://www.swapi.tech/api/people');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide mock data
  });

  it('should fetch a specific person by ID', () => {
    const dummyPerson = {
      result: {
        properties: { name: 'Luke Skywalker', mass: '77' }
      }
    };

    service.getPersonById('1').subscribe(person => {
      expect(person.result.properties.name).toEqual('Luke Skywalker');
    });

    const req = httpMock.expectOne('https://www.swapi.tech/api/people/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPerson); // Mock the person data
  });

  it('should fetch starship list', () => {
    const mockResponse = {
      results: [{ uid: '1', name: 'X-wing' }, { uid: '2', name: 'TIE Fighter' }]
    };

    service.getStarshipList().subscribe((data) => {
      expect(data.length).toBe(2); // Expecting the length of the array to be 2
    });

    const req = httpMock.expectOne('https://www.swapi.tech/api/starships');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // Provide mock data
  });

  it('should fetch a specific starship by ID', () => {
    const dummyStarship = {
      result: {
        properties: { name: 'Millennium Falcon', crew: '4' }
      }
    };

    service.getStarshipById('10').subscribe(starship => {
      expect(starship.result.properties.name).toEqual('Millennium Falcon');
    });

    const req = httpMock.expectOne('https://www.swapi.tech/api/starships/10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyStarship); // Mock the starship data
  });
});

