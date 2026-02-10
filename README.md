# 🎮 Game Discovery Engine

A semantic search and recommendation engine leveraging **Google Gemini's LLM capabilities** to interpret abstract user queries—like *"games that feel like a lonely walk in the rain"* or *"narratives where I'm the villain, not the hero."* It combines this AI-driven analysis with the **IGDB API** to deliver highly personalized game suggestions, dynamic filtering, and real-time backlog tracking.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌐 Live Demo

You can try the application right now without installing anything!  
👉 **[Click here to view the live app](https://ai-game-recommender.onrender.com/)**

*(Note: The server is hosted on a free tier, so it may take about 50 seconds to wake up on the first load. Please be patient!)*

---

## ✨ Features

* **AI-Powered Discovery:** Get automatic personalized game recommendations based on your "Completed" games list using Google Gemini 2.5 Flash.
* **Smart Search:** Don't just search for titles—describe a **feeling, vibe, or specific prompt** (e.g., "cozy games with rain" or "challenging sci-fi with a great story"). The AI interprets your request to find the perfect matches.
* **Dynamic Filtering:** The UI adapts to the content by instantly categorizing search results and generating clickable genre tags, allowing for intuitive, one-click drill-downs.
* **Backlog Management:** Add games to your "Queue" to track what you want to play next.
* **Play History:** Mark games as "Completed" to build your profile and improve AI recommendations.
* **Personal Notes:** Add custom notes to any game in your queue or history.
* **Local Persistence:** Your lists and data are saved locally, so you never lose your progress! (please don't lose your phone)

## 📸 Screenshots

* prompt used: "Games that feel lonely and isolating but beautiful."

| Smart Discovery | Game Details | Action Buttons |Backlog View |Backlog Management |
|:---:|:---:|:---:|:---:|:---:|
| <img width="199" height="411" alt="discover" src="https://github.com/user-attachments/assets/30637d7d-bbf4-40ee-9bcd-35d2ab2ffe49" /> | <img width="199" height="411" alt="details" src="https://github.com/user-attachments/assets/c2a36772-f5d0-4301-a7c2-6ae96f3d4625" /> |<img width="199" height="411" alt="details2" src="https://github.com/user-attachments/assets/f82d4648-df62-45cd-82b6-f3ad65e18baa" />|<img width="199" height="411" alt="queue" src="https://github.com/user-attachments/assets/c1c80799-e9f8-4c33-ba94-bbe69624b159" /> |<img width="199" height="386" alt="queue2" src="https://github.com/user-attachments/assets/071155fa-d69f-4568-934b-715e3d48af5f" />



## 🛠️ Tech Stack

* **Frontend:** Vanilla JavaScript, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **AI Integration:** Google Gemini API (gemini-2.5-flash)
* **Data Source:** IGDB API (via Twitch Developer Console)
* **Deployment:** Render

## 🚀 How to Run Locally

If you prefer to run the code on your own machine, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Clone the Repository

    cd [desired path]
    git clone https://github.com/AlaricAbraham/ai-game-recommender.git
    
### 3. Install Dependencies

    npm start

### 4. Configure Environment Variables

* 1. Create a file named ```.env``` in the root directory.

* 2. Add the following keys (you will need your own API keys):
```
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# IGDB / Twitch API Keys
IGDB_CLIENT_ID=your_twitch_client_id
IGDB_ACCESS_TOKEN=your_twitch_access_token
```
  Note: To get an IGDB Access Token, you need to register an app on the Twitch Developer Console.

### 5. Start the Server

    npm start

### 6. Access the App
Open your browser and visit:

    http://localhost:5000
