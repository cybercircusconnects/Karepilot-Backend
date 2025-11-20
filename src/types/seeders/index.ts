
export interface BaseCoordinates {
  x: number;
  y: number;
}

export interface PathPoint extends BaseCoordinates {}

export interface POITemplate {
  name: string;
  category: string;
  description?: string;
  coordinates: BaseCoordinates;
  icon?: string;
  color?: string;
  isAccessible?: boolean;
}

export interface EntranceTemplate {
  name: string;
  category: string;
  description?: string;
  coordinates: BaseCoordinates;
  icon?: string;
  color?: string;
  isAccessible?: boolean;
}

export interface ElevatorTemplate {
  name: string;
  description?: string;
  coordinates: BaseCoordinates;
  connectsToFloors: string[];
  color?: string;
  isAccessible?: boolean;
}

export interface PathTemplate {
  name?: string;
  points: PathPoint[];
  color?: string;
  strokeWidth?: number;
}

export interface RestrictedZoneTemplate {
  name: string;
  description?: string;
  restrictionType: "Staff Only" | "Authorized Personnel" | "Emergency Access Only";
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  color?: string;
}

export interface LabelTemplate {
  text: string;
  coordinates: BaseCoordinates;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
}

export interface MeasurementTemplate {
  name?: string;
  startPoint: BaseCoordinates;
  endPoint: BaseCoordinates;
  distance: number;
  unit: string;
  color?: string;
  strokeWidth?: number;
}

export interface AnnotationTemplate {
  name: string;
  description: string;
  type: string;
  coordinates: BaseCoordinates;
  color: string;
}
