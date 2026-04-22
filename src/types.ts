export interface WebcamLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  direction_degrees?: number;
  altitude_meters: number;
  location_description: string;
  webcam_url: string;
  current_image_url: string;
}

export type ElevationFilter = [number, number] | null;
