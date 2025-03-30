
const { jsPDF } = window.jspdf;


document.addEventListener("DOMContentLoaded", function () {
    const scriptsContainer = document.getElementById("scripts-container");
    const showMoreBtn = document.getElementById("show-more-btn");

    // Example scripts data (Replace this with real script titles)
    const scripts = [
        "Marketing Strategy for 2024",
        "AI in Education",
        "Sustainable Business Practices",
        "Effective Video Tutorials",
        "Design Thinking for Startups",
        "Blockchain in Healthcare",
        "User Experience in Web Design",
        "Psychology of Learning",
        "The Future of Remote Work",
        "Best Practices for Script Writing"
    ];

    let visibleScripts = 8; // Number of scripts shown initially

    function displayScripts() {
        scriptsContainer.innerHTML = ""; // Clear previous content
        scripts.slice(0, visibleScripts).forEach(script => {
            const scriptDiv = document.createElement("div");
            scriptDiv.classList.add("script-item");
            scriptDiv.innerText = script;
            scriptsContainer.appendChild(scriptDiv);
        });

        // Hide the button if all scripts are visible
        if (visibleScripts >= scripts.length) {
            showMoreBtn.style.display = "none";
        } else {
            showMoreBtn.style.display = "block";
        }
    }

    // Load initial scripts
    displayScripts();

    // Show More functionality
    showMoreBtn.addEventListener("click", function () {
        visibleScripts += 4; // Load 4 more scripts each time
        displayScripts();
    });
});


// Scroll to the Guide section
document.querySelector(".guide-script").addEventListener("click", function () {
    document.querySelector(".guide").scrollIntoView({ behavior: "smooth" });
});

// Scroll to the Previous Scripts section
document.querySelector(".prev-scripts").addEventListener("click", function () {
    document.querySelector(".previous-scripts").scrollIntoView({ behavior: "smooth" });
});

// Redirect to the New Script page
document.querySelector(".new-script").addEventListener("click", function () {
    window.location.href = "title.html"; // Update with the actual page URL
});



//--------------------------------for refine and download button-----------------------------------//

document.addEventListener("DOMContentLoaded", function () {
    const refineBtn = document.getElementById("refine-btn");
    const downloadBtn = document.getElementById("download-btn");
    const textArea = document.querySelector("#finalization-content textarea");
    const minuteInput = document.getElementById("minuteInput");
    const secondInput = document.getElementById("secondInput");
    const platformInput = document.querySelector(".platform textarea");

    // ✅ Function to send data to ChatGPT and update textarea
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
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer YOUR_OPENAI_API_KEY`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                textArea.value = data.choices[0].message.content; // ✅ Update textarea with refined text
            } else {
                alert("Failed to refine text. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while refining the text.");
        }
    });

    // ✅ Function to download content as PDF
    downloadBtn.addEventListener("click", function () {
        const content = textArea.value;
        if (!content.trim()) {
            alert("No content to download.");
            return;
        }

        const doc = new jsPDF();
        doc.setFont("helvetica", "normal");
        doc.text(content, 10, 10, { maxWidth: 180 });
        doc.save("Final_Script.pdf");
    });
});






//----------------------------------------modified download button-----------------------------------------///

downloadBtn.addEventListener("click", function () {
    const content = textArea.value;
    if (!content.trim()) {
        alert("No content to download.");
        return;
    }

    const doc = new docx.Document({
        sections: [
            {
                properties: {},
                children: [
                    new docx.Paragraph({
                        children: [new docx.TextRun(content)]
                    })
                ]
            }
        ]
    });

    docx.Packer.toBlob(doc).then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Final_Script.docx";
        link.click();
    });
});


