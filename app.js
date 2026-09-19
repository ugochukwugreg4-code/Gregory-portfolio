document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("js-enabled");

    setupMobileMenu();
    setupHeaderScroll();
    setupScrollReveal();
    setupProjectAccordions();
    setupCurrentYear();
    setupPageTransitions();
});


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-navigation");

    if (!menuToggle || !navigation) return;

    const openMenu = () => {
        menuToggle.classList.add("active");
        navigation.classList.add("open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        if (window.innerWidth <= 700) {
            document.body.classList.add("menu-open");
        }
    };

    const closeMenu = () => {
        menuToggle.classList.remove("active");
        navigation.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (navigation.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navigation.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            navigation.classList.contains("open") &&
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMenu();
        }
    });
}


/* =========================================================
   HEADER SCROLL
   ========================================================= */

function setupHeaderScroll() {
    const header = document.querySelector(".site-header");

    if (!header) return;

    let ticking = false;

    window.addEventListener(
        "scroll",
        () => {
            if (ticking) return;

            window.requestAnimationFrame(() => {
                header.classList.toggle(
                    "scrolled",
                    window.scrollY > 20
                );

                ticking = false;
            });

            ticking = true;
        },
        { passive: true }
    );
}


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

function setupScrollReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        elements.forEach((element) => {
            element.classList.add("revealed");
        });

        return;
    }

    elements.forEach((element, index) => {
        element.style.transitionDelay =
            `${Math.min(index * 45, 280)}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                } else {
                    entry.target.classList.remove("revealed");
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* =========================================================
   PROJECT ACCORDIONS
   ========================================================= */

function setupProjectAccordions() {
    const buttons =
        document.querySelectorAll(".project-toggle");

    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".project-card");

            if (!card) return;

            const details =
                card.querySelector(".project-details");

            if (!details) return;

            const isOpen =
                details.classList.contains("open");

            document
                .querySelectorAll(".project-details.open")
                .forEach((otherDetails) => {
                    if (otherDetails === details) return;

                    otherDetails.classList.remove("open");

                    const otherCard =
                        otherDetails.closest(".project-card");

                    const otherButton =
                        otherCard?.querySelector(".project-toggle");

                    if (otherButton) {
                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        const text =
                            otherButton.querySelector(".toggle-text");

                        if (text) {
                            text.textContent = "View Details";
                        }
                    }
                });

            details.classList.toggle(
                "open",
                !isOpen
            );

            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            const text =
                button.querySelector(".toggle-text");

            if (text) {
                text.textContent =
                    isOpen
                        ? "View Details"
                        : "Hide Details";
            }
        });
    });
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function setupCurrentYear() {
    const elements =
        document.querySelectorAll(".current-year");

    const year = new Date().getFullYear();

    elements.forEach((element) => {
        element.textContent = year;
    });
}


/* =========================================================
   PAGE TRANSITIONS
   ========================================================= */

function setupPageTransitions() {
    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) return;

    document
        .querySelectorAll('a[href$=".html"]')
        .forEach((link) => {

            link.addEventListener("click", (event) => {

                const url = new URL(
                    link.href,
                    window.location.href
                );

                if (
                    url.origin !==
                    window.location.origin
                ) {
                    return;
                }

                if (
                    url.pathname ===
                    window.location.pathname
                ) {
                    return;
                }

                event.preventDefault();

                document.body.classList.add(
                    "page-exit"
                );

                window.setTimeout(() => {
                    window.location.href =
                        link.href;
                }, 220);
            });
        });
}