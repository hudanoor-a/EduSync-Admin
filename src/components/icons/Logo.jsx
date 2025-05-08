export function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="EduCentral Logo"
      {...props}
    >
      {/* Ensure currentColor works as expected or hardcode the HSL variable */}
      <rect width="200" height="50" rx="5" fill="hsl(var(--primary))" /> 
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