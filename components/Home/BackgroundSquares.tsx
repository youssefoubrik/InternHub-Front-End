import React, { useEffect, useState } from 'react'
import { Square } from './Square';
import { STYLE_CONSTANTS } from '@/constants/styles-constants';

function BackgroundSquares() {
    const [squares, setSquares] = useState<SquareProps[]>([]);

    useEffect(() => {
        const newSquares = STYLE_CONSTANTS.squares;

        setSquares(newSquares);
    }, []);
    
    return (
            <div className="absolute inset-0 overflow-hidden">
                {squares.map((square, index) => (
                    <Square key={index} {...square} />
                ))}
            </div>
    )
}

export default BackgroundSquares