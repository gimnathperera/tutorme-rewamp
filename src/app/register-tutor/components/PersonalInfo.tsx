"use client";
import { useState } from "react";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
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
    nricLast4: ""
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'Full name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'contact':
      case 'reContact':
        if (!value.trim()) error = 'Contact number is required';
        else if (!/^\d{8}$/.test(value.replace(/\s/g, ''))) error = 'Enter valid 8-digit contact number';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Enter valid email address';
        break;
      case 'dob':
      case 'reDob':
        if (!value) error = 'Date of birth is required';
        break;
      case 'age':
        if (!value) error = 'Age is required';
        else if (parseInt(value) < 16 || parseInt(value) > 80) error = 'Age must be between 16-80';
        break;
      case 'nricLast4':
        if (!value.trim()) error = 'Last 4 digits of NRIC is required';
        else if (!/^\d{4}$/.test(value)) error = 'Enter exactly 4 digits';
        break;
    }
    
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="mx-auto max-w-7xl my-10 px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-bold text-darkpurple mb-6 flex items-center">
            <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">1</span>
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Full Name (As Per NRIC) *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={(e) => validateField('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                onBlur={(e) => validateField('contact', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.contact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="91234567"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Re-Enter Contact Number */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Re-Enter Contact Number *
              </label>
              <input
                type="tel"
                name="reContact"
                value={formData.reContact}
                onChange={handleChange}
                onBlur={(e) => validateField('reContact', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.reContact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="91234567"
              />
              {errors.reContact && <p className="text-red-500 text-sm mt-1">{errors.reContact}</p>}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={(e) => validateField('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onBlur={(e) => validateField('dob', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>

            {/* Re-Enter Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Re-Enter Date of Birth *
              </label>
              <input
                type="date"
                name="reDob"
                value={formData.reDob}
                onChange={handleChange}
                onBlur={(e) => validateField('reDob', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.reDob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.reDob && <p className="text-red-500 text-sm mt-1">{errors.reDob}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Gender *
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === 'MALE'}
                    onChange={handleChange}
                    className="mr-2 text-primary-700 focus:ring-primary-700"
                  />
                  MALE
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === 'FEMALE'}
                    onChange={handleChange}
                    className="mr-2 text-primary-700 focus:ring-primary-700"
                  />
                  FEMALE
                </label>
              </div>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={(e) => validateField('age', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="25"
                min="16"
                max="80"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Nationality *
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nationality"
                    value="SINGAPOREAN"
                    checked={formData.nationality === 'SINGAPOREAN'}
                    onChange={handleChange}
                    className="mr-2 text-primary-700 focus:ring-primary-700"
                  />
                  SINGAPOREAN
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nationality"
                    value="SINGAPORE PR"
                    checked={formData.nationality === 'SINGAPORE PR'}
                    onChange={handleChange}
                    className="mr-2 text-primary-700 focus:ring-primary-700"
                  />
                  SINGAPORE PR
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nationality"
                    value="OTHERS"
                    checked={formData.nationality === 'OTHERS'}
                    onChange={handleChange}
                    className="mr-2 text-primary-700 focus:ring-primary-700"
                  />
                  OTHERS
                </label>
              </div>
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
            </div>

            {/* Race */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Race *
              </label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['CHINESE', 'MALAY', 'INDIAN', 'EURASIAN', 'CAUCASIAN', 'PUNJABI', 'OTHERS'].map((race) => (
                  <label key={race} className="flex items-center">
                    <input
                      type="radio"
                      name="race"
                      value={race}
                      checked={formData.race === race}
                      onChange={handleChange}
                      className="mr-2 text-primary-700 focus:ring-primary-700"
                    />
                    {race}
                  </label>
                ))}
              </div>
              {errors.race && <p className="text-red-500 text-sm mt-1">{errors.race}</p>}
            </div>

            {/* Last 4 Digits of NRIC */}
            <div>
              <label className="block text-sm font-medium text-darkpurple mb-2">
                Last 4 Digits of NRIC *
              </label>
              <input
                type="text"
                name="nricLast4"
                value={formData.nricLast4}
                onChange={handleChange}
                onBlur={(e) => validateField('nricLast4', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition-colors ${
                  errors.nricLast4 ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1234"
                maxLength={4}
              />
              {errors.nricLast4 && <p className="text-red-500 text-sm mt-1">{errors.nricLast4}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Your identity is protected! This information is securely stored and not displayed on clients. *For Tax / Admin purpose only 🔒🔒
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;