const API_KEY = "AIzaSyCYCRSGLcdakr6d0kUI98G5yI9UeMw9n4U";  // Replace with your API Key
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Utility to create a message element
const createMessageElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
};

// Function to generate answers for each question
const generateAnswer = async (question) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: question }],  // Add the question text here
                    },
                ],
            }),
        });

        const data = await response.json();

        // Validate response and extract answer
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
        
        // Format the response into point-wise manner
        return formatAnswer(apiResponse);
    } catch (error) {
        console.error("Error generating API response:", error);
        return "Failed to connect to the API.";
    }
};

// Function to format the answer in a point-wise manner
const formatAnswer = (response) => {
    const points = response.split('\n').filter(line => line.trim() !== '');  // Split by lines and remove empty ones
    let formattedAnswer = "<ul>";
    points.forEach(point => {
        formattedAnswer += `<li>${point}</li>`;  // Wrap each point in <li> tags
    });
    formattedAnswer += "</ul>";
    return formattedAnswer;
};

$(document).ready(function() {
    // Fetch subjects when semester is selected
    $('#semester').change(function() {
        var semesterId = $(this).val();
        if (semesterId) {
            $.ajax({
                url: '/subjects/' + semesterId,
                method: 'GET',
                success: function(data) {
                    $('#subject').empty();
                    $('#subject').append('<option value="">--Select Subject--</option>');
                    data.forEach(function(subject) {
                        $('#subject').append('<option value="' + subject[0] + '">' + subject[1] + '</option>');
                    });
                }
            });
        } else {
            $('#subject').empty();
            $('#subject').append('<option value="">--Select Subject--</option>');
        }
    });

    // Fetch chapters when subject is selected
    $('#subject').change(function() {
        var subjectId = $(this).val();
        if (subjectId) {
            $.ajax({
                url: '/chapters/' + subjectId,
                method: 'GET',
                success: function(data) {
                    $('#chapter').empty();
                    $('#chapter').append('<option value="">--Select Chapter--</option>');
                    data.forEach(function(chapter) {
                        $('#chapter').append('<option value="' + chapter[0] + '">' + chapter[1] + '</option>');
                    });
                }
            });
        } else {
            $('#chapter').empty();
            $('#chapter').append('<option value="">--Select Chapter--</option>');
        }
    });

    // Fetch questions when chapter is selected
    $('#chapter').change(function() {
        var chapterId = $(this).val();
        if (chapterId) {
            $.ajax({
                url: '/questions/' + chapterId,
                method: 'GET',
                success: function(data) {
                    $('#questions').empty();
                    data.forEach(function(question) {
                        // Add question to the list
                        const questionText = question[1];
                        const questionItem = $('<li>').text(questionText);
                         
                        // Create a "Generate Answer" button for each question
                        const generateButton = $('<button>')  // Button to generate answer
                            .addClass('generate-button')
                            .text('Generate Answer')
                            .on('click', async function() {
                                // Disable button while generating
                                $(this).prop('disabled', true);
                                
                                // Generate answer using the API
                                const answer = await generateAnswer(questionText);
                                
                                // Append the answer below the question
                                questionItem.append('<p><strong>Answer: </strong>' + answer + '</p>');
                                
                                // Display revision message
                                const message = "<p style='color: #473764; font-size: 1.5rem;'>This answer is only for revision purposes. For detailed study, use Exabudy or shared notes.</p>";
                                questionItem.append(message);
                                
                                // Enable the button again
                                $(this).prop('disabled', false);
                            });

                        // Append the button to the question item
                        questionItem.append(generateButton);
                        $('#questions').append(questionItem);
                    });
                }
            });
        } else {
            $('#questions').empty();
        }
    });
});
