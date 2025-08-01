"use client";
import { useState } from "react";

const TutorProfile = () => {
  const [formData, setFormData] = useState({
    introduction: "",
    experience: "",
    results: ""
  });

  const profileQuestions = [
    {
      key: 'introduction',
      title: '1. SUMMARY OF TEACHING EXPERIENCE & ACADEMIC ACHIEVEMENTS',
      subtitle: 'Achieve & Subject content taught, eg. Number of STUDENTS, etc.',
      placeholder: 'Academic Qualifications, Years and Conditions, etc.',
      maxLength: 750
    },
    {
      key: 'experience',
      title: '2. RESULTS OF STUDENTS/TRACK RECORD',
      subtitle: 'Past Grade Improvement Records of Previous Students.',
      placeholder: 'Please list results if you have records (exam all)',
      maxLength: 750
    },
    {
      key: 'results',
      title: '3. OTHER SELLING POINTS AS A TUTOR',
      subtitle: 'Any interesting teaching methods and commitments etc. What makes you stand out?',
      placeholder: 'eg: Motivating teaching methods for encouraging students etc.',
      maxLength: 750
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
            Tutor's Profile (Extremely Important!)
          </h2>

          <div className="bg-lightblue border-l-4 border-primary-700 p-4 mb-8">
            <p className="text-darkpurple font-medium">
              <strong>Important:</strong> The following section will be a key factor in your success rate of assignment matching.
            </p>
            <p className="text-gray-700 text-sm mt-1">
              For parents who wish to view immediate info for their students before making assignments which will be shown to our clients.
            </p>
            <p className="text-gray-700 text-sm mt-1">
              For each section please using approximately from 50 to application. <strong>Excellent answer required</strong>
            </p>
          </div>

          <div className="space-y-8">
            {profileQuestions.map((question) => (
              <div key={question.key}>
                <h3 className="text-lg font-semibold text-darkpurple mb-2">
                  {question.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {question.subtitle}
                </p>
                <textarea
                  name={question.key}
                  value={formData[question.key as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={question.placeholder}
                  maxLength={question.maxLength}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors resize-vertical"
                />
                <div className="flex justify-end mt-2">
                  <p className="text-sm text-gray-500">
                    {(formData[question.key as keyof typeof formData] || '').length}/{question.maxLength}
                  </p>
                </div>
              </div>
            ))}

            {/* Additional Tips */}
            <div className="bg-blue p-6 rounded-lg mt-8">
              <h4 className="font-semibold text-darkpurple mb-3">💡 Tips for a Great Profile:</h4>
              <ul className="text-darkpurple text-sm space-y-2">
                <li>• <strong>Be specific:</strong> Include actual results, grade improvements, and number of students taught</li>
                <li>• <strong>Show personality:</strong> Describe your teaching style and what makes you unique</li>
                <li>• <strong>Highlight achievements:</strong> Academic awards, certifications, or special recognition</li>
                <li>• <strong>Be honest:</strong> Authentic profiles build trust with parents and students</li>
                <li>• <strong>Use examples:</strong> Concrete examples are more compelling than general statements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;