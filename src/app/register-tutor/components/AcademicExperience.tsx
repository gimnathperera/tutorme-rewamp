"use client";

interface AcademicExperienceProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  updateErrors: (section: string, errors: any) => void;
}

export default function AcademicExperience({ formData, updateFormData, errors, updateErrors }: AcademicExperienceProps) {
  
  const tutorTypes = [
    'FULL TIME STUDENT',
    'UNDERGRADUATE',
    'PART TIME TUTOR',
    'FULL TIME TUTOR',
    'EX/CURRENT MOE TEACHER',
    'EX-MOE TEACHER',
    'CURRENT MOE TEACHER'
  ];

  const educationLevels = [
    'PHD DIPLOMA',
    'MASTERS',
    'UNDERGRADUATE',
    'BACHELOR DEGREE',
    'DIPLOMA AND PROFESSIONAL',
    'JC/A LEVELS',
    'POLY',
    'OTHERS'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData('academic', { [name]: value });
    
    // Clear error when user makes selection
    if (errors[name]) {
      updateErrors('academic', { ...errors, [name]: '' });
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'tutorType':
        if (!value) error = 'Please select tutor type';
        break;
      case 'yearsExperience':
        if (!value) error = 'Please select years of experience';
        break;
      case 'educationLevel':
        if (!value) error = 'Please select education level';
        break;
    }
    
    updateErrors('academic', { ...errors, [name]: error });
  };

  return (
    <section className="border-b border-gray-200 pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
        Academic Qualifications & Experience
      </h2>

      <div className="space-y-8">
        {/* Type of Tutor */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Type of Tutor *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tutorTypes.map((type) => (
              <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="tutorType"
                  value={type}
                  checked={formData.tutorType === type}
                  onChange={handleChange}
                  className="mr-3 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium">{type}</span>
              </label>
            ))}
          </div>
          {errors.tutorType && <p className="text-red-500 text-sm mt-2">{errors.tutorType}</p>}
        </div>

        {/* Years of Teaching Experience */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Yrs of Teaching Experience *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((years) => (
              <label key={years} className="flex items-center justify-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="yearsExperience"
                  value={years}
                  checked={formData.yearsExperience === years}
                  onChange={handleChange}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                <span className="font-medium">{years}</span>
              </label>
            ))}
          </div>
          {errors.yearsExperience && <p className="text-red-500 text-sm mt-2">{errors.yearsExperience}</p>}
        </div>

        {/* Highest Education Level */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">
            Highest Education Level *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {educationLevels.map((level) => (
              <label key={level} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="educationLevel"
                  value={level}
                  checked={formData.educationLevel === level}
                  onChange={handleChange}
                  className="mr-3 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium">{level}</span>
              </label>
            ))}
          </div>
          {errors.educationLevel && <p className="text-red-500 text-sm mt-2">{errors.educationLevel}</p>}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you are above School Leaver, please kindly indicate your field of study, university attended, 
            academic achievements, etc.
          </p>
        </div>
      </div>
    </section>
  );
}