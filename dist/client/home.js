/**
 * Generates the HTML for the home page
 * @returns Promise resolving to HTML string
 */
export const renderHomePage = async () => {
    return `
    <!-- Hero Section -->
    <section class="hero-section text-center py-5 bg-light">
        <div class="container">
            <h1 class="display-4">Welcome to Volunteer Connect</h1>
            <p class="lead">Your gateway to making a difference in the community.</p>
            <a href="#/opportunities" class="btn btn-primary btn-lg">Get Involved</a>
        </div>
    </section>

    <!-- Carousel Section -->
    <section id="volunteer-carousel" class="py-5">
        <div class="container">
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="content/images/volunteer-activity1.jpg" class="d-block w-100" alt="Volunteer Activity 1">
                    </div>
                    <div class="carousel-item">
                        <img src="content/images/volunteer-activity2.jpg" class="d-block w-100" alt="Volunteer Activity 2">
                    </div>
                    <div class="carousel-item">
                        <img src="content/images/volunteer-activity3.jpg" class="d-block w-100" alt="Volunteer Activity 3">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </section>
    `;
};
/**
 * Initializes home page functionality
 */
export const initHomePage = () => {
    // Initialize carousel
    const carousel = document.getElementById('carouselExampleIndicators');
    if (carousel) {
        // Carousel is initialized automatically by Bootstrap
        console.log('[INFO] Carousel initialized');
    }
    // Additional home page initialization if needed
};
export default { renderHomePage, initHomePage };
//# sourceMappingURL=home.js.map