//let isLoaded = false;
export function loadGoogleMaps() {
    return new Promise((resolve) => {
        if (window.google?.maps?.places && customElements.get("gmp-placeautocomplete")) {
            resolve();
            return;
        }

        window.initMap = () => {
            //isLoaded = true;
            resolve();
        };

        const script = document.createElement("script");
        script.src =
            `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAP_KEY}&libraries=places,geometry&v=beta&callback=initMap`
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    });
}