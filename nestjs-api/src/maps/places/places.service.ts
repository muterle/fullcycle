import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  constructor(private readonly googleMapsClient: GoogleMapsClient) {}

  async findPlaces(text: string) {
    const { data } = await this.googleMapsClient.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'formatted_address', 'name', 'geometry'],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    return data;
  }
}
