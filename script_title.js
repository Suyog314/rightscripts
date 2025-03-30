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

document.getElementById("download-btn").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const textArea = document.querySelector("#finalization-content textarea");

    const content = textArea.value.trim();
    if (!content) {
        alert("No content to download.");
        return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.text(content, 10, 10, { maxWidth: 180 });
    doc.save("Final_Script.pdf");
});


//--------------------------refine button----------------------------//

document.addEventListener("DOMContentLoaded", function () {
    const refineBtn = document.getElementById("refine-btn");
    const textArea = document.querySelector("#finalization-content textarea");
    const minuteInput = document.getElementById("minuteInput");
    const secondInput = document.getElementById("secondInput");
    const platformInput = document.querySelector(".platform textarea");

    refineBtn.addEventListener("click", async function () {
        const videoText = textArea.value;
        const videoLength = `${minuteInput.value} min ${secondInput.value} sec`;
        const platform = platformInput.value;

        if (!videoText.trim()) {
            alert("Please enter content before refining.");
            return;
        }

        const prompt = `Refine this script for a ${videoLength} long video on ${platform}. Make it engaging, structured, and professional:\n\n${videoText}`;

        try {
            const response = await fetch("http://localhost:3000/api/refine", { // ✅ Send request to backend
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();
            if (data.success) {
                textArea.value = data.refinedText; // ✅ Update textarea with refined text
            } else {
                alert("Failed to refine text. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while refining the text.");
        }
    });
});

