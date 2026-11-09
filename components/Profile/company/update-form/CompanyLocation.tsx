"use client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "@/public/icons/gps.png";
import { useCompanyProfileDraftStore } from "@/stores/companyProfileDraftStore";

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, 0],
  shadowSize: [50, 50],
});

const LocationSelector = ({
  setPosition,
}: {
  setPosition: (position: [number, number]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export const CompanyLocation = () => {
  const company = useCompanyProfileDraftStore((state) => state.draft);
  const updateDraft = useCompanyProfileDraftStore((state) => state.updateDraft);
  const [position, setPosition] = useState<[number, number]>([
    company?.location?.latitude ?? 33.587418,
    company?.location?.longitude ?? -7.664078,
  ]);

  useEffect(() => {
    updateDraft((draft) => ({
      ...draft,
      location: { latitude: position[0], longitude: position[1] },
    }));
  }, [position, updateDraft]);

  return (
    <div className="w-full mt-5 flex flex-col gap-4">
      <MapContainer
        className="rounded-lg shadow-sm cursor-pointer"
        center={position}
        zoom={20}
        style={{ height: "700px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          icon={customIcon}
          eventHandlers={{
            add: (e) => {
              e.target.openPopup();
            },
          }}
        >
          <Popup autoClose={false}>
            <span className="text-sm">Choose Your Company Location</span>
          </Popup>
        </Marker>
        <LocationSelector setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};
