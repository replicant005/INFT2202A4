

/**
 * Interface for news article data
 */
interface NewsArticle {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source?: {
        name: string;
    };
}

/**
 * Interface for news API response
 */
interface NewsApiResponse {
    articles: NewsArticle[];
    status: string;
    totalResults: number;
}

/**
 * Generates the HTML for the news page
 * @returns Promise resolving to HTML string
 */
export const renderNewsPage = async (): Promise<string> => {
    try {
        const response = await fetch("views/content/news.html");
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`[ERROR] Failed to load news page content: ${error}`);
        
        // Fallback content in case the file can't be loaded
        return `
        <main class="container my-4">
            <h1 class="text-center"><i class="fa-solid fa-newspaper"></i> Oshawa News</h1>
            <div class="alert alert-danger">
                Failed to load news page content. Please try again later.
            </div>
        </main>
        `;
    }
};

/**
 * Initializes news page functionality
 */
export const initNewsPage = async (): Promise<void> => {
    try {
        // Fetch and display news
        console.log("Going to Fetch News");
        await displayNews();
    } catch (error) {
        console.error('[ERROR] Failed to initialize news page:', error);
        const newsList = document.getElementById('news-list');
        if (newsList) {
            newsList.innerHTML = `
                <div class="alert alert-danger">
                    Unable to load news at this time. Please try again later.
                </div>
            `;
        }
    }
};

/**
 * Fetches and displays news articles
 */
const displayNews = async (): Promise<void> => {
    console.log("[INFO] Fetching news articles for Oshawa...");
    
    const newsList = document.getElementById('news-list');
    if (!newsList) {
        console.error("[ERROR] News container not found in the DOM");
        return;
    }
    
    try {
        // Add debug console logs
        console.log("[DEBUG] Before calling getSimulatedNews()");
        const newsData = await getSimulatedNews();
        console.log("[DEBUG] After calling getSimulatedNews()", newsData);
        
        // Clear loading message
        newsList.innerHTML = "";
        
        if (!newsData || !newsData.articles || newsData.articles.length === 0) {
            newsList.innerHTML = "<p class='alert alert-info'>No recent news available for Oshawa.</p>";
            return;
        }
        
        // Display up to 5 news articles
        newsData.articles.slice(0, 5).forEach((article, index) => {
            console.log(`[DEBUG] Processing article #${index}:`, article);
            
            const articleDate = new Date(article.publishedAt);
            const formattedDate = articleDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const articleElement = document.createElement("div");
            articleElement.classList.add("news-article", "card", "mb-4", "shadow-sm");
            articleElement.innerHTML = `
                <div class="card-body">
                    <h3 class="card-title">
                        <a href="${article.url}" target="_blank">${article.title}</a>
                    </h3>
                    <p class="card-text">${article.description || "No description available."}</p>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Published: ${formattedDate}</small>
                        ${article.source?.name ? `<small class="text-muted">Source: ${article.source.name}</small>` : ''}
                    </div>
                </div>
            `;
            newsList.appendChild(articleElement);
        });
    } catch (error) {
        console.error("[ERROR] Failed to fetch news data:", error);
        newsList.innerHTML = "<p class='alert alert-danger'>Unable to load news at this time.</p>";
    }
};

/**
 * Gets simulated news data (since we don't have a real API key)
 * @returns Promise resolving to simulated news API response
 */
const getSimulatedNews = async (): Promise<NewsApiResponse> => {
    // Simulate an API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return simulated news data
    return {
        status: "ok",
        totalResults: 5,
        articles: [
            {
                title: "New Community Center Opening in Downtown Oshawa",
                description: "The city of Oshawa will be opening a state-of-the-art community center next month, offering various programs for residents of all ages.",
                url: "#",
                publishedAt: "2025-03-15T09:30:00Z",
                source: {
                    name: "Oshawa Times"
                }
            },
            {
                title: "Volunteer Drive Exceeds Expectations",
                description: "The recent volunteer recruitment drive in Oshawa has exceeded all expectations, with over 500 new volunteers signing up to help local organizations.",
                url: "#",
                publishedAt: "2025-03-12T14:45:00Z",
                source: {
                    name: "Community News"
                }
            },
            {
                title: "Local Schools Partner with Businesses for Internship Program",
                description: "Oshawa schools are partnering with local businesses to provide students with valuable work experience through a new internship program.",
                url: "#",
                publishedAt: "2025-03-10T11:20:00Z",
                source: {
                    name: "Education Herald"
                }
            },
            {
                title: "Environmental Clean-up Event Scheduled for Next Month",
                description: "Volunteers are invited to join a city-wide environmental clean-up event scheduled for next month, aiming to beautify parks and public spaces.",
                url: "#",
                publishedAt: "2025-03-08T16:15:00Z",
                source: {
                    name: "Green Initiatives"
                }
            },
            {
                title: "Food Bank Seeks Donations Amid Increasing Demand",
                description: "The Oshawa Food Bank is seeking donations as demand for services has increased by 30% in the past quarter. Non-perishable food items and volunteer time are both needed.",
                url: "#",
                publishedAt: "2025-03-05T10:00:00Z",
                source: {
                    name: "Community Support Network"
                }
            }
        ]
    };
};

export default { renderNewsPage, initNewsPage };