

/**
 * Interface for gallery image data
 */
interface GalleryImage {
    src: string;
    thumbnail: string;
    title: string;
    description: string;
}

/**
 * Interface for gallery data
 */
interface GalleryData {
    images: GalleryImage[];
}

/**
 * Generates the HTML for the gallery page
 * @returns Promise resolving to HTML string
 */
export const renderGalleryPage = async (): Promise<string> => {
    try {
        const response = await fetch("views/content/gallery.html");
        const html = await response.text();
        return html;
    } catch (error) {
        console.error(`[ERROR] Failed to load gallery page content: ${error}`);
        
        // Fallback content in case the file can't be loaded
        return `
        <main>
            <section class="gallery-section container py-5">
                <h1 class="text-center mb-5">Photo Gallery</h1>
                <div class="alert alert-danger">
                    Failed to load gallery page content. Please try again later.
                </div>
            </section>
        </main>
        `;
    }
};

/**
 * Initializes gallery page functionality
 */
export const initGalleryPage = async (): Promise<void> => {
    try {
        // Load gallery images
        await loadGalleryImages();
        
    } catch (error) {
        console.error('[ERROR] Failed to initialize gallery page:', error);
        const galleryContainer = document.getElementById('gallery-container');
        if (galleryContainer) {
            galleryContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load gallery images. Please try again later.
                    </div>
                </div>
            `;
        }
    }
};

/**
 * Loads gallery images from the server and displays them
 */
const loadGalleryImages = async (): Promise<void> => {
    try {
        // Fetch the gallery data
        const response = await fetch('data/gallery.json');
        if (!response.ok) {
            throw new Error('Failed to load gallery data');
        }
        
        const galleryData: GalleryData = await response.json();
        const galleryContainer = document.getElementById('gallery-container');
        
        if (!galleryContainer) {
            console.error('[ERROR] Gallery container not found');
            return;
        }
        
        // Clear loading indicator
        galleryContainer.innerHTML = '';
        
        // Check if there are images to display
        if (!galleryData.images || galleryData.images.length === 0) {
            galleryContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No gallery images available at this time.
                    </div>
                </div>
            `;
            return;
        }
        
        // Create HTML for each image
        galleryData.images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('col-md-4', 'mb-4');
            
            const imageLink = document.createElement('a');
            imageLink.href = image.src;
            imageLink.setAttribute('data-title', image.title);
            imageLink.classList.add('gallery-item');
            
            const imgElement = document.createElement('img');
            imgElement.src = image.thumbnail;
            imgElement.alt = image.title;
            imgElement.classList.add('img-fluid', 'rounded');
            
            // Create caption with title
            const caption = document.createElement('div');
            caption.classList.add('text-center', 'mt-2');
            caption.textContent = image.title;
            
            // Append elements
            imageLink.appendChild(imgElement);
            imageItem.appendChild(imageLink);
            imageItem.appendChild(caption);
            galleryContainer.appendChild(imageItem);
        });
        
        // Initialize lightGallery
        initLightGallery();
        
    } catch (error) {
        console.error('[ERROR] Failed to load gallery images:', error);
        throw error;
    }
};

/**
 * Initializes the lightGallery plugin for the gallery
 */
const initLightGallery = (): void => {
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!galleryContainer) {
        console.error('[ERROR] Gallery container not found');
        return;
    }
    
    try {
        // @ts-ignore - lightGallery is loaded globally
        lightGallery(galleryContainer, {
            selector: '.gallery-item',
            download: false,
            counter: true,
            mousewheel: true
        });
    } catch (error) {
        console.error('[ERROR] Failed to initialize lightGallery:', error);
    }
};

export default { renderGalleryPage, initGalleryPage };