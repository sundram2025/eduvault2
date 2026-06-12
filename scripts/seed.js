// scripts/seed.js
// Run once to seed your initial courses and admin user
// Usage: node scripts/seed.js

// NOTE: This is a reference script — run it from your local environment
// after setting up Firebase credentials

const COURSES = [
  {
    title: "LOW COST MARKETING AMPLIFIER - GWR",
    teacher: "Dr. Vivek Bindra",
    description: "Learn powerful low-cost marketing strategies from India's leading business coach Dr. Vivek Bindra. This course covers growth hacking, digital marketing, and business amplification techniques that work even with a small budget.",
    category: "Marketing/Business",
    thumbnailUrl: "", // Upload manually or paste URL
    lectures: [
      {
        id: "lcma-01",
        title: "Introduction to Low Cost Marketing",
        driveUrl: "https://drive.google.com/drive/folders/15a6yNZdbI2vKQYxKUmh_coLjr3zvXcrB",
        duration: "",
        description: "Course overview and marketing fundamentals"
      }
    ],
    plans: [
      { id: "3months", label: "3 Months Access", price: 99, duration: "3months" },
      { id: "12months", label: "12 Months Access", price: 149, duration: "12months" },
      { id: "lifetime", label: "Lifetime Access", price: 199, duration: "lifetime" }
    ],
    enrollments: 0,
  },
  {
    title: "AI MASTERY FULL COURSE",
    teacher: "AI Experts",
    description: "Complete AI course covering ChatGPT, AI Prompting, Smart Productivity, Content Creation, and AI Tricks & Workflows. Master the most powerful AI tools step by step.",
    category: "AI/Technology",
    thumbnailUrl: "", // Upload manually or paste URL
    lectures: [
      {
        id: "ai-01",
        title: "Complete AI Course Materials",
        driveUrl: "https://drive.google.com/drive/folders/1-sGCCn_GtDcPhe54URNxj7RbmRucd3ex",
        duration: "",
        description: "Full course: ChatGPT, AI Prompting, Smart Productivity, Content Creation, AI Tricks & Workflows"
      }
    ],
    plans: [
      { id: "3months", label: "3 Months Access", price: 99, duration: "3months" },
      { id: "12months", label: "12 Months Access", price: 149, duration: "12months" },
      { id: "lifetime", label: "Lifetime Access", price: 199, duration: "lifetime" }
    ],
    enrollments: 0,
  }
];

console.log("=== SEED DATA REFERENCE ===");
console.log("\nCopy the courses data above and add via Admin Dashboard → Add Course");
console.log("\nOr use the Firebase Console to manually add documents to the 'courses' collection.");
console.log("\nCourse data to seed:");
console.log(JSON.stringify(COURSES, null, 2));

console.log("\n=== ADMIN SETUP ===");
console.log("1. Register normally at /auth/signup");
console.log("2. Go to Firebase Console → Firestore → users → [your user document]");
console.log("3. Change the 'role' field from 'student' to 'admin'");
console.log("4. Login at /auth/admin-login");
