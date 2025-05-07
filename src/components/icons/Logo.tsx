import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="EduCentral Logo"
      {...props}
    >
      <rect width="200" height="50" rx="5" fill="currentColor" className="text-primary dark:text-primary" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
      >
        EduCentral
      </text>
    </svg>
  );
}
