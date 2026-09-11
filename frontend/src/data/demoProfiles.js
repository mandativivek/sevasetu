// All profiles are 100% synthetic - for demo purposes only.
export const demoProfiles = [
  {
    label: "Student",
    profile: {
      age: 20, state: "Telangana", district: "Hyderabad", occupation: "Student",
      student: true, annual_income: 180000, family_size: 4, farmer: false,
      employment_status: "unemployed", disability: false, senior_citizen: false,
      woman_headed_household: false, existing_benefits: [],
    },
  },
  {
    label: "Farmer",
    profile: {
      age: 42, state: "Telangana", district: "Warangal", occupation: "Farmer",
      student: false, annual_income: 220000, family_size: 5, farmer: true,
      employment_status: "self_employed", disability: false, senior_citizen: false,
      woman_headed_household: false, existing_benefits: [],
    },
  },
  {
    label: "Senior Citizen",
    profile: {
      age: 68, state: "Telangana", district: "Nizamabad", occupation: "Retired",
      student: false, annual_income: 90000, family_size: 2, farmer: false,
      employment_status: "retired", disability: false, senior_citizen: true,
      woman_headed_household: false, existing_benefits: [],
    },
  },
  {
    label: "Unemployed Person",
    profile: {
      age: 27, state: "Telangana", district: "Khammam", occupation: "Job Seeker",
      student: false, annual_income: 60000, family_size: 3, farmer: false,
      employment_status: "unemployed", disability: false, senior_citizen: false,
      woman_headed_household: false, existing_benefits: [],
    },
  },
  {
    label: "Low-Income Family",
    profile: {
      age: 35, state: "Telangana", district: "Nalgonda", occupation: "Daily Wage Worker",
      student: false, annual_income: 120000, family_size: 6, farmer: false,
      employment_status: "unemployed", disability: false, senior_citizen: false,
      woman_headed_household: true, existing_benefits: [],
    },
  },
]
