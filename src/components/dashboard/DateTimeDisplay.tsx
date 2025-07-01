
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-white/70" />
        <span className="text-sm text-white/90 font-medium">
          {formatDate(currentDateTime)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-white/70" />
        <span className="text-sm text-white/90 font-mono">
          {formatTime(currentDateTime)}
        </span>
      </div>
    </div>
  );
};
