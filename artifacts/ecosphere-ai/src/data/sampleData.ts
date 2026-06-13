export const sampleData = {
  user: {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    initials: "AR",
    score: 73,
    joined: "Jan 2024",
    location: "San Francisco, CA",
    rank: 42,
    totalUsers: 10482
  },
  carbonData: [
    { week: "Week 1", value: 14.5, average: 15.0 },
    { week: "Week 2", value: 13.8, average: 15.0 },
    { week: "Week 3", value: 13.2, average: 15.0 },
    { week: "Week 4", value: 12.5, average: 15.0 },
    { week: "Week 5", value: 14.0, average: 15.0 },
    { week: "Week 6", value: 11.8, average: 15.0 },
    { week: "Week 7", value: 10.5, average: 15.0 },
    { week: "Week 8", value: 9.8, average: 15.0 },
  ],
  categoryBreakdown: [
    { name: "Transport", value: 45 },
    { name: "Home Energy", value: 30 },
    { name: "Food", value: 15 },
    { name: "Shopping", value: 10 }
  ],
  waterData: [
    { day: "Mon", usage: 120 },
    { day: "Tue", usage: 130 },
    { day: "Wed", usage: 110 },
    { day: "Thu", usage: 140 },
    { day: "Fri", usage: 100 },
    { day: "Sat", usage: 160 },
    { day: "Sun", usage: 150 },
  ],
  energyData: [
    { month: "Jan", grid: 400, solar: 150 },
    { month: "Feb", grid: 380, solar: 180 },
    { month: "Mar", grid: 350, solar: 220 },
    { month: "Apr", grid: 300, solar: 280 },
  ],
  leaderboard: [
    { id: 1, name: "Sarah Jenkins", score: 98, rank: 1, initials: "SJ" },
    { id: 2, name: "Marcus Chen", score: 95, rank: 2, initials: "MC" },
    { id: 3, name: "Priya Patel", score: 92, rank: 3, initials: "PP" },
    { id: 4, name: "Elena Rodriguez", score: 89, rank: 4, initials: "ER" },
    { id: 5, name: "David Kim", score: 88, rank: 5, initials: "DK" },
    { id: 6, name: "Alex Rivera", score: 73, rank: 42, initials: "AR", isCurrentUser: true },
  ],
  challenges: [
    { id: 1, title: "Meatless Monday", category: "Food", impact: "Saves 12kg CO2", difficulty: "Easy", progress: 100, status: "Completed", xp: 50 },
    { id: 2, title: "Bike to Work", category: "Transport", impact: "Saves 25kg CO2", difficulty: "Medium", progress: 60, status: "Ongoing", xp: 150 },
    { id: 3, title: "Zero Waste Week", category: "Home", impact: "Saves 8kg CO2", difficulty: "Hard", progress: 0, status: "Join", xp: 300 },
    { id: 4, title: "Cold Water Wash", category: "Home", impact: "Saves 5kg CO2", difficulty: "Easy", progress: 100, status: "Completed", xp: 50 },
    { id: 5, title: "No Plastic Bottles", category: "Shopping", impact: "Saves 15kg CO2", difficulty: "Medium", progress: 40, status: "Ongoing", xp: 100 },
  ],
  badges: [
    { id: 1, name: "First Step", icon: "footprints", earned: true },
    { id: 2, name: "Carbon Saver", icon: "leaf", earned: true },
    { id: 3, name: "Water Guardian", icon: "droplet", earned: true },
    { id: 4, name: "Solar Champion", icon: "sun", earned: false },
    { id: 5, name: "Recycler", icon: "recycle", earned: true },
    { id: 6, name: "Zero Waste", icon: "trash", earned: false },
  ],
  activities: [
    { id: 1, action: "Logged a meatless meal", time: "2 hours ago", points: "+15" },
    { id: 2, action: "Completed 'Cold Water Wash' challenge", time: "1 day ago", points: "+50" },
    { id: 3, action: "Reduced weekly energy by 5%", time: "3 days ago", points: "+100" },
    { id: 4, action: "Added new solar panels to profile", time: "1 week ago", points: "+500" },
  ],
  chatMessages: [
    { id: 1, sender: "ai", text: "Hello Alex! I noticed your carbon footprint dropped by 12% this week. Great job! How can I help you be more sustainable today?" },
    { id: 2, sender: "user", text: "I'm thinking about changing my diet to reduce my footprint. Any tips?" },
    { id: 3, sender: "ai", text: "Switching to a plant-based diet can reduce your food-related carbon footprint by up to 73%. Even starting with 'Meatless Mondays' can save about 100kg of CO2 per year. Would you like some easy recipe suggestions?" },
    { id: 4, sender: "user", text: "Yes, some easy dinner recipes would be great." },
    { id: 5, sender: "ai", text: "Here are three quick, low-carbon recipes:\n\n1. Lentil and Veggie Curry (Carbon score: Very Low)\n2. Chickpea Tacos (Carbon score: Low)\n3. Mushroom Stir-fry (Carbon score: Low)\n\nI can add the ingredients to your shopping list if you'd like!" },
  ]
};
