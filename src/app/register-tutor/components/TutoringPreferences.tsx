"use client";

interface TutoringPreferencesProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  updateErrors: (section: string, errors: any) => void;
}

export default function TutoringPreferences({ formData, updateFormData, errors, updateErrors }: TutoringPreferencesProps) {
  
  const levels = [
    'Pre-School', 'Primary School', 'Lower Secondary', 'Upper Secondary', 
    'Junior College', 'IB/IGCSE', 'Diploma / Degree', 'Language', 
    'Computing', 'Special Skills', 'Music'
  ];

  const locationsByRegion = {
    'North': ['Admiralty', 'Ang Mo Kio', 'Bishan', 'Boon Lay', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Clementi', 'Jurong East', 'Jurong West', 'Kranji', 'Marsiling', 'Sembawang', 'Sengkang', 'Woodlands', 'Yew Tee', 'Yishun'],
    'East': ['Bedok', 'Changi', 'East Coast', 'Geylang', 'Hougang', 'Katong', 'Marine Parade', 'Pasir Ris', 'Punggol', 'Serangoon', 'Tampines', 'Ubi'],
    'West': ['Boon Lay', 'Bukit Batok', 'Bukit Merah', 'Bukit Timah', 'Choa Chu Kang', 'Clementi', 'Dover', 'Holland Village', 'Jurong East', 'Jurong West', 'Newton', 'Queenstown', 'Toa Payoh', 'West Coast'],
    'South': ['Boat Quay', 'Bugis', 'Chinatown', 'City Hall', 'Clarke Quay', 'Dhoby Ghaut', 'Marina Bay', 'Orchard', 'Raffles Place', 'Robertson Quay', 'Tanjong Pagar'],
    'North-West': ['Bukit Panjang', 'Choa Chu Kang', 'Hillview', 'Keat Hong', 'Teck Whye'],
    'Central': ['Ang Mo Kiao', 'Balestier', 'Bishan', 'Bras Basah', 'Farrer Park', 'Kallang', 'Lavender', 'Little India', 'MacPherson', 'Novena', 'Potong Pasir', 'Rochor', 'Serangoon', 'Thomson', 'Toa Payoh']
  };

  const handleLevelChange = (level: string) => {
    const currentLevels = formData.levels || [];
    const updatedLevels = currentLevels.includes(level)
      ? currentLevels.filter((l: string) => l !== level)
      : [...currentLevels, level];
    
    updateFormData('preferences', { levels: updatedLevels });
  };

  const handleLocationChange = (location: string) => {
    const currentLocations = formData.locations || [];
    let updatedLocations;
    
    if (currentLocations.includes(location)) {
      updatedLocations = currentLocations.filter((l: string) => l !== location);
    } else {
      updatedLocations = [...currentLocations, location];
    }
    
    updateFormData('preferences', { locations: updatedLocations, noPreference: false });
  };

  const handleNoPreference = () => {
    updateFormData('preferences', { 
      noPreference: !formData.noPreference,
      locations: formData.noPreference ? formData.locations : []
    });
  };

  return (
    <section className="border-b border-gray-200 pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
        Tutoring Preferences
      </h2>

      {/* Level and Subjects */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-orange-600 mb-4">
          Level and Subject You Can As Mainly As Possible:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {levels.map((level) => (
            <label key={level} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={(formData.levels || []).includes(level)}
                onChange={() => handleLevelChange(level)}
                className="mr-3 text-orange-500 focus:ring-orange-500 rounded"
              />
              <span className="text-sm">{level}</span>
            </label>
          ))}
        </div>
        {errors.levels && <p className="text-red-500 text-sm mt-2">{errors.levels}</p>}
      </div>

      {/* Preferred Tutoring Locations */}
      <div>
        <h3 className="text-lg font-semibold text-orange-600 mb-4">
          Preferred Tutoring Locations:
        </h3>
        
        {Object.entries(locationsByRegion).map(([region, locations]) => (
          <div key={region} className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">{region}:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {locations.map((location) => (
                <label key={location} className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors text-sm">
                  <input
                    type="checkbox"
                    checked={(formData.locations || []).includes(location)}
                    onChange={() => handleLocationChange(location)}
                    disabled={formData.noPreference}
                    className="mr-2 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className={formData.noPreference ? 'text-gray-400' : ''}>{location}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* No Preference Option */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.noPreference || false}
              onChange={handleNoPreference}
              className="mr-3 text-orange-500 focus:ring-orange-500 rounded"
            />
            <span className="font-medium text-gray-700">No Preference</span>
          </label>
          <p className="text-sm text-gray-600 mt-1 ml-6">
            Select this if you're willing to travel to any location in Singapore
          </p>
        </div>

        {errors.locations && <p className="text-red-500 text-sm mt-2">{errors.locations}</p>}
      </div>
    </section>
  );
}