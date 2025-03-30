document.addEventListener("DOMContentLoaded", function () {
    const sidebarButtons = document.querySelectorAll(".sidebar-btn");
    const textArea = document.querySelector(".content textarea");
    const nextBtn = document.querySelector(".Next");
    const prevBtn = document.querySelector(".Previous");
    const heading = document.querySelector(".content h2");
    const countDisplay = document.getElementById("count");
    const finalizationContent = document.getElementById("finalization-content");
    const finalizationButtons = document.querySelector(".finalization-buttons");

    const sectionNames = [
        "Enter Video Title here",
        "Enter Video Introduction here",
        "Enter Video Objectives here",
        "Enter Video Content here",
        "Enter Video Reflections here",
        "Enter Video Summary here",
        "Video Finalization here"
    ];

    let currentIndex = 0;
    let storedData = {};  
    let completedSections = Array(sectionNames.length).fill(false);

    function updateSection(index) {
        // Save the current section's text before switching
        storedData[sectionNames[currentIndex]] = textArea.value;

        // Load saved text
        textArea.value = storedData[sectionNames[index]] || "";

        heading.textContent = sectionNames[index];  
        countDisplay.textContent = `${index + 1}/7`;

        // Update sidebar button styles
        sidebarButtons.forEach((btn, idx) => {
            btn.style.background = idx < index ? "green" : idx === index ? "blue" : "white";
            btn.style.color = idx <= index ? "white" : "black";
        });

        // Handle Finalization section
        if (index === sectionNames.length - 1) {  
            finalizationContent.classList.add("finalization-active");
            finalizationButtons.style.display = "flex"; // Show buttons
            
            // Generate a formatted preview of all sections
            let previewText = "";
            for (let i = 0; i < sectionNames.length - 1; i++) {
                previewText += `${sectionNames[i].replace("Enter ", "").replace(" here", "")}:\n${storedData[sectionNames[i]] || "Not provided"}\n\n`;
            }
            textArea.value = previewText; 
            textArea.readOnly = false; // Allow editing

        } else {
            finalizationContent.classList.remove("finalization-active");
            finalizationButtons.style.display = "none"; // Hide buttons
            textArea.readOnly = false; // Normal editing
        }

        currentIndex = index;
    }

    nextBtn.addEventListener("click", function () {
        if (textArea.value.trim() === "") {
            alert("Please complete this section before moving forward.");
            return;
        }
        completedSections[currentIndex] = true;
        if (currentIndex < sectionNames.length - 1) {
            updateSection(currentIndex + 1);
        }
    });

    prevBtn.addEventListener("click", function () {
        if (currentIndex > 0) {
            updateSection(currentIndex - 1);
        }
    });

    sidebarButtons.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            if (completedSections[index] || index === 0) {
                updateSection(index);
            } else {
                alert("You must complete the previous sections before accessing this one.");
            }
        });
    });

    updateSection(0);
});

// -------------------- Download & Preview Buttons --------------------
document.getElementById("preview-btn").addEventListener("click", function () {
    alert("Preview Finalization Content:\n\n" + document.querySelector(".content textarea").value);
});

document.getElementById("download-btn").addEventListener("click", function () {
    const content = document.querySelector(".content textarea").value;
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finalization_script.txt";
    link.click();
});

document.getElementById("refine-download-btn").addEventListener("click", function () {
    alert("Refining script based on platform and time constraints...");
    // Placeholder for AI-generated script logic
});


document.getElementById("refine-btn").addEventListener("click", async function () {
    let scriptData = "";
    const sectionTitles = [
        "Title", "Introduction", "Objectives", "Content", 
        "Reflection Spot", "Summary", "Finalization"
    ];

    // Gather all entered content
    sectionTitles.forEach(title => {
        if (storedData[title]) {
            scriptData += `${title}: ${storedData[title]}\n\n`;
        }
    });

    if (!scriptData.trim()) {
        alert("No content available to refine.");
        return;
    }

    // Send to ChatGPT for refinement
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY" // Replace with your API key
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "Refine this script for clarity and conciseness." },
                       { role: "user", content: scriptData }]
        })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        const refinedScript = data.choices[0].message.content;

        // Display refined text in finalization section
        document.querySelector("#finalization-content textarea").value = refinedScript;
    } else {
        alert("Error refining the script.");
    }
});
