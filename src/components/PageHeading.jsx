/**
 * Main page title — matches the home hero (“Plan trades with clarity”) typography.
 */
export default function PageHeading({ children, className = '' }) {
  return (
    <h1
      className={`text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 md:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}
