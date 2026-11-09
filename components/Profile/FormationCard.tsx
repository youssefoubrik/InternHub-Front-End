"use client";
import React, { useEffect, useState } from "react";
import PlusButton from "../PlusButton";
import { Formation, Role } from "@/types/types";
import { useUser } from "@/context/userContext";
import { useAuth } from "@/context/authContext";
import FormationInfos from "./FormationInfos";
import { useProfileEditLockStore } from "@/stores/profileEditLockStore";

const FormationCard = () => {
  // const initialFormations : Formation[] = [
  //   {
  //     domain: "Software Engineer",
  //     endDate: "PRESENT",
  //     startDate: "Jan 2024",
  //     company: {
  //       logo: "https://media.licdn.com/dms/image/v2/C4D0BAQGtcwAc6qRA0w/company-logo_100_100/company-logo_100_100/0/1644231566716/ensa_agadir_logo?e=1747872000&v=beta&t=PA1fUwEusomUhMnrb4S73Pl2zzn2zno2wktXTzueHBc",
  //       name: "Ecole Nationale des Sciences Appliquees de Agadir",
  //       address : "Agadir"
  //     },
  //     diploma : "Cycle Ingenieur"
  //   },
  //   {
  //     domain: "Computer Science Student",
  //     endDate: "May 2023",
  //     startDate: "Feb 2023",
  //     company: {
  //       logo: "https://imgs.search.brave.com/SaJEFkC6CkHpv_F2fJqFC5PB1NSDKGGr8LWLC8FZb88/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9vcmFjbGUt/b3JpZ2luYWwtaWNv/bi0yMDQ4eDI2Ni02/eDJwOWZjby5wbmc",
  //       name: "Faculte de Sciences et Techniques de Mohammedia",
  //       address : "Mohammedia"
  //     },
  //     diploma : "License ST"
  //   },
  // ];

  const { student, isUserProfile } = useUser();
  const { currentUser } = useAuth();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [wantToAdd, setWantToAdd] = useState<boolean>(false);
  const acquireEditor = useProfileEditLockStore((state) => state.acquire);

  useEffect(() => {
    if (student?.formations) {
      setFormations(student?.formations);
    }
  }, [student?.formations]);

  return (
    <div className="bg-gray-50 border-primary-hover shadow-sm rounded-lg py-6 px-5 w-full space-y-7">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl text-gray-800 font-medium">Education</h2>
      </div>
      <div className="px-4 space-y-4">
        {formations.length === 0 && !isUserProfile && (
          <div className="col-span-4 text-center">
            <p className="text-lg text-gray-600">No Education found.</p>
          </div>
        )}
        {formations.map((formation, index) => (
          <FormationInfos
            key={index}
            object={formation}
            setWantToAdd={setWantToAdd}
            setFormations={setFormations}
            FLAG="VIEW"
          />
        ))}
        {isUserProfile &&
          (wantToAdd ? (
            <FormationInfos
              object={null}
              setWantToAdd={setWantToAdd}
              setFormations={setFormations}
              FLAG="NEW"
            />
          ) : (
            <PlusButton onClick={() => {
              if (acquireEditor("formation-new")) setWantToAdd(true);
            }} />
          ))}
      </div>
    </div>
  );
};

export default FormationCard;
