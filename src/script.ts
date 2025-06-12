interface SurveyData {
    name: string;
    phone: string;
    email: string;
    overall_rating: number;
    overall_comments: string;
    food_rating: number;
    food_comments: string;
    decor_rating: number;
    decor_comments: string;
    entertainment_rating: number;
    entertainment_comments: string;
    timestamp: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm') as HTMLFormElement;
    const thankYouDiv = document.getElementById('thankYou') as HTMLDivElement;
    const starRatings = document.querySelectorAll('.star-rating');
    const ratings: { [key: string]: number } = {};

    // Initialize star rating functionality
    starRatings.forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('.star');
        const ratingType = ratingContainer.getAttribute('data-rating') || '';

        stars.forEach((star: Element, index: number) => {
            star.addEventListener('click', () => {
                const value = index + 1;
                ratings[ratingType] = value;
                
                // Update visual state
                stars.forEach((s, i) => {
                    if (i < value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            // Hover effect
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        (s as HTMLElement).style.color = '#ffd700';
                    } else {
                        (s as HTMLElement).style.color = '#ddd';
                    }
                });
            });
        });

        // Reset hover effect
        ratingContainer.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => {
                if (s.classList.contains('active')) {
                    (s as HTMLElement).style.color = '#ffd700';
                } else {
                    (s as HTMLElement).style.color = '#ddd';
                }
            });
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate ratings
        const requiredRatings = ['overall', 'food', 'decor', 'entertainment'];
        const missingRatings = requiredRatings.filter(rating => !ratings[rating]);
        
        if (missingRatings.length > 0) {
            alert(`Please rate: ${missingRatings.join(', ')}`);
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const surveyData: SurveyData = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            overall_rating: ratings.overall,
            overall_comments: formData.get('overall_comments') as string,
            food_rating: ratings.food,
            food_comments: formData.get('food_comments') as string,
            decor_rating: ratings.decor,
            decor_comments: formData.get('decor_comments') as string,
            entertainment_rating: ratings.entertainment,
            entertainment_comments: formData.get('entertainment_comments') as string,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/submit-survey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(surveyData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show thank you message
                form.style.display = 'none';
                thankYouDiv.classList.remove('hidden');
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                if (result.error === 'duplicate') {
                    alert('You have already submitted a survey with this email address.');
                } else {
                    alert('There was an error submitting your survey. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your survey. Please try again.');
        }
    });
});