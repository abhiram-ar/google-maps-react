import React, { useEffect } from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Circle } from "./components/circle";

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  {
    key: "kingStreetWharf",
    location: { lat: -33.8665445, lng: 151.1989808 },
  },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];

const App = () => (
  <APIProvider
    apiKey="Your API key here"
    onLoad={() => console.info("Maps JavaScriptAPI has been loaded")}
  >
    <h1>Hello, world!</h1>
    <Map
      defaultZoom={13}
      mapId="DEMO_MAP_ID"
      defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
      onCameraChanged={(ev: MapCameraChangedEvent) => {
        console.log(
          "camera changed:",
          ev.detail.center,
          "zoom:",
          ev.detail.zoom
        );
      }}
    >
      <PoiMarkers pois={locations} />
    </Map>
  </APIProvider>
);

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [circleCenter, setCircleCenter] = useState<google.maps.LatLng | null>(
    null
  );

  //  const geoCoder = new google.maps.Geocoder(); or use the hook below
  const geoCoderLibrary = useMapsLibrary("geocoding");
  const [geoCoder, setGeoCoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!geoCoderLibrary) return;
    setGeoCoder(new geoCoderLibrary.Geocoder());
  }, [geoCoderLibrary]);

  const handleClicke = (ev: google.maps.MapMouseEvent) => {
    if (!map || !ev.latLng) return;
    console.log("Clicked at: ", ev.latLng);
    map.panTo(ev.latLng);

    setCircleCenter(ev.latLng);

    if (!geoCoder) return;
    geoCoder.geocode({ location: ev.latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        console.log("Geocoder result: ", results[0].formatted_address);
      } else {
        console.warn("Geocoder failed due to: " + status);
      }
    });
  };
  return props.pois.map((poi) => (
    <>
      <Circle
        radius={800}
        center={circleCenter}
        strokeColor={"#0c4cb31a"}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={"#3b82f6"}
        fillOpacity={0.3}
      />

      <AdvancedMarker
        key={poi.key}
        position={poi.location}
        title={poi.key}
        gmpClickable={true}
        onClick={handleClicke}
        draggable={true}
        onDragEnd={handleClicke}
      >
        <Pin
          background={"#FBBC04"}
          glyphColor={"#000"}
          borderColor={"#000"}
        />
      </AdvancedMarker>
    </>
  ));
};

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

export default App;
