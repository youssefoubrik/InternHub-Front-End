"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "@/public/icons/gps.png";
import { useUser } from "@/context/userContext";
import { cx } from "class-variance-authority";
import { MapLocation } from "@/types/types";

// This component will update the map view when position changes
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position[0] !== 0 || position[1] !== 0) {
      map.setView(position, 15);
    }
  }, [map, position]);

  return null;
}

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconSize: [80, 80],
  iconAnchor: [40, 40],
  popupAnchor: [-40, -40],
  shadowSize: [50, 50],
});

interface CompanyMapsProps {
  className?: string;
  location?: MapLocation | null;
}

export const CompanyMaps = ({
  className,
  location: locationOverride,
}: CompanyMapsProps) => {
  const { company } = useUser();
  const [position, setPosition] = React.useState<[number, number]>([0, 0]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const location = locationOverride ?? company?.location;

  React.useEffect(() => {
    const latitude = Number(location?.latitude);
    const longitude = Number(location?.longitude);
    if (
      location?.latitude !== null &&
      location?.latitude !== undefined &&
      location?.longitude !== null &&
      location?.longitude !== undefined &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      (latitude !== 0 || longitude !== 0)
    ) {
      const newPosition: [number, number] = [latitude, longitude];
      setPosition(newPosition);
      setIsLoaded(true);
    } else {
      setPosition([0, 0]);
      setIsLoaded(false);
    }
  }, [location?.latitude, location?.longitude]);

  const defaultPosition: [number, number] = [0, 0];
  const mapsUrl = isLoaded
    ? `https://www.google.com/maps?q=${position[0]},${position[1]}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company?.name || "company location")}`;

  return (
    <div className={cx("relative gap-2", className)}>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className=" absolute right-4 top-4 z-[1000] rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 "
      >
        View in Google Maps
      </a>
      <MapContainer
        className="flex-1 rounded-lg shadow-sm cursor-pointer"
        center={defaultPosition}
        zoom={2}
        style={{ height: "100%", minHeight: "260px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {isLoaded && (
          <>
            <Marker position={position} icon={customIcon} />
            <MapUpdater position={position} />
          </>
        )}
      </MapContainer>
    </div>
  );
};
