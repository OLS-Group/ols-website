(async function () {
    "use strict";

    const assetMap = {
        "OLS-WEB-V2-CAN-VIS-A001": "assets/OLS-WEB-V2-RSC-A001.jpg",
        "OLS-WEB-V2-CAN-TRUST-A001": "assets/OLS-WEB-V2-RSC-B001.jpg",
        "OLS-WEB-V2-CAN-ACC-A001": "assets/OLS-WEB-V2-RSC-C001.jpg",
        "OLS-WEB-V2-CAN-EXEC-A001": "assets/OLS-WEB-V2-RSC-D001.jpg",
        "OLS-WEB-V2-INS-LEAD-A001": "assets/OLS-WEB-V2-RSC-E001.jpg"
    };

    const featuredContainer = document.getElementById("featured-resources");
    const libraryContainer = document.getElementById("knowledge-library");

    try {

        const response = await fetch("data/resources.json");

        if (!response.ok) {
            throw new Error("Unable to load resources.json");
        }

        const resources = await response.json();

        const featuredResources = resources.filter(r => r.featured === true);

        featuredContainer.innerHTML = featuredResources.map(resource => {
            return `
                ${resource.url}rgba(255,255,255,0.90)),
                   url('${assetMap[resource.featuredAssetId] || "assets/OLS-WEB-V2-RSC-A001.jpg"}')
                   center center / cover no-repeat;">
                    <div>
                        <span class="card-kicker">${resource.resourceType}</span>

                        <h3>${resource.title}</h3>

                        <p>${resource.description}</p>

                        <div class="card-meta">
                            <span class="meta-pill">
                                Topic: ${resource.primaryTopic}
                            </span>

                            <span class="meta-pill">
                                ${resource.contentId}
                            </span>
                        </div>
                    </div>

                    <span class="card-action">
                        Open Resource →
                    </span>
                </a>
            `;
        }).join("");

        libraryContainer.innerHTML = resources.map(resource => {
            return `
                <div class="library-item">

                    <span class="library-type">
                        ${resource.resourceType}
                    </span>

                    ${resource.url}
                        ${resource.title}
                    </a>

                    <span class="library-theme">
                        ${resource.primaryTopic}
                    </span>

                    ${resource.url}
                        Open →
                    </a>

                </div>
            `;
        }).join("");

    } catch (error) {

        console.error(error);

        if (featuredContainer) {
            featuredContainer.innerHTML =
                "<p>Unable to load featured resources.</p>";
        }

        if (libraryContainer) {
            libraryContainer.innerHTML =
                "<p>Unable to load library resources.</p>";
        }
    }

})();
