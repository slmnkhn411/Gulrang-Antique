export interface ReviewSnippet {
  content: string;
  uri: string;
  author: string;
}

export interface GroundedPlace {
  title: string;
  uri: string;
  placeId?: string;
  address?: string;
  rating?: number | null;
  userRatingCount?: number | null;
  reviewSnippets?: ReviewSnippet[];
}

export interface GroundedWebSource {
  title: string;
  uri: string;
}

export interface MapsGroundingResult {
  text: string;
  places: GroundedPlace[];
  webSources: GroundedWebSource[];
  groundingMetadata?: any;
}

export async function queryMapsGrounding(
  query: string,
  coords?: { latitude: number; longitude: number } | null
): Promise<MapsGroundingResult> {
  const response = await fetch('/api/maps/grounding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch Maps Grounding (Status ${response.status})`);
  }

  return response.json();
}
