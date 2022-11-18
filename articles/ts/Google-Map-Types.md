# Google Map Types
While working with Google Map library, I notice the Typescript types were causing some strange behavior or conflicts between VS Code and TS complier. I found this workaround.

> NOTE: Google maps is normally reloaded via a script tag within the index.html file. Not ES6 modules.

```ts
declare namespace google.maps {
    class LatLng {
        constructor(lat: number, lng: number)
    }
}

function onLoadGoogleMap(): { maps: any } {
    return {
        maps: google.maps
    }
}

function main() {
    // maps is loaded as any
    const { maps } = onLoadGoogleMap()
    // I want type information
    const googleMaps: {
        maps: typeof google.maps
    } = {
        maps: maps,
    }

    new googleMaps.maps.LatLng(12, 32)
}
```
