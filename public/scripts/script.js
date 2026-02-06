document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const gameSearchInput = document.getElementById("game-search");
    const resultSection = document.getElementById("result");

    const queueSection = document.getElementById("queue");
    const completedSection = document.getElementById("completed-list");
    const queueGamesSection = document.getElementById("queue-games");
    const discoverSection = document.getElementById("discover-section");
    const profileSection = document.getElementById("profile-section");

    
    const discoverButton = document.getElementById("discover-button");
    const queueButton = document.getElementById("games-button");
    const profileButton = document.getElementById("profile-button");

    const footerButtons = document.querySelectorAll(".footer-button");
    const filterContainer = document.createElement("div");

    // Set up filter container
    filterContainer.id = "filter-container";
    filterContainer.style.display = "flex";
    filterContainer.style.justifyContent = "center";
    filterContainer.style.gap = "10px";
    filterContainer.style.marginTop = "10px";

    // Append the filter container under the search bar
    discoverSection.insertBefore(filterContainer, resultSection);

    // Get the modal and the close button
    const infoModal = document.getElementById("Instructions-modal");
    const infoButton = document.getElementById("info-button"); // Assuming this is the info button's ID
    const closeInfoModalButton = document.getElementById("close-info-modal");
    
    // modal stuff
    const gameDetailModal = document.getElementById("game-detail-modal");
    const closeModalButton = document.getElementById("close-modal");
    const addToQueueButton = document.getElementById("add-to-queue");

    const gameTitle = document.getElementById("game-title");
    const gameCover = document.getElementById("game-cover");
    const gameSummary = document.getElementById("game-summary");
    const gameGenres = document.getElementById("game-genres");
    const gameRating = document.getElementById("game-rating");
    const gamePlatforms = document.getElementById("game-platforms");
    const gameScreenshots = document.getElementById("game-screenshots");
    const gameReleaseDate = document.getElementById("game-release-date");
    const gameModes = document.getElementById("game-modes");
    const gameURL = document.getElementById("game-url");

    // queue modal
    const trackedGameModal = document.getElementById("tracked-game-modal");
    const closeTrackedModalButton = document.getElementById("close-tracked-modal");
    const deleteButton = document.getElementById("delete-button");
    const editNoteButton = document.getElementById("edit-note-button");
    const markAsPlayedButton = document.getElementById("mark-as-played");

    const markAsPlayedQueue = document.getElementById("mark-as-played-queue");

    const trackedGameTitle = document.getElementById("tracked-game-title");
    const trackedGameCover = document.getElementById("tracked-game-cover");
    const trackedGameURL = document.getElementById("tracked-game-url");
    const trackedGamePlatforms = document.getElementById("tracked-game-platforms");

    const trackedGameStatus = document.getElementById("tracked-game-status");
    const trackedGameNote = document.getElementById("tracked-game-note");

    // completed modal
    const completedGameModal = document.getElementById("completed-game-modal");
    const closeCompletedModalButton = document.getElementById("close-completed-modal");

    const completedGameTitle = document.getElementById("completed-game-title");
    const completedGameCover = document.getElementById("completed-game-cover");
    const completedGameURL = document.getElementById("completed-game-url");

    const completedGameStatus = document.getElementById("completed-game-status");
    const completedGameNote = document.getElementById("completed-game-note");

    const deleteProfile = document.getElementById("delete-button-profile");

    const editNoteProfile = document.getElementById("edit-note-button-profile");
    

    // Store selected game for tracking
    let selectedGame = null;
    let trackedGames = [];
    let completedGames = [];


    // we can save data on local storage on client device so that it presists between sessions
    function saveTrackedGames() {
        localStorage.setItem("trackedGames", JSON.stringify(trackedGames));
    }
    function saveCompletedGames() {
        localStorage.setItem("completedGames", JSON.stringify(completedGames));
    }
    function loadTrackedGames() {
        savedGames = localStorage.getItem("trackedGames");
        if (savedGames) {
            trackedGames = JSON.parse(savedGames);
        } else {
            trackedGames = []; // Initialize as empty array if no data is found
        }
    }
    

    function loadCompletedGames() {
        completedGames = localStorage.getItem("completedGames");
        if (completedGames) {
            completedGames = JSON.parse(completedGames);
        } else {
            completedGames = []; // Initialize as empty array if no data is found
        }
    }
    
    loadTrackedGames();
    loadCompletedGames();
    displayQueueGameCards();
        

     // Define the base URL of the server
     const SERVER_URL = "http://localhost:5000"; // server running on client machine

    // Function to reset active tab by removing the "active" class from all buttons
    function resetActiveTab() {
        footerButtons.forEach(button => button.classList.remove("active"));
    }

    // Show games in queue and set "Queue" as the active tab
    queueButton.addEventListener("click", function () {
        queueGamesSection.style.display = "block";
        discoverSection.style.display = "none";
        profileSection.style.display = "none";

        resetActiveTab();
        queueButton.classList.add("active"); // Mark Games button as active
        displayQueueGameCards(); // Update the queue display
    });


    
    let isFirstTimeDiscover = true; // Flag to check if it's the first time Discover is pressed
    let hasResults = false; // Track if results are already displayed in the result section

    discoverButton.addEventListener("click", async function () {

        queueGamesSection.style.display = "none";
        discoverSection.style.display = "block";
        profileSection.style.display = "none";
        gameSearchInput.focus();

        resetActiveTab();
        discoverButton.classList.add("active"); // Mark Discover button as active

        // If the result section already has games and it's not the first time, return early
        if (hasResults && !isFirstTimeDiscover) {
            return;
        }

        // If it's the first time Discover is pressed or the result section is empty, show default game list
        if (isFirstTimeDiscover || !hasResults) {
            resultSection.innerHTML = "<p>Searching...</p>";

            try {
                console.log("trying ChatGPT api"); // debug

                // Step 1: Get game recommendations from ChatGPT considering the user's play history
                const completedTitles = completedGames.map(game => game.name);
                query = `${"Games based on my play history"} USER'S PLAY HISTORY: ${completedTitles.join(", ")}`;

                const chatGPTResponse = await fetch(`${SERVER_URL}/get-game-recommendations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query }),
                });
                const chatGPTData = await chatGPTResponse.json();
                const gameTitles = chatGPTData.gameTitles;
                
                // Step 2: Get game info from IGDB API
                console.log("trying igdb api"); // debug
                const igdbResponse = await fetch(`${SERVER_URL}/get-igdb-game-info`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ gameTitles }),
                });
                const igdbData = await igdbResponse.json();
                console.log("displaying found games"); // debug

                // Step 3: Display filters and game info as cards
                displayFilterButtons(igdbData.games);
                displaySearchedGameCards(igdbData.games);

                // Set the flag that results are now available
                hasResults = true;
                isFirstTimeDiscover = false; // After first click, set to false
            } catch (error) {
                console.error("Error fetching game data:", error);
                resultSection.innerHTML = "<p>Error fetching game data.</p>";
            }
        }
    });


    // Show profile section and set "Profile" as the active tab
    profileButton.addEventListener("click", function () {
        queueGamesSection.style.display = "none";
        discoverSection.style.display = "none";
        profileSection.style.display = "block";
        displayCompletedGames();
        resetActiveTab();
        profileButton.classList.add("active"); // Mark Profile button as active
    });

    // Search functionality within Discover section
    searchButton.addEventListener("click", async function () {

        console.log("Search button clicked!"); // debug

        let query = gameSearchInput.value.trim();
        
        if (query) {
            resultSection.innerHTML = "<p>Searching...</p>";

            try {
                console.log("trying Chatgpt api"); // debug

                // Step 1: Get game recommendations from ChatGPT considering the user's play history
                const completedTitles = completedGames.map(game => game.name);
                query = `${query} USER'S PLAY HISTORY: ${completedTitles.join(", ")}`;

                const chatGPTResponse = await fetch(`${SERVER_URL}/get-game-recommendations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query }),
                });
                const chatGPTData = await chatGPTResponse.json();
                const gameTitles = chatGPTData.gameTitles;
                
                // Step 2: Get game info from IGDB API
                console.log("trying igdb api"); // debug
                const igdbResponse = await fetch(`${SERVER_URL}/get-igdb-game-info`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ gameTitles }),
                });
                const igdbData = await igdbResponse.json();
                console.log("displaying found games"); // debug
                // Step 3: Display filter buttons and game info as cards
                displaySearchedGameCards(igdbData.games);
                displayFilterButtons(igdbData.games);
            } catch (error) {
                console.error("Error fetching game data:", error);
                resultSection.innerHTML = "<p>Error fetching game data.</p>";
            }
        } else {
            alert("Please enter a game name or query.");
        }
    });


    // Function to display the modal with game details
    function openGameDetailModal(game) {
        selectedGame = game;
        gameTitle.innerHTML = game.name;
        gameCover.src = `https:${game.cover.url.replace("thumb", "cover_big")}`;
        gameSummary.innerHTML = game.summary;
        gameGenres.innerHTML = game.genres.map(genre => genre.name).join(", ");
        gameRating.innerHTML = game.rating ? game.rating.toFixed(1) : "N/A";
        gamePlatforms.innerHTML = game.platforms.map(platform => platform.name).join(", ");
        gameReleaseDate.innerHTML = game.first_release_date? game.first_release_date : "N/A";
        gameModes.innerHTML = game.game_modes.map(game_modes => game_modes.name).join(", ");
        gameURL.innerHTML = game.url? game.url : "N/A";
        
        // Display screenshots
        gameScreenshots.innerHTML = "";
        game.screenshots.forEach(screenshot => {
            const img = document.createElement("img");
            img.src = `https:${screenshot.url.replace("thumb", "720p")}`;
            img.alt = `${game.name} Screenshot`;
            img.style.width = "270px";
            img.style.margin = "5px";
            gameScreenshots.appendChild(img);
        });

        gameDetailModal.style.display = "flex"; // Show the modal
    }

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener("click", function () {
        gameDetailModal.style.display = "none"; // Hide the modal
    });

    // Add the game to the queue
    addToQueueButton.addEventListener("click", function () {
        if (selectedGame) {
            // Check if the game is already in the completedGames array
            const gameExists = completedGames.some(game => game.name === selectedGame.name);

            if (!gameExists) {
                // Check if the game is already in the trackedGames array
                const gameExists = trackedGames.some(game => game.name === selectedGame.name);

                if (!gameExists) {
                    selectedGame.status = "not started";
                    trackedGames.push(selectedGame); // Add to tracked games
                    console.log("Game added to queue:", selectedGame.name);
                    gameDetailModal.style.display = "none"; // Close modal after adding

                    showNotification("Game added to queue!");
                    saveTrackedGames();                }
                else {
                    console.log("Game already in queue:", selectedGame.name);
                    showNotification("Game already in the queue");
                }
            }
            else {
                console.log("Game already completed", selectedGame.name);
                showNotification("Game already completed");
            }
        }
    });

    // Add the game to the "complete games" list
    markAsPlayedButton.addEventListener("click", function () {
        if (selectedGame) {

            // Check if the game is already in the completedGames array
            const gameExists = completedGames.some(game => game.name === selectedGame.name);

            if (!gameExists) {
                selectedGame.status = "completed";
                completedGames.push(selectedGame); // Add to tracked games
                console.log("Game added completed:", selectedGame.name);
                gameDetailModal.style.display = "none"; // Close modal after adding

                // Remove the game from the trackedGames array
                const gameIndex = trackedGames.findIndex(game => game.name === selectedGame.name);
                if (gameIndex !== -1) {
                    trackedGames.splice(gameIndex, 1); // Remove the game from trackedGames
                    console.log("Game removed from queue:", selectedGame.name);
                }
                saveTrackedGames();
                saveCompletedGames();
                showNotification("Game marked as complete!");
            }
            else {
                console.log("Game already completed", selectedGame.name);
                showNotification("Game already completed");
            }
        }
    });

    // Add the game to the "complete games" list - from queue
    markAsPlayedQueue.addEventListener("click", function () {
        if (selectedGame) {

            // Check if the game is already in the completedGames array
            const gameExists = completedGames.some(game => game.name === selectedGame.name);

            if (!gameExists) {
                selectedGame.status = "completed";
                completedGames.push(selectedGame); // Add to tracked games
                console.log("Game added completed:", selectedGame.name);
                trackedGameModal.style.display = "none"; // Close modal after adding

                // Remove the game from the trackedGames array
                const gameIndex = trackedGames.findIndex(game => game.name === selectedGame.name);
                if (gameIndex !== -1) {
                    trackedGames.splice(gameIndex, 1); // Remove the game from trackedGames
                    console.log("Game removed from queue:", selectedGame.name);
                }
                saveTrackedGames();
                saveCompletedGames();
                displayQueueGameCards();
                showNotification("Game marked as complete!");
            }
            else {
                console.log("Game already completed", selectedGame.name);
                showNotification("Game already completed");
            }
        }
    });
    editNoteButton.addEventListener("click", function() {
        if (selectedGame) {

            const note = prompt("Enter a note for this game:");
    
            // Check if the user entered a note
            if (note) {
                // Add the note to the selected game
                selectedGame.note = note;
                console.log("Note added:", note);
    
                // Save updated trackedGames to localStorage
                saveTrackedGames();
                displayQueueGameCards();
                openQueueGameModal(selectedGame);
                showNotification("Note saved!");
            }
            else {
                showNotification("Invalid note! please try again.");
            }
        } else {
            console.log("No game selected to add a note.");
        }
    });

    editNoteProfile.addEventListener("click", function() {
        if (selectedGame) {

            const note = prompt("Enter a note for this game:");
    
            // Check if the user entered a note
            if (note) {
                // Add the note to the selected game
                selectedGame.note = note;
                console.log("Note added:", note);
    
                // Save updated trackedGames to localStorage
                saveTrackedGames();
                displayCompletedGames();
                openCompletedGameModal(selectedGame);
                showNotification("Note saved!");
            }
            else {
                showNotification("Invalid note! please try again.");
            }
        } else {
            console.log("No game selected to add a note.");
        }
    });

    function openQueueGameModal(game) {
        selectedGame = game;
        trackedGameTitle.innerHTML = game.name;
        trackedGameCover.src = `https:${game.cover.url.replace("thumb", "cover_big")}`;
        trackedGamePlatforms.innerHTML = game.platforms.map(platform => platform.name).join(", ");
        trackedGameURL.innerHTML = game.url? game.url:"N/A";

        trackedGameStatus.innerHTML = game.status? game.status : "N/A";
        trackedGameNote.innerHTML = game.note? game.note : "N/A";
        

        trackedGameModal.style.display = "flex"; // Show the modal

    }

    // Close the modal when the close button is clicked
    closeTrackedModalButton.addEventListener("click", function () {
        trackedGameModal.style.display = "none"; // Hide the modal
    });

    deleteButton.addEventListener("click", function(){
        if (selectedGame) {
            // Find the index of the game in the tracked games list
            const gameIndex = trackedGames.findIndex(game => game.id === selectedGame.id);
    
            if (gameIndex !== -1) {
                // Remove the game from the tracked games list
                trackedGames.splice(gameIndex, 1);
                console.log("Game removed from list:", selectedGame.name);
    
                // Update UI, close modal, or perform any additional actions needed
                trackedGameModal.style.display = "none"; // Close modal after deleting
                displayQueueGameCards();
                showNotification("Game deleted");
            } else {
                console.log("Game not found in the list.");
            }
            saveTrackedGames();
        }
        if (selectedGame) {
            // Find the index of the game in the completed games list
            const gameIndex = completedGames.findIndex(game => game.id === selectedGame.id);
    
            if (gameIndex !== -1) {
                // Remove the game from the tracked games list
                completedGames.splice(gameIndex, 1);
                console.log("Game removed from list:", completedGames.name);
    
                // Update UI, close modal, or perform any additional actions needed
                completedGameModal.style.display = "none"; // Close modal after deleting
                displayCompletedGames();
            } else {
                console.log("Game not found in the list.");
            }
            saveCompletedGames();
            displayCompletedGames();
        }
    });

    deleteProfile.addEventListener("click", function(){
        if (selectedGame) {
            // Find the index of the game in the tracked games list
            const gameIndex = completedGames.findIndex(game => game.id === selectedGame.id);
    
            if (gameIndex !== -1) {
                // Remove the game from the tracked games list
                completedGames.splice(gameIndex, 1);
                console.log("Game removed from list:", selectedGame.name);
    
                // Update UI, close modal, or perform any additional actions needed
                completedGameModal.style.display = "none"; // Close modal after deleting
                displayCompletedGames();
                showNotification("Game deleted");
            } else {
                console.log("Game not found in the list.");
            }
            saveCompletedGames();
        }
        if (selectedGame) {
            // Find the index of the game in the completed games list
            const gameIndex = completedGames.findIndex(game => game.id === selectedGame.id);
    
            if (gameIndex !== -1) {
                // Remove the game from the tracked games list
                completedGames.splice(gameIndex, 1);
                console.log("Game removed from list:", completedGames.name);
    
                // Update UI, close modal, or perform any additional actions needed
                completedGameModal.style.display = "none"; // Close modal after deleting
                displayCompletedGames();
            } else {
                console.log("Game not found in the list.");
            }
            saveCompletedGames();
            displayCompletedGames();
        }
    });


    // filters

        // Display Filter Buttons
    function displayFilterButtons(games) {
        const genres = new Set();
        
        // Filter out null or undefined games
        const validGames = games.filter(game => game !== null);
        console.log("Games received for filters:", validGames); // debugging

        validGames.forEach(game => {
            if (game.genres) { // Check if genres exist
                game.genres.forEach(genre => genres.add(genre.name));
            }
        });

        filterContainer.innerHTML = ""; // Clear previous buttons
        genres.forEach(genre => {
            const button = document.createElement("button");
            button.className = "filter-button";
            button.textContent = genre;

            button.addEventListener("click", () => {
                // Toggle the active class on the clicked button
                const activeButton = document.querySelector(".filter-button.active");
                if (activeButton) {
                    activeButton.classList.remove("active");
                }
                button.classList.add("active"); // Mark this button as active

                // Filter games based on the clicked genre
                const filteredGames = validGames.filter(game =>
                    game.genres?.some(g => g.name === genre) // Safe navigation for genres
                );
                displaySearchedGameCards(filteredGames); // Function to display the filtered games
            });

            filterContainer.appendChild(button);
        });
    }



    // Function to display game cards
    function displaySearchedGameCards(games) {
        resultSection.innerHTML = ""; // Clear previous results
        games.forEach(game => {

            if (!game) return; // Skip null or undefined entries

            const card = document.createElement("div");
            card.classList.add("game-card");
            
            // Add game card HTML
            card.innerHTML = `
                <img src="https:${game.cover ? game.cover.url.replace("thumb", "cover_big") : ''}" alt="${game.name} Cover">
                <div class="card-details">
                    <h3>${game.name}</h3>
                    <p><strong>Rating:</strong> ${game.rating ? game.rating.toFixed(1) : 'N/A'}</p>
                    <p><strong>Genres:</strong> ${game.genres ? game.genres.map(genre => genre.name).join(', ') : 'N/A'}</p>
                    <p>${game.summary ? game.summary.slice(0, 100) + '...' : 'No description available.'}</p>
                </div>
            `;

            // Add event listener to show detailed modal on card click
            card.addEventListener("click", function () {
                openGameDetailModal(game); // Show game details in the modal
            });
            
            result.appendChild(card);
        });
    }

    // Function to display game cards
    function displayQueueGameCards() {
        queueSection.innerHTML = ""; // Clear previous queue
        trackedGames.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");
            
            // Add game card HTML
            card.innerHTML = `
                <img src="https:${game.cover ? game.cover.url.replace("thumb", "cover_big") : ''}" alt="${game.name} Cover">
                <div class="card-details">
                    <h3>${game.name}</h3>
                    <p><strong>Status:</strong> ${game.status ? game.status.slice(0, 100) : 'N/A.'}</p>
                    <p><strong>Notes:</strong> ${game.note ? game.note.slice(0, 100) + '...' : 'No note added.'}</p>
                </div>
            `;

            // Add event listener to show detailed modal on card click
            card.addEventListener("click", function () {
                openQueueGameModal(game); // Show game details in the modal
            });

            queue.appendChild(card);
        });
    }



    function openCompletedGameModal(game) {
        selectedGame = game;
        completedGameTitle.innerHTML = game.name;
        completedGameCover.src = `https:${game.cover.url.replace("thumb", "cover_big")}`;

        completedGameStatus.innerHTML = game.status? game.status : "N/A";
        completedGameNote.innerHTML = game.note? game.note : "N/A";
        completedGameURL.innerHTML = game.url? game.url:"N/A";

        completedGameModal.style.display = "flex"; // Show the modal

    }


    // Function to display game cards... but for the profile
    function displayCompletedGames() {
        completedSection.innerHTML = ""; // Clear previous queue
        
        
        // Reverse the array to display the games in reverse order (newest games show up first)
        const reversedGames = [...completedGames].reverse();

        reversedGames.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");
            
            // Add game card HTML
            card.innerHTML = `
                <img src="https:${game.cover ? game.cover.url.replace("thumb", "cover_big") : ''}" alt="${game.name} Cover">
                <div class="card-details">
                    <h3>${game.name}</h3>
                    <p><strong>Status:</strong> ${game.status ? game.status.slice(0, 100) : 'N/A.'}</p>
                    <p><strong>Notes:</strong> ${game.note ? game.note.slice(0, 100) + '...' : 'No note added.'}</p>
                </div>
            `;

            // Add event listener to show detailed modal on card click
            card.addEventListener("click", function () {
                openCompletedGameModal(game); // Show game details in the modal
            });

            completedSection.appendChild(card);
        });
    }

     // Close the modal when the close button is clicked
     closeCompletedModalButton.addEventListener("click", function () {
        completedGameModal.style.display = "none"; // Hide the modal
    });

    infoButton.addEventListener("click", () => {
        infoModal.style.display = "flex"; // Display the modal
    });
    // Close the modal when the close button is clicked
    closeInfoModalButton.addEventListener("click", function () {
        infoModal.style.display = "none"; // Hide the modal
    });


    // notification class to give user in-app action feedback
    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('show');
      
        // Automatically hide the notification after 3 seconds
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            notification.classList.add('hidden');
          }, 300); // Matches the fade-out duration
        }, 2000); // Show the notification for 3 seconds
      }
});


   





