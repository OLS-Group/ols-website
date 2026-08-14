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
    const searchInput = document.getElementById("resource-search");
    const typeFilter = document.getElementById("resource-type-filter");
    const topicFilter = document.getElementById("resource-topic-filter");

    let allResources = [];

    function getAsset(resource) {
        return assetMap[resource.featuredAssetId] || "assets/OLS-WEB-V2-RSC-A001.jpg";
    }

    function renderFeatured(resources) {

        const featuredResources =
            resources.filter(r => r.featured === true);

        featuredContainer.innerHTML =
            featuredResources.map(resource => `
                <a href="${resource.url}" class="canon-card">
                    <div>
                        <span class="card-kicker">
                            ${resource.resourceType}
                        </span>

                        <h3>
                            ${resource.title}
                        </h3>

                        <p>
                            ${resource.description}
                        </p>

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
            `).join("");

    }

    function renderLibrary(resources) {

        libraryContainer.innerHTML =
            resources.map(resource => `
                <div class="library-item">

                    <span class="library-type">
                        ${resource.resourceType}
                    </span>

                    <a class="library-title"
                       href="${resource.url}">
                        ${resource.title}
                    </a>

                    <span class="library-theme">
                        ${resource.primaryTopic}
                    </span>

                    <a class="library-read"
                       href="${resource.url}">
                        Open →
                    </a>

                </div>
            `).join("");

    }

    function applyFilters() {

        const search =
            (searchInput.value || "").toLowerCase();

        const selectedType =
            typeFilter.value || "All";

        const selectedTopic =
            topicFilter.value || "All";

        const filtered =
            allResources.filter(resource => {

                const text =
                    JSON.stringify(resource)
                    .toLowerCase();

                const matchSearch =
                    !search || text.includes(search);

                const matchType =
                    selectedType === "All" ||
                    resource.resourceType === selectedType;

                const matchTopic =
                    selectedTopic === "All" ||
                    resource.primaryTopic === selectedTopic;

                return matchSearch &&
                       matchType &&
                       matchTopic;
            });

        renderLibrary(filtered);

    }

    try {

        const response =
            await fetch("data/resources.json");

        allResources =
            await response.json();

        renderFeatured(allResources);

        renderLibrary(allResources);

        const types =
            [...new Set(
                allResources.map(r => r.resourceType)
            )].sort();

        const topics =
            [...new Set(
                allResources.map(r => r.primaryTopic)
            )].sort();

        typeFilter.innerHTML =
            '<option value="All">All Resource Types</option>' +
            types.map(t =>
                `<option value="${t}">${t}</option>`
            ).join("");

        topicFilter.innerHTML =
            '<option value="All">All Topics</option>' +
            topics.map(t =>
                `<option value="${t}">${t}</option>`
            ).join("");

        searchInput.addEventListener(
            "input",
            applyFilters
        );

        typeFilter.addEventListener(
            "change",
            applyFilters
        );

        topicFilter.addEventListener(
            "change",
            applyFilters
        );

    }
    catch (error) {

        console.error(error);

    }

})();
