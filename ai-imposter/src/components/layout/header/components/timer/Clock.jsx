const Clock = ({ angle = 0, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />

      <path
        d="M12 6v6"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: "12px 12px",
          transition: "transform 0.2s ease-in-out",
        }}
      />
    </svg>
  );
};

export default Clock;
