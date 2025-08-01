"use client";
import { useState } from "react";

const AcademicExperience = () => {
  const [formData, setFormData] = useState({
    tutorType: "",
    yearsExperience: "",
    educationLevel: ""
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">3</span>
            Academic Qualifications & Experience
          </h2>

          <div className="space-y-8">
            {/* Type of Tutor */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Type of Tutor *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tutorTypes.map((type) => (
                  <label key={type} className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="tutorType"
                      value={type}
                      checked={formData.tutorType === type}
                      onChange={handleChange}
                      className="mr-3 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="text-sm font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Years of Teaching Experience */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Yrs of Teaching Experience *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].map((years) => (
                  <label key={years} className="flex items-center justify-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="yearsExperience"
                      value={years}
                      checked={formData.yearsExperience === years}
                      onChange={handleChange}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="font-medium">{years}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Highest Education Level */}
            <div>
              <label className="block text-lg font-semibold text-darkpurple mb-4">
                Highest Education Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {educationLevels.map((level) => (
                  <label key={level} className="flex items-center p-3 border rounded-lg hover:bg-lightblue cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="educationLevel"
                      value={level}
                      checked={formData.educationLevel === level}
                      onChange={handleChange}
                      className="mr-3 text-primary-700 focus:ring-primary-700"
                    />
                    <span className="text-sm font-medium">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue p-4 rounded-lg">
              <p className="text-sm text-white">
                <strong>Note:</strong> If you are above School Leaver, please kindly indicate your field of study, university attended, 
                academic achievements, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicExperience;