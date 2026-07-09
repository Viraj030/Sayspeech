'use client';

import React from 'react';

interface WelcomeScreenProps {
  title: string;
  description: string;
  onStart: () => void;
}

export default function WelcomeScreen({ }: WelcomeScreenProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* Full screen cover background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/make_a_dosa_images/cover-img.jpeg"
        alt="Say Speech Welcome Cover"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
    </div>
  );
}
