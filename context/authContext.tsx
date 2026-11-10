"use client";
import { Role } from "@/types/types";
import { RequestWithAuth as fetchWithAuth } from "@/utils/auth";
import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

export interface User {
    id: string;
    email: string;
    profilePicture: string;
    role: Role;
    blocked: boolean;
    blockedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
interface AuthContextType {
    isAuthenticated: boolean;
    currentUser: User | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        // setLoading(true);
        // const data = await fetchWithAuth("/users/me");
        // console.log("data is data : ", data);
        // if (!data) {
        //   setLoading(false);
        //   logout();
        // }
        // setCurrentUser(data);
        // setIsAuthenticated(true);
        // setLoading(false);
        try {
            setLoading(true);
            const data = await fetchWithAuth("/users/me");
            if (data) {
                setCurrentUser(data);
                setIsAuthenticated(true);
            } else {
                await logout();
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            await logout();
        } finally {
            setLoading(false); // Always set loading to false when done
        }
    };

    // console.log("current User : ", currentUser);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiresIn = localStorage.getItem("expiresIn");
        if (token && expiresIn) {
            const expirationTime = parseInt(expiresIn);
            if (Date.now() < expirationTime) {
                fetchUser();
            } else {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, []);

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("expiresIn");
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoading(false);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                currentUser,
                loading,
                setLoading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
