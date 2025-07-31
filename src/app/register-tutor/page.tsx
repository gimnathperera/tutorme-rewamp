"use client";
import { useState } from "react";
import PersonalInfo from "./components/PersonalInfo";
import TutoringPreferences from "./components/TutoringPreferences";
import AcademicExperience from "./components/AcademicExperience";
import TutorProfile from "./components/TutorProfile";
import TermsAndSubmit from "./components/TermsAndSubmit";

export default function RegisterTutorPage() {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    contact: "",
    reContact: "",
    email: "",
    dob: "",
    reDob: "",
    gender: "",
    age: "",
    nationality: "",
    race: "",
    nricLast4: "",
    
    // Tutoring Preferences
    levels: [],
    subjects: [],
    locations: [],
    noPreference: false,
    
    // Academic Experience
    tutorType: "",
    yearsExperience: "",
    educationLevel: "",
    
    // Profile
    introduction: "",
    experience: "",
    results: "",
    sellingPoints: "",
    
    // Terms
    terms1: false,
    terms2: false,
    captcha: ""
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateErrors = (section: string, sectionErrors: any) => {
    setErrors(prev => ({ ...prev, [section]: sectionErrors }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all sections
    let hasErrors = false;
    
    // Add your submission logic here
    if (!hasErrors) {
      console.log("Form submitted:", formData);
      // Submit to API
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Register As A Tutor</h1>
          <p className="text-orange-100 text-lg">
            Fill up this following form for EASY candidate assignments directly via SMS!
          </p>
          <p className="text-orange-100">
            100% Available Assignments Weekly! 😊
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              (You may also join our Telegram Group for fast listing & new updated assignments)
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              Join Our Telegram Group
            </button>
            <p className="text-sm text-gray-500 mt-2">(Highly recommended to install!)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <PersonalInfo 
              formData={formData} 
              updateFormData={updateFormData}
              errors={errors.personal || {}}
              updateErrors={updateErrors}
            />
            
            <TutoringPreferences 
              formData={formData} 
              updateFormData={updateFormData}
              errors={errors.preferences || {}}
              updateErrors={updateErrors}
            />
            
            <AcademicExperience 
              formData={formData} 
              updateFormData={updateFormData}
              errors={errors.academic || {}}
              updateErrors={updateErrors}
            />
            
            <TutorProfile 
              formData={formData} 
              updateFormData={updateFormData}
              errors={errors.profile || {}}
              updateErrors={updateErrors}
            />
            
            <TermsAndSubmit 
              formData={formData} 
              updateFormData={updateFormData}
              errors={errors.terms || {}}
              updateErrors={updateErrors}
            />
          </form>
        </div>
      </div>
    </div>
  );
}