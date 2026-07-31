import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ value = 0, onChange, readonly = false, size = 20 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="star-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const activeRating = hoverValue || value;
        const isFilled = star <= activeRating;
        return (
          <Star
            key={star}
            size={size}
            className={`star ${isFilled ? 'active' : ''}`}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange && onChange(star)}
            style={{
              cursor: readonly ? 'default' : 'pointer',
              color: isFilled ? '#fbbf24' : '#334155',
              fill: isFilled ? '#fbbf24' : '#1e293b',
              strokeWidth: 1.5,
              transition: 'transform 0.15s ease, color 0.15s ease, fill 0.15s ease',
              transform: !readonly && hoverValue === star ? 'scale(1.2)' : 'scale(1)'
            }}
          />
        );
      })}
    </div>
  );
};
