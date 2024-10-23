export function HashtagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${className} size-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
      />
    </svg>
  );
}

export function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${className} size-6`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

export function LaughingEmojiIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`${className}`}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export function MessagesSquareIcon({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 200"
      className={className}
    >
      {/* Attributes Game Icon */}
      <g transform="translate(50, 50)">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          d="M50 20 L50 80 M20 50 L80 50"
          stroke="currentColor"
          stroke-width="4"
        />
        <circle
          cx="50"
          cy="35"
          r="15"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        />
        <path d="M35 65 L65 65" stroke="currentColor" stroke-width="3" />
      </g>

      {/* Tweets Game Icon */}
      <g transform="translate(300, 50)">
        <path
          d="M10 40 L90 40 L90 90 L55 90 L50 100 L45 90 L10 90 Z"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          d="M30 60 L70 60 M30 70 L60 70"
          stroke="currentColor"
          stroke-width="3"
        />
        <path
          d="M25 25 L35 15 L45 25"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        />
      </g>

      {/* Mind Maze Icon */}
      <g transform="translate(550, 50)">
        <path
          d="M20 20 L80 20 L80 80 L20 80 Z"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          d="M20 35 L65 35 L65 65 L35 65 L35 50 L50 50"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
        />
        <circle cx="73" cy="73" r="4" fill="currentColor" />
        <path
          d="M30 27 L40 27 M60 73 L70 73"
          stroke="currentColor"
          stroke-width="3"
        />
      </g>
    </svg>
  );
}
