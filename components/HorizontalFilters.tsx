"use client";
import React, { useState, ChangeEvent } from "react";
import { useFilters } from "@/context/FiltersContext";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import InputField from "./InputField";

function HorizontalFilters() {
  const { handleFilterChange, filters, setFilters } = useFilters();
  const [showClearFilters, setShowClearFilters] = useState(false);

  const clearAllFilters = () => {
    setFilters({
      remote: false,
      onSite: false,
      hybrid: false,
      pfa: false,
      pfe: false,
      initiation: false,
      paid: null,
      location: "",
      title: "",
    });
    setShowClearFilters(false);
  };

  const getLocationText = () => {
    if (filters.location) return filters.location;
    return "Location";
  };

  // Helper function to get active filter text
  const getJobTypeText = () => {
    const activeTypes = [];
    if (filters.remote) activeTypes.push("Remote");
    if (filters.onSite) activeTypes.push("On-site");
    if (filters.hybrid) activeTypes.push("Hybrid");

    return activeTypes.length > 0 ? activeTypes.join(", ") : "Work Mode";
  };

  const getExperienceText = () => {
    const activeTypes = [];
    if (filters.pfa) activeTypes.push("PFA");
    if (filters.pfe) activeTypes.push("PFE");
    if (filters.initiation) activeTypes.push("Initiation");

    return activeTypes.length > 0 ? activeTypes.join(", ") : "Internship Type";
  };

  const getPaidText = () => {
    if (filters.paid === true) return "Paid";
    if (filters.paid === false) return "Not Paid";
    return "Salary";
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, title: e.target.value }));
    setShowClearFilters(true);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
    setShowClearFilters(true);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/70 rounded-lg text-black divide-y-2 divide-primary p-3 grid grid-cols-1 md:grid-cols-2 items-stretch lg:grid-cols-5 lg:h-28 lg:items-center lg:divide-y-0 lg:divide-x-4 lg:p-4"
      >
        {/* Search Field */}
        <div className="relative flex col-span-1 md:col-span-2 lg:col-span-1 min-w-0 w-full items-center gap-2 py-2 text-black pl-4">
          <Search className="h-5 w-5 text-primary z-50 absolute ml-2" />
          <InputField
            type="text"
            placeholder="Search Internships..."
            value={filters.title}
            onChange={handleSearchChange}
            className="border-none bg-transparent text-black pl-8 focus:ring-primary w-full rounded-md"
          />
        </div>

        {/* Location Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-full flex flex-1 justify-center"
          >
            <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-black hover:text-primary transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 border-none">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{getLocationText()}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setFilters((prev) => ({ ...prev, location: "Casablanca" }));
                setShowClearFilters(true);
              }}
            >
              Casablanca
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setFilters((prev) => ({ ...prev, location: "Rabat" }));
                setShowClearFilters(true);
              }}
            >
              Rabat
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setFilters((prev) => ({ ...prev, location: "Marrakech" }));
                setShowClearFilters(true);
              }}
            >
              Marrakech
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setFilters((prev) => ({ ...prev, location: "Tangier" }));
                setShowClearFilters(true);
              }}
            >
              Tangier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setFilters((prev) => ({ ...prev, location: "Agadir" }));
                setShowClearFilters(true);
              }}
            >
              Agadir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Internship Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-full flex flex-1 justify-center"
          >
            <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-black hover:text-primary transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 border-none">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>{getExperienceText()}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("pfa", !filters.pfa);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.pfa}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>PFA</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("pfe", !filters.pfe);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.pfe}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>PFE</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("initiation", !filters.initiation);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.initiation}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>Initiation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Work Mode Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-full flex flex-1 justify-center"
          >
            <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-black hover:text-primary transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 border-none">
              <Clock className="h-5 w-5 text-primary" />
              <span>{getJobTypeText()}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("remote", !filters.remote);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.remote}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>Remote</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("onSite", !filters.onSite);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.onSite}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>On-site</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("hybrid", !filters.hybrid);
                setShowClearFilters(true);
              }}
            >
              <input
                type="checkbox"
                checked={filters.hybrid}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>Hybrid</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Paid Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="w-full flex flex-1 justify-center"
          >
            <button className="flex w-full items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-black hover:text-primary transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 border-none">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>{getPaidText()}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("paid", null);
                setShowClearFilters(true);
              }}
            >
              <input
                type="radio"
                checked={filters.paid === null}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>All</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("paid", true);
                setShowClearFilters(true);
              }}
            >
              <input
                type="radio"
                checked={filters.paid === true}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>Paid</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleFilterChange("paid", false);
                setShowClearFilters(true);
              }}
            >
              <input
                type="radio"
                checked={filters.paid === false}
                onChange={() => {}}
                className="h-4 w-4"
              />
              <span>Not Paid</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Search Internships Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mt-8 mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-semibold text-gray-800"
          >
            Search Internships
          </motion.h2>
          {showClearFilters && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Clear Filters
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default HorizontalFilters;
