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

    function escapeHtml(value) {
        return String(value || "");
    }

    function getAsset(resource) {
        return assetMap[resource.featuredAssetId] || "assets/OLS-WEB-V2-RSC-A001.jpg";
    }

    function renderFeatured(resources) {

        const featuredResources =
            resources.filter(r => r.featured === true);

        if (!featuredResources.length) {

            featuredContainer.innerHTML =
                '<div class="resource-empty">No featured resources found.</div>';

            return;
        }

        featuredContainer.innerHTML =
            featuredResources.map(resource => {

                return `
                    <a
                        href="${resource.url}"
                        class="canon-card"
                        style="
                            background:
                            linear-gradient(rgba(255,255,255,0.90), rgba(255,255,255,0.90)),
                            url('${getAsset(resource)}')
                            center center / cover no-repeat;
                        "
                    >

                        <div>

                            <span class="card-kicker">
                                ${escapeHtml(resource.resourceType)}
                            </span>

                            <h3>
                                ${escapeHtml(resource.title)}
                            </h3>

                            <p>
                                ${escapeHtml(resource.description)}
                            </p>

                            <div class="card-meta">

                                <span class="meta-pill">
                                    Topic: ${escapeHtml(resource.primaryTopic)}
                                </span>

                                <span class="meta-pill">
                                    ${escapeHtml(resource.contentId)}
                                </span>

                            </div>

                        </div>

                        <span class="card-action">
                            Open Resource →
                        </span>

                    </a>
                `;

            }).join("");

    }

    function renderLibrary(resources) {

        if (!resources.length) {

            libraryContainer.innerHTML =
                '<div class="resource-empty">No resources found.</div>';

            return;
        }

        libraryContainer.innerHTML =
            resources.map(resource => {

                return `
                    <div class="library-item">

                        <span class="library-type">
                            ${escapeHtml(resource.resourceType)}
                        </span>

                        <a
                            class="library-title"
                            href="${resource.url}"
                        >
                            ${escapeHtml(resource.title)}
                        </a>

                        <span class="library-theme">
                            ${escapeHtml(resource.primaryTopic)}
                        </span>

                        <a
                            class="library-read"
                            href="${resource.url}"
                        >
                            Open →
                        </a>

                    </div>
                `;

            }).join("");

    }

    function applyFilters() {

        const search =
            (searchInput?.value || "").toLowerCase();

        const resourceType =
            typeFilter?.value || "All";

        const topic =
            topicFilter?.value || "All";

        const filtered = allResources.filter(resource => {

            const searchMatch =
                !search ||
                JSON.stringify(resource)
                    .toLowerCase()
                    .includes(search);

            const typeMatch =
                resourceType === "All" ||
                resource.resourceType === resourceType;

            const topicMatch =
                topic === "All" ||
                resource.primaryTopic === topic;

            return searchMatch && typeMatch && topicMatch;

        });

        renderLibrary(filtered);

    }

    try {

        const response =
            await fetch("data/resources.json");

        if (!response.ok) {

            throw new Error(
                "Unable to load resources.json"
            );

        }

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

        if (typeFilter) {

            typeFilter.innerHTML =
                '<option value="All">All Resource Types</option>' +
                types.map(type =>
                    `<option value="${type}">${type}</option>`
                ).join("");

        }

        if (topicFilter) {

            topicFilter.innerHTML =
                '<option value="All">All Topics</option>' +
                topics.map(topic =>
                    `<option value="${topic}">${topic}</option>`
                ).join("");

        }

        searchInput?.addEventListener("input", applyFilters);
        typeFilter?.addEventListener("change", applyFilters);
        topicFilter?.addEventListener("change", applyFilters);

    }
    catch (error) {

        console.error(error);

        if (featuredContainer) {

            featuredContainer.innerHTML =
                '<div class="resource-load-error">Unable to load featured resources.</div>';

        }

        if (libraryContainer) {

            libraryContainer.innerHTML =
                '<div class="resource-load-error">Unable to load resources.</div>';

        }

    }

})();
