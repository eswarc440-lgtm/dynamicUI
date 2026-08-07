const fs = require('fs');

async function test() {
  const prompt = `A modern, visually appealing mobile app UI for a Daily Reminder application where users can easily create, manage, and receive reminders. The interface should be clean, minimal, and intuitive with a premium look inspired by Apple's Human Interface Guidelines and Google's Material Design 3. Theme Soft blue, purple, and white color palette Rounded corners (16–24px) Glassmorphism accents with subtle shadows Smooth gradients Modern typography (Inter, SF Pro, or Poppins) Light and Dark mode Main Screen Welcome header with user's name Today's date Search bar "Today's Reminders" section with reminder cards Cards displaying: Reminder title Time Category icon Repeat badge Toggle switch for enable/disable Floating "+" button to create a reminder Bottom navigation: Home, Calendar, Add, Notifications, Profile Create Reminder Screen Large page title: "New Reminder" Reminder title input Description textarea Date picker Time picker Repeat options: Once Daily Weekdays Weekly Monthly Custom Category chips: Work Personal Health Study Fitness Shopping Priority selector: Low Medium High Notification sound selector Snooze duration Save Reminder button Calendar Screen Monthly calendar Highlighted reminder dates Timeline of reminders for the selected day Notifications Screen Upcoming reminders Missed reminders Completed reminders Profile Screen User avatar Reminder statistics Notification settings Dark mode toggle Logout button Components Floating Action Button Rounded cards Modern switches Icon buttons Search field Filter chips Progress indicators Bottom navigation bar Beautiful empty-state illustrations Animations Smooth page transitions Button ripple effects Swipe-`;

  console.log("Fetching raw schema...");
  try {
    const res = await fetch("http://localhost:3001/api/generate-ui", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        action: "generate",
        model: "Gemini 2.5 Flash"
      })
    });

    const data = await res.json();
    fs.writeFileSync('scratch/raw-schema.json', JSON.stringify(data, null, 2));
    console.log("Raw schema saved to scratch/raw-schema.json");
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

test();
