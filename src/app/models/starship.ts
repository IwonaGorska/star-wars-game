export interface StarShip {
    result: StarShipResult;
}

export interface StarShipResult {
    properties: StarShipProperties;
}

export interface StarShipProperties {
    name: string;
    crew: string;
}