import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Search, 
  Star, 
  Compass, 
  Building2, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Quote,
  RefreshCw,
  LocateFixed,
  Car,
  Palette
} from 'lucide-react';
import { queryMapsGrounding, GroundedPlace, GroundedWebSource, MapsGroundingResult } from '../services/mapsGroundingService';
import { StoreService } from '../services/store';

interface AtelierMapsGuideProps {
  className?: string;
  initialQuery?: string;
}

export const AtelierMapsGuide: React.FC<AtelierMapsGuideProps> = ({ 
  className = '',
  initialQuery
}) => {
  const settings = StoreService.getSettings();
  const [searchQuery, setSearchQuery] = useState(
    initialQuery || 'Visiting directions, nearby landmarks, and parking around Gulrang Antique Atelier in Gulberg III, Lahore'
  );
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'granted' | 'denied'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MapsGroundingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick preset queries
  const PRESET_QUERIES = [
    {
      id: 'atelier-directions',
      label: 'Atelier Directions & Parking',
      icon: Navigation,
      query: 'Visiting directions, prominent landmarks, and safe parking around Gulrang Antique Atelier in Gulberg III, Lahore'
    },
    {
      id: 'antique-markets',
      label: 'Antique & Craft Guilds',
      icon: Building2,
      query: 'Famous antique furniture shops, brass craft bazaars, and heritage art markets in Lahore'
    },
    {
      id: 'art-galleries',
      label: 'Fine Art Galleries',
      icon: Palette,
      query: 'Prestigious contemporary and classical art galleries, museum spaces, and exhibition centers in Lahore'
    },
    {
      id: 'framing-studios',
      label: 'Framing & Restorers',
      icon: Sparkles,
      query: 'High-end custom picture framing studios, gilding craftsmen, and antique restoration workshops in Lahore'
    },
    {
      id: 'near-me',
      label: 'Antiques & Galleries Near Me',
      icon: LocateFixed,
      query: 'Top-rated antique dealers, artisan resin studios, and fine art galleries near my current location'
    }
  ];

  // Request user location if supported
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }

    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setGeoStatus('granted');
      },
      (err) => {
        console.warn('Geolocation access error:', err.message);
        setGeoStatus('denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Perform search
  const handleSearch = async (queryText?: string) => {
    const q = queryText || searchQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await queryMapsGrounding(q, userCoords);
      setResult(data);
    } catch (err: any) {
      console.error('Failed to load Google Maps Grounding data:', err);
      setError(err.message || 'Unable to load real-time map data. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleSearch(searchQuery);
  }, []);

  // Format markdown helper (converts headings, bullets, bolding into clean React nodes)
  const renderFormattedText = (rawText: string) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-3 text-xs sm:text-sm text-[#44403C] leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Heading 3 / 4
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
            const headingText = trimmed.replace(/^#{2,3}\s+/, '');
            return (
              <h4 key={idx} className="font-serif text-base sm:text-lg font-semibold text-[#1C1917] mt-3 mb-1">
                {headingText}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const bulletText = trimmed.replace(/^[\*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-[#C5A059] mt-1 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatBold(bulletText) }} />
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s+/.test(trimmed)) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-2">
                <span className="text-[#88672D] font-semibold text-xs mt-0.5">
                  {trimmed.match(/^\d+\./)?.[0]}
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatBold(trimmed.replace(/^\d+\.\s+/, '')) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
          );
        })}
      </div>
    );
  };

  const formatBold = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#1C1917] font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-[#78716C]">$1</em>');
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#DFD1BD] shadow-xs overflow-hidden ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-[#1C1917] text-[#FAF7F2] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#C5A059]/20 text-[#E2CD9F] border border-[#C5A059]/30 flex items-center space-x-1">
                <Compass className="w-3 h-3 text-[#C5A059]" />
                <span>Google Maps Grounding</span>
              </span>
              <span className="text-[11px] text-[#A8A29E]">Powered by gemini-3.5-flash</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF7F2]">
              Atelier Locator &amp; Art District Guide
            </h3>
            <p className="text-xs sm:text-sm text-[#D6D3D1] font-light leading-relaxed">
              Explore live Google Maps directions to the Salman Khan atelier in Gulberg III, discover authentic cultural craft guilds, and navigate premier antique and art galleries.
            </p>
          </div>

          {/* Quick Salon Address Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 max-w-sm flex-shrink-0 text-xs space-y-2">
            <div className="flex items-start space-x-2 text-[#E7DFD3]">
              <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-medium">Salon Location:</strong>
                <span className="text-[11px] text-[#D6D3D1]">{settings.address}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
              <span className="text-[#A8A29E]">Visiting Hours: 11 AM – 8 PM</span>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A059] hover:text-[#E2CD9F] font-semibold flex items-center space-x-1 underline"
              >
                <span>Direct Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Query Bar */}
      <div className="p-6 sm:p-8 bg-[#FAF7F2] border-b border-[#E7DFD3] space-y-5">
        
        {/* Preset Query Badges */}
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((preset) => {
            const Icon = preset.icon;
            const isSelected = searchQuery === preset.query;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSearchQuery(preset.query);
                  if (preset.id === 'near-me' && geoStatus !== 'granted') {
                    requestLocation();
                  }
                  handleSearch(preset.query);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center space-x-2 transition-all min-h-[42px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-xs'
                    : 'bg-white hover:bg-[#F0ECE1] text-[#44403C] border border-[#DFD1BD]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A059]' : 'text-[#88672D]'}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask about directions, parking, galleries, or antique shops in any city..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#DFD1BD] rounded-xl text-xs sm:text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent min-h-[46px]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Geolocation Button */}
            <button
              type="button"
              onClick={requestLocation}
              title={geoStatus === 'granted' ? 'Using your live GPS coordinates' : 'Detect my current location'}
              className={`px-3 py-3 rounded-xl text-xs font-medium border flex items-center space-x-1.5 min-h-[46px] transition-colors cursor-pointer ${
                geoStatus === 'granted'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : geoStatus === 'locating'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-[#F5EFE6] text-[#57534E] border-[#DFD1BD]'
              }`}
            >
              {geoStatus === 'locating' ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : (
                <LocateFixed className={`w-4 h-4 ${geoStatus === 'granted' ? 'text-emerald-600' : 'text-[#88672D]'}`} />
              )}
              <span className="hidden sm:inline">
                {geoStatus === 'granted' ? 'GPS Active' : geoStatus === 'locating' ? 'Locating...' : 'My Location'}
              </span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-3 bg-[#88672D] hover:bg-[#725523] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 min-h-[46px] cursor-pointer shadow-xs flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Searching Maps...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Search Guide</span>
                </>
              )}
            </button>
          </div>
        </form>

        {geoStatus === 'granted' && userCoords && (
          <div className="text-[11px] text-emerald-700 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Maps Grounding retrieval calibrated to your coordinates: {userCoords.latitude.toFixed(4)}°, {userCoords.longitude.toFixed(4)}°</span>
          </div>
        )}
      </div>

      {/* Content & Results Section */}
      <div className="p-6 sm:p-8 space-y-8">
        
        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-lg font-medium text-[#1C1917]">
              Grounding with Google Maps &amp; Curatorial Archives...
            </p>
            <p className="text-xs text-[#78716C] max-w-md mx-auto">
              Connecting with Google Maps Platform real-time geographic data, verifying addresses, ratings, and navigation paths.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start space-x-3 text-xs text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-red-900 font-semibold">Map Retrieval Notice</strong>
              <p>{error}</p>
              <button
                onClick={() => handleSearch()}
                className="mt-2 text-xs font-semibold text-red-900 underline hover:no-underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="space-y-8">
            
            {(result as any).noticeMessage && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>{(result as any).noticeMessage}</span>
              </div>
            )}

            {/* AI Grounded Summary */}
            <div className="bg-[#FAF7F2] border border-[#E7DFD3] rounded-xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#88672D] uppercase tracking-wider pb-3 border-b border-[#E7DFD3]">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>Verified Atelier &amp; Geographic Analysis</span>
              </div>
              <div>
                {renderFormattedText(result.text)}
              </div>
            </div>

            {/* Extracted Google Maps Grounded Places */}
            {result.places && result.places.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-[#88672D]" />
                    <h4 className="font-serif text-xl font-semibold text-[#1C1917]">
                      Verified Places on Google Maps ({result.places.length})
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#78716C]">
                    Click any place to open Google Maps navigation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.places.map((place, pIdx) => (
                    <div 
                      key={pIdx}
                      className="bg-white border border-[#DFD1BD] rounded-xl p-5 hover:border-[#C5A059] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-serif text-base font-semibold text-[#1C1917] group-hover:text-[#88672D] transition-colors leading-snug">
                            {place.title}
                          </h5>
                          {place.rating && (
                            <div className="flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{place.rating.toFixed(1)}</span>
                              {place.userRatingCount && (
                                <span className="text-[10px] text-amber-700 font-normal">
                                  ({place.userRatingCount})
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {place.address && (
                          <p className="text-xs text-[#57534E] flex items-start space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#88672D] flex-shrink-0 mt-0.5" />
                            <span>{place.address}</span>
                          </p>
                        )}

                        {/* Review Snippets */}
                        {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                          <div className="pt-2 border-t border-[#F3ECE0] space-y-2">
                            {place.reviewSnippets.slice(0, 2).map((snippet, sIdx) => (
                              <div key={sIdx} className="bg-[#FAF7F2] rounded-lg p-2.5 text-[11px] text-[#57534E] space-y-1">
                                <div className="flex items-start space-x-1.5">
                                  <Quote className="w-3 h-3 text-[#C5A059] flex-shrink-0 mt-0.5" />
                                  <p className="italic line-clamp-3">
                                    "{snippet.content}"
                                  </p>
                                </div>
                                {snippet.author && (
                                  <div className="text-[10px] text-[#88672D] text-right font-medium">
                                    — {snippet.author}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Direct Google Maps Link */}
                      <a
                        href={place.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.title + ' ' + (place.address || ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#FAF7F2] hover:bg-[#1C1917] text-[#1C1917] hover:text-[#FAF7F2] border border-[#DFD1BD] rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 min-h-[40px] mt-auto"
                      >
                        <span>View on Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Web & Grounding Sources */}
            {result.webSources && result.webSources.length > 0 && (
              <div className="pt-4 border-t border-[#E7DFD3] space-y-3">
                <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                  Grounding Reference Links &amp; Catalogs:
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.webSources.map((source, sIdx) => (
                    <a
                      key={sIdx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0ECE1] border border-[#DFD1BD] rounded-lg text-xs text-[#57534E] hover:text-[#1C1917] flex items-center space-x-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-[#88672D]" />
                      <span className="truncate max-w-xs">{source.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="text-center text-[11px] text-[#A8A29E] pt-2">
              All locations, routing coordinates, and visitor quotes are grounded via the Google Maps Platform Grounding API.
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
