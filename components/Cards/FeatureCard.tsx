"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../Button";

interface FeatureCardProps {
    icon: JSX.Element;
    title: string;
    description: string;
    benefits: string[];
    actionLabel: string;
    actionLink: string;
}

const FeatureCard = ({ icon, title, description, benefits, actionLabel, actionLink }: FeatureCardProps) => {
    const router = useRouter();
    return (
        <Card className="flex flex-col h-full rounded-xl border-none shadow-md">
            <CardHeader>
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    {icon}
                </div>
                <CardTitle className="text-xl mb-2">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button label={actionLabel} onClick={() => {
                    router.push('/profile');
                }} />
            </CardFooter>
        </Card>
    );
};

export default FeatureCard;
