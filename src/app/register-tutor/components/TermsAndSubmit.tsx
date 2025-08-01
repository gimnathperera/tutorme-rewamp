"use client";
import { useState } from "react";

const TermsAndSubmit = () => {
  const [formData, setFormData] = useState({
    terms1: false,
    terms2: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Here you would make your API call
      console.log('Submitting form...', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - you might want to redirect or show success message
      alert('Registration submitted successfully!');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div>
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">5</span>
            Agreement & Submit
          </h2>

          <div className="space-y-6">
            {/* Agreement Checkboxes */}
            <div className="space-y-4">
              {/* Terms Agreement */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms1}
                    onChange={() => handleCheckboxChange('terms1')}
                    className="mt-1 mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <div>
                    <span className="font-medium text-darkpurple">
                      * I AGREE TO TERMS AND CONDITIONS (Required) *
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      I agree to receiving assignment information via SMS and understand that rates are subject to negotiation. 
                      I understand there may be admin fees involved for successful assignments.
                    </p>
                  </div>
                </label>
              </div>

              {/* Marketing Agreement */}
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.terms2}
                    onChange={() => handleCheckboxChange('terms2')}
                    className="mt-1 mr-3 text-primary-700 focus:ring-primary-700 rounded"
                  />
                  <div>
                    <span className="font-medium text-darkpurple">
                      * I AGREE TO RECEIVING ASSIGNMENT INFORMATION REGARDING NEW TUITION ASSIGNMENTS
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      By checking this box, you agree to receive SMS and email notifications about new tutoring assignments 
                      that match your preferences.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* CAPTCHA Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-darkpurple mb-3">CAPTCHA</h3>
              <div className="flex items-center space-x-4">
                <div className="bg-lightblue border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[80px] flex items-center justify-center">
                  <span className="text-gray-500">reCAPTCHA placeholder</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please complete the reCAPTCHA verification to proceed with registration.
              </p>
            </div>

            {/* Additional Information */}
            <div className="bg-lightblue border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-darkpurple mb-2">📋 Important Information:</h4>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• By clicking accepting our Terms and Conditions, you are requested to Tutor Fee Commission of Tutor's first lesson fee following successful acceptance and assignment which must be paid within 7 days through online banking.</li>
                <li>• All tutor information provided will remain strictly confidential</li>
                <li>• You will receive assignment notifications via SMS and email</li>
                <li>• Rates are subject to negotiation between tutor and client</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`text-sm md:text-xl font-semibold hover:shadow-xl py-3 px-6 md:py-5 md:px-14 rounded-full transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-primary-700 text-white hover:opacity-90 transform hover:-translate-y-1'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'SUBMIT'
                )}
              </button>
            </div>

            {/* Footer Note */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Thank you for joining our tutoring community! 🎓</p>
              <p>We'll review your application and get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndSubmit;