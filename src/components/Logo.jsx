export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 4 A16 16 0 0 1 36 20" stroke="#C8102E" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M36 20 A16 16 0 0 1 4 20" stroke="#C8102E" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <circle cx="20" cy="20" r="5" fill="#C8102E"/>
    </svg>
  );
}
