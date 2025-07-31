"use client";

interface TutorProfileProps {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  errors: any;
  updateErrors: (section: string, errors: any) => void;
}

export default function TutorProfile({ formData, updateFormData, errors, updateErrors }: TutorProfileProps) {
  
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
    updateFormData('profile', { [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      updateErrors('profile', { ...errors, [name]: '' });
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    if (!value.trim()) {
      error = 'This field is required';
    } else if (value.length < 50) {
      error = 'Please provide at least 50 characters for a meaningful response';
    }
    
    updateErrors('profile', { ...errors, [name]: error });
  };

  return (
    <section className="border-b border-gray-200 pb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">4</span>
        Tutor's Profile (Extremely Important!)
      </h2>

      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
        <p className="text-orange-800 font-medium">
          <strong>Important:</strong> The following section will be a key factor in your success rate of assignment matching.
        </p>
        <p className="text-orange-700 text-sm mt-1">
          For parents who wish to view immediate info for their students before making assignments which will be shown to our clients.
        </p>
        <p className="text-orange-700 text-sm mt-1">
          For each section please using approximately from 50 to application. <strong>Excellent answer required</strong>
        </p>
      </div>

      <div className="space-y-8">
        {profileQuestions.map((question) => (
          <div key={question.key}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {question.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {question.subtitle}
            </p>
            <textarea
              name={question.key}
              value={formData[question.key] || ''}
              onChange={handleChange}
              onBlur={(e) => validateField(question.key, e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-vertical ${
                errors[question.key] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <div>
                {errors[question.key] && (
                  <p className="text-red-500 text-sm">{errors[question.key]}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {(formData[question.key] || '').length}/{question.maxLength}
              </p>
            </div>
          </div>
        ))}

        {/* Additional Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h4 className="font-semibold text-blue-800 mb-3">💡 Tips for a Great Profile:</h4>
          <ul className="text-blue-700 text-sm space-y-2">
            <li>• <strong>Be specific:</strong> Include actual results, grade improvements, and number of students taught</li>
            <li>• <strong>Show personality:</strong> Describe your teaching style and what makes you unique</li>
            <li>• <strong>Highlight achievements:</strong> Academic awards, certifications, or special recognition</li>
            <li>• <strong>Be honest:</strong> Authentic profiles build trust with parents and students</li>
            <li>• <strong>Use examples:</strong> Concrete examples are more compelling than general statements</li>
          </ul>
        </div>
      </div>
    </section>
  );
}