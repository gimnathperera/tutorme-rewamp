"use client";
import { useState } from "react";

const TutoringPreferences = () => {
  const [formData, setFormData] = useState({
    levels: [] as string[],
    locations: [] as string[],
    noPreference: false
  });

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
    const updatedLevels = formData.levels.includes(level)
      ? formData.levels.filter(l => l !== level)
      : [...formData.levels, level];
    
    setFormData(prev => ({ ...prev, levels: updatedLevels }));
  };

  const handleLocationChange = (location: string) => {
    let updatedLocations;
    
    if (formData.locations.includes(location)) {
      updatedLocations = formData.locations.filter(l => l !== location);
    } else {
      updatedLocations = [...formData.locations, location];
    }
    
    setFormData(prev => ({ ...prev, locations: updatedLocations, noPreference: false }));
  };

  const handleNoPreference = () => {
    setFormData(prev => ({ 
      ...prev,
      noPreference: !prev.noPreference,
      locations: !prev.noPreference ? [] : prev.locations
    }));
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">2</span>
            Tutoring Preferences
          </h2>

          {/* Level and Subjects */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Level and Subject You Can As Mainly As Possible:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {levels.map((level) => (
                <label key={level} className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.levels.includes(level)}
                    onChange={() => handleLevelChange(level)}
                    className="mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Tutoring Locations */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">
              Preferred Tutoring Locations:
            </h3>
            
            {Object.entries(locationsByRegion).map(([region, locations]) => (
              <div key={region} className="mb-6">
                <h4 className="font-semibold text-darkpurple mb-3">{region}:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center p-2 border rounded hover:bg-lightblue cursor-pointer transition-colors text-sm">
                      <input
                        type="checkbox"
                        checked={formData.locations.includes(location)}
                        onChange={() => handleLocationChange(location)}
                        disabled={formData.noPreference}
                        className="mr-2 text-primary-700 focus:ring-primary-700 rounded"
                      />
                      <span className={formData.noPreference ? 'text-gray-400' : ''}>{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* No Preference Option */}
            <div className="mt-6 p-4 bg-lightblue rounded-lg">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.noPreference}
                  onChange={handleNoPreference}
                  className="mr-3 text-primary-700 focus:ring-primary-700 rounded"
                />
                <span className="font-medium text-darkpurple">No Preference</span>
              </label>
              <p className="text-sm text-gray-600 mt-1 ml-6">
                Select this if you're willing to travel to any location in Singapore
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutoringPreferences;