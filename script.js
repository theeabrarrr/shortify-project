document.getElementById('urlForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent page reload

    const longUrl = document.getElementById('longUrl').value;

    try {
        const response = await fetch('/shorten', { // Replace '/shorten' with your backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ longUrl })
        });

        if (!response.ok) {
            const errorData = await response.json(); // Try to parse error response
            const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage); // Re-throw the error with a more user-friendly message
        }

        const data = await response.json();
        const shortUrl = data.shortUrl; // Assuming your backend returns { shortUrl: "..." }

        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('shortUrl').href = shortUrl; // Make it a clickable link


    } catch (error) {
        console.error('Error shortening URL:', error);
        document.getElementById('shortUrl').textContent = 'Error shortening URL. Please try again.';
    }
});
document.getElementById('urlForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const longUrl = document.getElementById('longUrl').value;

    // Input validation: Check if the input is a valid URL
    if (!isValidURL(longUrl)) {
        alert("Please enter a valid URL."); // Or display a more user-friendly message within the page
        return; // Stop further processing
    }

    try {
        const response = await fetch('/shorten', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ longUrl })
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage); 
        }

        const data = await response.json();
        const shortUrl = data.shortUrl; 

        document.getElementById('shortUrl').textContent = shortUrl;
        document.getElementById('shortUrl').href = shortUrl; 


    } catch (error) {
        console.error('Error shortening URL:', error);
        document.getElementById('shortUrl').textContent = 'Error shortening URL. Please try again.';
    }
});

// Helper function to check if a string is a valid URL (simplified)
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
