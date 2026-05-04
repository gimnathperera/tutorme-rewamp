import type { Option } from "@/types/shared-types";

export type SelectOption = {
  value: string;
  text: string;
};

export type NumberOption = {
  label: string;
  value: number;
};

export const GENDER_OPTIONS: SelectOption[] = [
  { value: "Male", text: "Male" },
  { value: "Female", text: "Female" },
];

export const GENDER_VALUES: readonly string[] = ["Male", "Female", "Others"];

export const NATIONALITY_OPTIONS: SelectOption[] = [
  { value: "Sri Lankan", text: "Sri Lankan" },
  { value: "Others", text: "Others" },
];

export const NATIONALITY_VALUES: readonly string[] = NATIONALITY_OPTIONS.map(
  ({ value }) => value,
);

export const RACE_OPTIONS: SelectOption[] = [
  { value: "Sinhalese", text: "Sinhalese" },
  { value: "Tamil", text: "Tamil" },
  { value: "Muslim", text: "Muslim" },
  { value: "Burgher", text: "Burgher" },
  { value: "Others", text: "Others" },
];

export const RACE_VALUES: readonly string[] = RACE_OPTIONS.map(
  ({ value }) => value,
);

export const TUTORING_LEVEL_OPTIONS: SelectOption[] = [
  {
    value: "Pre-School / Montessori",
    text: "Pre-School / Montessori",
  },
  {
    value: "Primary School (Grades 1-5)",
    text: "Primary School (Grades 1-5)",
  },
  {
    value: "Ordinary Level (O/L) (Grades 6-11)",
    text: "Ordinary Level (O/L) (Grades 6-11)",
  },
  {
    value: "Advanced Level (A/L) (Grades 12-13)",
    text: "Advanced Level (A/L) (Grades 12-13)",
  },
  {
    value: "International Syllabus (Cambridge, Edexcel, IB)",
    text: "International Syllabus (Cambridge, Edexcel, IB)",
  },
  { value: "Undergraduate", text: "Undergraduate" },
  { value: "Diploma / Degree", text: "Diploma / Degree" },
  {
    value: "Language (e.g., English, French, Japanese)",
    text: "Language (e.g., English, French, Japanese)",
  },
  {
    value: "Computing (e.g., Programming, Graphic Design)",
    text: "Computing (e.g., Programming, Graphic Design)",
  },
  { value: "Music & Arts", text: "Music & Arts" },
  { value: "Special Skills", text: "Special Skills" },
];

export const TUTORING_LEVELS = TUTORING_LEVEL_OPTIONS.map(({ value }) => value);

export const CLASS_TYPE_OPTIONS: SelectOption[] = [
  { value: "Online - Individual", text: "Online - Individual" },
  { value: "Online - Group", text: "Online - Group" },
  { value: "Physical - Individual", text: "Physical - Individual" },
  { value: "Physical - Group", text: "Physical - Group" },
];

export const CLASS_TYPE_VALUES: readonly string[] = CLASS_TYPE_OPTIONS.map(
  ({ value }) => value,
);

export const PHYSICAL_CLASS_TYPE_VALUES = [
  "Physical - Individual",
  "Physical - Group",
] as const;

export const isPhysicalClassType = (value: string) =>
  PHYSICAL_CLASS_TYPE_VALUES.includes(
    value as (typeof PHYSICAL_CLASS_TYPE_VALUES)[number],
  );

export const PREFERRED_LOCATION_OPTIONS: SelectOption[] = [
  {
    value: "Kollupitiya (Colombo 3)",
    text: "Kollupitiya (Colombo 3)",
  },
  {
    value: "Bambalapitiya (Colombo 4)",
    text: "Bambalapitiya (Colombo 4)",
  },
  {
    value: "Havelock Town (Colombo 5)",
    text: "Havelock Town (Colombo 5)",
  },
  {
    value: "Wellawatte (Colombo 6)",
    text: "Wellawatte (Colombo 6)",
  },
  {
    value: "Cinnamon Gardens (Colombo 7)",
    text: "Cinnamon Gardens (Colombo 7)",
  },
  { value: "Borella (Colombo 8)", text: "Borella (Colombo 8)" },
  { value: "Dehiwala", text: "Dehiwala" },
  { value: "Mount Lavinia", text: "Mount Lavinia" },
  { value: "Nugegoda", text: "Nugegoda" },
  { value: "Rajagiriya", text: "Rajagiriya" },
  { value: "Kotte", text: "Kotte" },
  { value: "Battaramulla", text: "Battaramulla" },
  { value: "Malabe", text: "Malabe" },
  { value: "Moratuwa", text: "Moratuwa" },
  { value: "Gampaha", text: "Gampaha" },
  { value: "Negombo", text: "Negombo" },
  { value: "Kadawatha", text: "Kadawatha" },
  { value: "Kiribathgoda", text: "Kiribathgoda" },
  { value: "Kelaniya", text: "Kelaniya" },
  { value: "Wattala", text: "Wattala" },
  { value: "Ja-Ela", text: "Ja-Ela" },
  { value: "Kalutara", text: "Kalutara" },
  { value: "Panadura", text: "Panadura" },
  { value: "Horana", text: "Horana" },
  { value: "Wadduwa", text: "Wadduwa" },
  { value: "Kandy", text: "Kandy" },
  { value: "Matale", text: "Matale" },
  { value: "Nuwara Eliya", text: "Nuwara Eliya" },
  { value: "Galle", text: "Galle" },
  { value: "Matara", text: "Matara" },
  { value: "Hambantota", text: "Hambantota" },
  { value: "Kurunegala", text: "Kurunegala" },
  { value: "Puttalam", text: "Puttalam" },
  { value: "Chilaw", text: "Chilaw" },
  { value: "Ratnapura", text: "Ratnapura" },
  { value: "Kegalle", text: "Kegalle" },
  { value: "Badulla", text: "Badulla" },
  { value: "Bandarawela", text: "Bandarawela" },
  { value: "Anuradhapura", text: "Anuradhapura" },
  { value: "Polonnaruwa", text: "Polonnaruwa" },
  { value: "Jaffna", text: "Jaffna" },
  { value: "Vavuniya", text: "Vavuniya" },
  { value: "Trincomalee", text: "Trincomalee" },
  { value: "Batticaloa", text: "Batticaloa" },
  { value: "No Preference", text: "No Preference" },
];

export const TUTOR_TYPE_OPTIONS: SelectOption[] = [
  { value: "International School Teacher", text: "International School Teacher"},
  { value: "Government School Teacher", text: "Government School Teacher" },
  { value: "University Student", text: "University Student" },
  { value: "A/L Student", text: "A/L Student" },
  { value: "Diploma Holder", text: "Diploma Holder" },
  { value: "Part-time Tutor", text: "Part-time Tutor" },
  { value: "Full-time Tutor", text: "Full-time Tutor" },
];

export const REGISTER_HIGHEST_EDUCATION_OPTIONS: SelectOption[] = [
  { value: "PhD", text: "PhD" },
  { value: "Masters", text: "Master's Degree" },
  { value: "Bachelor Degree", text: "Bachelor's Degree" },
  { value: "Undergraduate", text: "Undergraduate" },
  {
    value: "Diploma and Professional",
    text: "Diploma and Professional",
  },
  { value: "AL", text: "Advanced Level (A/L)" },
];

export const REGISTER_HIGHEST_EDUCATION_VALUES: readonly string[] =
  REGISTER_HIGHEST_EDUCATION_OPTIONS.map(({ value }) => value);

export const HIGHEST_EDUCATION_LEVELS: SelectOption[] = [
  { value: "PhD", text: "PhD" },
  { value: "Diploma", text: "Diploma" },
  { value: "Masters", text: "Masters" },
  { value: "Undergraduate", text: "Undergraduate" },
  { value: "Bachelor Degree", text: "Bachelor Degree" },
  {
    value: "Diploma and Professional",
    text: "Diploma and Professional",
  },
  { value: "JC/A Levels", text: "JC/A Levels" },
  { value: "Poly", text: "Poly" },
  { value: "Others", text: "Others" },
];

export const MEDIUM_OPTIONS: SelectOption[] = [
  { value: "Sinhala", text: "Sinhala" },
  { value: "English", text: "English" },
  { value: "Tamil", text: "Tamil" },
];

export const MEDIUM_VALUES: readonly string[] = MEDIUM_OPTIONS.map(
  ({ value }) => value,
);

export const FIND_TUTOR_TYPE_OPTIONS: Option[] = [
  { label: "Part Time Tutors", value: "part-time" },
  { label: "Full Time Tutors", value: "full-time" },
  {
    label: "Ex / Current Government School Tutors",
    value: "gov",
  },
];

export const FIND_TUTOR_GENDER_PREFERENCE_OPTIONS: Option[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const FIND_TUTOR_GENDER_PREFERENCE_VALUES: readonly string[] = [
  "Male",
  "Female",
  "None",
];

export const YES_NO_OPTIONS: Option[] = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const YES_NO_VALUES: readonly string[] = YES_NO_OPTIONS.map(
  ({ value }) => value,
);

export const FIND_TUTOR_DURATION_OPTIONS: Option[] = [
  { value: "30_min", label: "30 minutes" },
  { value: "1_hour", label: "1 hour" },
  { value: "2_hour", label: "2 hours" },
];

export const FIND_TUTOR_FREQUENCY_OPTIONS: Option[] = [
  { value: "1_week", label: "Once a week" },
  { value: "2_week", label: "Twice a week" },
  { value: "daily", label: "Daily" },
];

export const FIND_TUTOR_COUNT_OPTIONS: NumberOption[] = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
];

export const REQUEST_TUTOR_DURATION_OPTIONS: SelectOption[] = [
  { value: "30 Minutes", text: "30 Minutes" },
  { value: "One Hour", text: "1 Hour" },
  { value: "Two Hours", text: "2 Hours" },
];

export const REQUEST_TUTOR_FREQUENCY_OPTIONS: SelectOption[] = [
  { value: "Once a Week", text: "Once a Week" },
  { value: "Twice a Week", text: "Twice a Week" },
  { value: "Daily", text: "Daily" },
];

export const DOCUMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "NIC", text: "NIC (National ID Card)" },
  { value: "Passport", text: "Passport" },
  { value: "Driving License", text: "Driving License" },
  { value: "Educational Certificate", text: "Educational Certificate" },
  { value: "Degree Certificate", text: "Degree Certificate" },
  { value: "Diploma Certificate", text: "Diploma Certificate" },
  { value: "Professional Certificate", text: "Professional Certificate" },
  { value: "Teaching Certificate", text: "Teaching Certificate" },
  { value: "Police Clearance", text: "Police Clearance Report" },
  { value: "Other", text: "Other" },
];

export const WEEK_DAY_VALUES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEK_DAY_OPTIONS: Option[] = [
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
  { label: "Sun", value: "Sunday" },
];

export const AL_STREAM_ORDER = [
  "physical science",
  "biological science",
  "commerce",
  "technology",
  "art",
];

export const ALL_GRADES_FILTER_OPTION: Option = {
  label: "All Grades",
  value: "all",
};

export const BLOG_STATUS_VALUES = ["pending", "approved", "rejected"] as const;

export type BlogStatus = (typeof BLOG_STATUS_VALUES)[number];

export const BLOG_MODERATION_STATUS_VALUES = ["approved", "rejected"] as const;

export type BlogModerationStatus =
  (typeof BLOG_MODERATION_STATUS_VALUES)[number];

export const BLOG_EDITOR_HEADING_OPTIONS = [
  { value: 1, text: "H1" },
  { value: 2, text: "H2" },
  { value: 3, text: "H3" },
  { value: 4, text: "H4" },
  { value: 5, text: "H5" },
  { value: 6, text: "H6" },
];

export const BLOG_EDITOR_LIST_STYLE_OPTIONS = [
  { value: "unordered", text: "Bullets" },
  { value: "ordered", text: "Numbered" },
] as const;

export const BLOG_EDITOR_LIST_STYLE_VALUES = ["ordered", "unordered"] as const;

export const PROFILE_LANGUAGE_OPTIONS: Option[] = [
  { value: "sinhala", label: "Sinhala" },
  { value: "english", label: "English" },
  { value: "tamil", label: "Tamil" },
];

export const PROFILE_TIME_ZONE_OPTIONS: Option[] = [
  { value: "UTC-5", label: "Eastern Time (US & Canada)" },
  { value: "UTC+1", label: "Central European Time" },
  { value: "UTC+9", label: "Japan Standard Time" },
  { value: "UTC+5:30", label: "Sri Lanka Standard Time" },
];

export const PROFILE_RATE_OPTIONS: Option[] = [
  { value: "Rs. 500 - 1,000", label: "Rs. 500 - 1,000 per hour" },
  { value: "Rs. 1,000 - 1,500", label: "Rs. 1,000 - 1,500 per hour" },
  { value: "Rs. 1,500 - 2,000", label: "Rs. 1,500 - 2,000 per hour" },
  { value: "Rs. 2,000 - 2,500", label: "Rs. 2,000 - 2,500 per hour" },
  { value: "Rs. 2,500 - 3,000", label: "Rs. 2,500 - 3,000 per hour" },
  { value: "Rs. 3,000 - 4,000", label: "Rs. 3,000 - 4,000 per hour" },
  { value: "Rs. 4,000 - 5,000", label: "Rs. 4,000 - 5,000 per hour" },
  { value: "Rs. 5,000+", label: "Rs. 5,000+ per hour" },
];

export const PROFILE_COUNTRY_OPTIONS: Option[] = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Brazil", value: "BR" },
  { label: "Brunei", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo (Congo-Brazzaville)", value: "CG" },
  { label: "Costa Rica", value: "CR" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Democratic Republic of the Congo", value: "CD" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Eswatini", value: "SZ" },
  { label: "Ethiopia", value: "ET" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Greece", value: "GR" },
  { label: "Grenada", value: "GD" },
  { label: "Guatemala", value: "GT" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Honduras", value: "HN" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Israel", value: "IL" },
  { label: "Italy", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Laos", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia", value: "FM" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Morocco", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "North Korea", value: "KP" },
  { label: "North Macedonia", value: "MK" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Qatar", value: "QA" },
  { label: "Romania", value: "RO" },
  { label: "Russia", value: "RU" },
  { label: "Rwanda", value: "RW" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome and Principe", value: "ST" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Solomon Islands", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "South Africa", value: "ZA" },
  { label: "South Korea", value: "KR" },
  { label: "South Sudan", value: "SS" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Suriname", value: "SR" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Syria", value: "SY" },
  { label: "Taiwan", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania", value: "TZ" },
  { label: "Thailand", value: "TH" },
  { label: "Timor-Leste", value: "TL" },
  { label: "Togo", value: "TG" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Turkey", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Vatican City", value: "VA" },
  { label: "Venezuela", value: "VE" },
  { label: "Vietnam", value: "VN" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
];

export const LOCATIONS_BY_REGION = {
  "Western Province": [
    "Kollupitiya (Colombo 3)",
    "Bambalapitiya (Colombo 4)",
    "Havelock Town (Colombo 5)",
    "Wellawatte (Colombo 6)",
    "Cinnamon Gardens (Colombo 7)",
    "Borella (Colombo 8)",
    "Dehiwala",
    "Mount Lavinia",
    "Nugegoda",
    "Rajagiriya",
    "Kotte",
    "Battaramulla",
    "Malabe",
    "Moratuwa",
    "Gampaha",
    "Negombo",
    "Kadawatha",
    "Kiribathgoda",
    "Kelaniya",
    "Wattala",
    "Ja-Ela",
    "Kalutara",
    "Panadura",
    "Horana",
    "Wadduwa",
  ],
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Southern Province": ["Galle", "Matara", "Hambantota"],
  "North Western Province": ["Kurunegala", "Puttalam", "Chilaw"],
  "Sabaragamauwa Province": ["Ratnapura", "Kegalle"],
  "Uva Province": ["Badulla", "Bandarawela"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "Northern Province": ["Jaffna", "Vavuniya"],
  "Eastern Province": ["Trincomalee", "Batticaloa"],
};
